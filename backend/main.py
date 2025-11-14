import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
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

    # Use OpenAI to summarize the notes
    # try:
    #     # Adjust prompt based on style (you can customize prompts per style)
    #     style_prompts = {
    #         1: "Summarize in an engaging, story-like TikTok style.",
    #         2: "Summarize in a fun, energetic TikTok style.",
    #         3: "Summarize in a quick, facts-focused TikTok style.",
    #         4: "Summarize in a dramatic, cinematic TikTok style."
    #     }
    #     prompt = style_prompts.get(style, "Summarize the following notes in a TikTok style.")
    #     if personalization:
    #         prompt += f" Also incorporate the following extra details: {personalization}."

    #     response = client.completions.create(
    #         model="text-davinci-003",
    #         prompt=f"{prompt}\n\nNotes: {file_content}\n\nSummary:",
    #         max_tokens=300,
    #         temperature=0.7
    #     )
    #     summary = response.choices[0].text.strip()
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=f"Error summarizing notes: {str(e)}")

    # Clean up: remove the uploaded file
    os.remove(file_path)
    summary = f"Style received: {style}, Personalization received: {personalization}"

    return {"filename": filename, "style": style, "summary": summary}
