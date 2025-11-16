import os
import base64
import requests
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import elevenlabs
import PyPDF2
from docx import Document

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

# Set ElevenLabs API key
elevenlabs.set_api_key(os.getenv("ELEVENLABS_API_KEY"))

@app.post("/upload")
async def upload_file(file: UploadFile = File(...), style: int = Form(...), language: str = Form("English")):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No notes provided")

    # Save the uploaded file temporarily
    contents = await file.read()
    filename = file.filename
    os.makedirs("uploads", exist_ok=True)
    file_path = f"uploads/{filename}"
    with open(file_path, "wb") as f:
        f.write(contents)

    # Read file content based on file type
    file_extension = filename.lower().split('.')[-1]
    try:
        if file_extension == 'pdf':
            # Extract text from PDF
            with open(file_path, 'rb') as pdf_file:
                pdf_reader = PyPDF2.PdfReader(pdf_file)
                file_content = ""
                for page in pdf_reader.pages:
                    file_content += page.extract_text()
        elif file_extension in ['doc', 'docx']:
            # Extract text from Word document
            doc = Document(file_path)
            file_content = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        else:
            # Read as text file
            with open(file_path, "r", encoding="utf-8") as f:
                file_content = f.read()
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"We couldn't read your notes")
    
    # Validate file content for security
    MAX_CONTENT_LENGTH = 50000  # ~50KB of text
    if len(file_content) > MAX_CONTENT_LENGTH:
        raise HTTPException(status_code=400, detail="The file you uploaded is too big; try a smaller one")
    
    # Check for suspicious patterns
    suspicious_patterns = [
        '<script', '</script>', 'javascript:', 'onerror=', 'onload=',
        'DROP TABLE', 'DELETE FROM', 'INSERT INTO', 'UPDATE SET',
        '$(', 'eval(', 'exec(', 'system(', 'shell_exec(',
        '<?php', '<%', '<jsp:', '{{', '{%'
    ]
    
    content_lower = file_content.lower()
    for pattern in suspicious_patterns:
        if pattern.lower() in content_lower:
            raise HTTPException(status_code=400, detail="For security reasons, we will not be processing the content in these notes")
    
    # Remove control characters (except newlines, tabs, carriage returns)
    file_content = ''.join(char for char in file_content if ord(char) >= 32 or char in '\n\t\r')
    
    # # Print extracted file content to terminal
    # print("=" * 50)
    # print("EXTRACTED FILE CONTENT:")
    # print("=" * 50)
    # print(file_content[:1000])  # Print first 1000 chars only
    # if len(file_content) > 1000:
    #     print(f"... (truncated, total length: {len(file_content)} characters)")
    # print("=" * 50)

    # Use OpenAI moderation to check for harmful content in notes
    try:
        content_to_moderate = file_content[:32000]
        
        moderation_response = client.moderations.create(
            model="omni-moderation-latest",
            input=content_to_moderate
        )
        
        if moderation_response.results[0].flagged:
            flagged_categories = [
                category for category, flagged in moderation_response.results[0].categories.model_dump().items()
                if flagged
            ]
            raise HTTPException(
                status_code=400, 
                detail=f"Content flagged as inappropriate. Categories: {', '.join(flagged_categories)}"
            )
        print("✓ Content passed moderation check")
    except HTTPException:
        raise
    except Exception as e:
        print(f"Warning: Moderation check failed: {str(e)}")
        # Continue anyway if moderation API fails

    #Use OpenAI to summarize the notes
    try:
        # Adjust prompt based on style (you can customize prompts per style)
        style_prompts = {
            1: """You are an ASMR-style TikTok creator. Your task is to read the notes provided and create a clear, accurate summary script based ONLY on those notes.
                Requirements
                Tone: soft-spoken, calm, gentle, ASMR-like
                Audio Tags: Use ElevenLabs audio tags to enhance the delivery naturally and bring the script to life. Include situational cues ([WHISPER], [SIGH]), emotional context ([excited], [tired]), narrative pacing ([pause], [dramatic tone]), delivery control ([rushed], [drawn out]), character or accent shifts ([pirate voice], [British accent]), or multi-character dialogue ([interrupting], [overlapping]) where appropriate. Make sure all tags fit the tone, style, and flow of the script.
                Content: include the correct key points from the notes; do not make up facts.
                Restrictions: Do not include sound effects, actions, emojis. Only output the spoken script — no labels like "Narrator:". Do not invent facts
                Goal: Highlight the key points and summarize the material in a friendly, soothing way while embedding audio tags to make the reading sound natural and ASMR-like.
                Length: Keep the length at 110-130 words or less""",
            2: """You are a fun, energetic girlie who talks like she's facetiming her best friend. Your task is to read the attached notes and turn them into a natural, casual script that feels like friendly gossip or story-time — while still explaining all the key points from the notes. Always start with something like - hey bestie or hey girl, or anything similar to that!
                Requirements
                Tone: playful, girly, casual, and conversational — like talking to your bestie.
                Audio Tags: Use ElevenLabs audio tags to enhance the delivery naturally and bring the script to life. Include situational cues ([WHISPER], [SIGH]), emotional context ([excited], [tired]), narrative pacing ([pause], [dramatic tone]), delivery control ([rushed], [drawn out]), character or accent shifts ([pirate voice], [British accent]), or multi-character dialogue ([interrupting], [overlapping]) where appropriate. Make sure all tags fit the tone, style, and flow of the script.
                Style: use slang, natural phrasing, and personality, but keep it understandable.
                Content: include the correct key points from the notes; do not make up facts.
                Restrictions: Do not include sound effects, actions, emojis. Only output the spoken script — no labels like "Narrator:". Do not invent facts
                Goal: make the summary feel like a fun FaceTime catch-up while staying accurate to the notes and embedding audio tags .
                Length: Keep the length at 110-130 words or less""",
            3: """Imagine you are a storyteller creating viral Tiktok storytime videos. I give you the notes attached as input, and I want you to summarize them and create a script in a dramatic, cinematic storytime style. Make it engaging, like a story that hooks the listener, but only includes the key points from the notes. Start off with a phrase like - get ready with me while I tell you about...
                Requirements
                Tone: dramatic, cinematic, engaging storytime style.
                Audio Tags: Use ElevenLabs audio tags to enhance the delivery naturally and bring the script to life. Include situational cues ([WHISPER], [SIGH]), emotional context ([excited], [tired]), narrative pacing ([pause], [dramatic tone]), delivery control ([rushed], [drawn out]), character or accent shifts ([pirate voice], [British accent]), or multi-character dialogue ([interrupting], [overlapping]) where appropriate. Make sure all tags fit the tone, style, and flow of the script.
                Style: Conversational storytelling that hooks the listener, like a viral TikTok storytime video. Use expressive language, pacing, and phrasing that makes the story feel exciting.
                Content: include the correct key points from the notes; do not make up facts.
                Restrictions: Do not include sound effects, actions, emojis. Only output the spoken script — no labels like "Narrator:". Do not invent facts
                Goal: Summarize the attached notes and turn them into a spoken script that highlights only the key points. Keep it concise, compelling, and ready for narration.
                Length: Keep the length at 110-130 words or less""",
            4: """Imagine you are a TikTok true crime storyteller creating gripping storytime videos. I give you the notes attached as input, and I want you to summarize them and create a script that screams true crime.
                Tone: Suspenseful, mysterious, and attention-grabbing
                Audio Tags: Use ElevenLabs audio tags to enhance the delivery naturally and bring the script to life. Include situational cues ([WHISPER], [SIGH]), emotional context ([excited], [tired]), narrative pacing ([pause], [dramatic tone]), delivery control ([rushed], [drawn out]), character or accent shifts ([pirate voice], [British accent]), or multi-character dialogue ([interrupting], [overlapping]) where appropriate. Make sure all tags fit the tone, style, and flow of the script.
                Style: Dramatic narrative with plot twists, pacing that hooks the listener, and language that keeps them on edge. Use words like "Until" to build suspense. Speak like a popular TikTok true crime creator.
                Content: include the correct key points from the notes; do not make up facts.
                Restrictions: Do not include sound effects, actions, emojis. Only output the spoken script — no labels like "Narrator:". Do not invent facts
                Goal: Summarize the attached notes and turn them into a spoken script that conveys a true crime story. Start with a hook to capture attention immediately and include only the key points from the notes.
                Length: Keep the length at 110-130 words or less"""
        }
        prompt = style_prompts.get(style, "Summarize the following notes in a TikTok style.")
        
        # Add language instruction
        language_instruction = f"\n\nIMPORTANT: Generate the entire summary script in {language}. The script must be in {language} language only."

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": f"{prompt}{language_instruction}\n\nNotes: {file_content}\n\nSummary:"}],
            max_tokens=300,
            temperature=0.7
        )
        summary = response.choices[0].message.content.strip()
        # print(summary)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Something went wrong while generating the audio. Details - {str(e)}")

    # Generate TTS audio with style-specific voices
    # Map styles to ElevenLabs voice IDs
    voice_ids = {
        1: "sH0WdfE5fsKuM2otdQZr",  # Mademoiselle French - ASMR
        2: "uYXf8XasLslADfZ2MB4u",  # Hope - Your conversational bestie
        3: "h2dQOVyUfIDqY2whPOMo",  # Nayva for Hot Topics Social Media
        4: "AeRdCCKzvd23BpJoofzx",  # Nathaniel C - Suspense, British calm
    }
    
    voice_id = voice_ids.get(style, "21m00Tcm4TlvDq8ikWAM")  # Default to Rachel
    
    try:
        # Use ElevenLabs SDK to generate audio
        audio_bytes = elevenlabs.generate(
            text=summary,
            voice=voice_id,
            model="eleven_v3"
        )
        
        audio_b64 = base64.b64encode(audio_bytes).decode('utf-8')
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Something went wrong while generating the audio. Details - {str(e)}")

    #Clean up: remove the uploaded file
    os.remove(file_path)

    return {"filename": filename, "style": style, "summary": summary, "audio": audio_b64}
