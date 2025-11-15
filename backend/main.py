import os
import base64
import requests
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

app = FastAPI()

# Allow requests from your frontend (e.g., localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in production, specify your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.post("/upload")
async def upload_file(file: UploadFile = File(...), style: int = Form(...), personalization: str = Form(None)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    # Save the uploaded file temporarily
    contents = await file.read()
    filename = file.filename
    os.makedirs("uploads", exist_ok=True)
    file_path = f"uploads/{filename}"
    with open(file_path, "wb") as f:
        f.write(contents)
    
    # text = contents.decode("utf-8")
    # print(text)

    # Read file content (assuming text file for notes)
    try:
        with open(file_path, "r") as f:
            file_content = f.read()
    except UnicodeDecodeError:
        # Handle non-text files (e.g., PDFs would need additional libraries)
        raise HTTPException(status_code=400, detail="File must be a text file")

    #Use OpenAI to summarize the notes
    try:
        # Adjust prompt based on style (you can customize prompts per style)
        style_prompts = {
            1: "From these notes, summarize the key points, generate a script that I will input in Text to Speech in the style of Ray William Johnson's True Crime Stories on Tiktok. The script should be for an audio less than 1 minute. Make sure to use the key points from the notes in generating the script. Don't bother adding any sound effects or editing. Just give the raw text",
            2: "Summarize in a fun, energetic TikTok style.",
            3: "Summarize in a quick, facts-focused TikTok style.",
            4: "Summarize in a dramatic, cinematic TikTok style."
        }
        prompt = style_prompts.get(style, "Summarize the following notes in a TikTok style.")
        if personalization:
            prompt += f" Also incorporate the following extra details: {personalization}."

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": f"{prompt}\n\nNotes: {file_content}\n\nSummary:"}],
            max_tokens=300,
            temperature=0.7
        )
        summary = response.choices[0].message.content.strip()
        print(summary)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error summarizing notes: {str(e)}")
    # with open("audio.txt", "r", encoding="utf-8") as f:
    #     summary = f.read()
    # print(summary)

    # Generate TTS audio
    try:
        url = "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM/stream"
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": os.getenv("ELEVENLABS_API_KEY")
        }
        data = {
            "text": summary,
            "model_id": "eleven_flash_v2"
        }
        resp = requests.post(url, json=data, headers=headers)
        resp.raise_for_status()
        audio = resp.content
        audio_b64 = base64.b64encode(audio).decode('utf-8')
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating audio: {str(e)}")

    #Clean up: remove the uploaded file
    os.remove(file_path)

    return {"filename": filename, "style": style, "summary": summary, "audio": audio_b64}
