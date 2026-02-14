import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types


load_dotenv()
try:
    client = genai.Client()
except Exception as e:
    print(f"Error initializing Gemini client: {e}")
    client = None

app = Flask(__name__)
CORS(app)
chat_sessions = {}

@app.route('/api/chat', methods=['POST'])
def handle_chat():
    if not client:
        return jsonify({'error': 'Gemini Client not initialized. Check API Key.'}), 500

    data = request.get_json()
    user_message = data.get('message', '')
    session_id = 'default_user_session' 

    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    if session_id not in chat_sessions:
        system_instruction = (
            "You are MindMirror AI, a supportive and non-judgmental mental wellness companion. "
            "Respond to the user's messages in a compassionate and encouraging tone. "
            "Keep responses concise and focused on helping the user explore their feelings or offer simple, actionable advice."
        )
        
        chat = client.chats.create(
            model='gemini-2.5-flash',
            config=types.GenerateContentConfig(
                system_instruction=system_instruction
            )
        )
        chat_sessions[session_id] = chat
    else:
        chat = chat_sessions[session_id]
        
    try:
        response = chat.send_message(user_message)

        return jsonify({'response': response.text})

    except Exception as e:
        print(f"Gemini Chat Error: {e}")
        return jsonify({
            'error': 'Chat service is temporarily unavailable. Please try again later.',
            'details': str(e)
        }), 500

@app.route('/api/detect-emotion', methods=['POST'])
def detect_emotion_llm():
    if not client:
        return jsonify({'error': 'Gemini Client not initialized. Check API Key.'}), 500

    data = request.get_json()
    diary_text = data.get('text', '')

    if not diary_text:
        return jsonify({'error': 'No text provided'}), 400

    json_schema = types.Schema(
        type=types.Type.OBJECT,
        properties={
            "emotion": types.Schema(
                type=types.Type.STRING, 
                description="The single primary emotion detected (e.g., Joy, Sadness, Anger, Anxiety)."
            ),
            "general_advice": types.Schema(
                type=types.Type.STRING, 
                description="A unique, helpful paragraph of advice based on the full entry context."
            ),
            "song_recommendation": types.Schema(
                type=types.Type.OBJECT,
                properties={
                    "title": types.Schema(type=types.Type.STRING),
                    "artist": types.Schema(type=types.Type.STRING),
                    "link": types.Schema(type=types.Type.STRING, description="A relevant YouTube or Spotify URL for the song.")
                },
                required=["title", "artist", "link"]
            ),
            "exercise_recommendation": types.Schema(
                type=types.Type.OBJECT,
                properties={
                    "name": types.Schema(type=types.Type.STRING),
                    "description": types.Schema(type=types.Type.STRING, description="A concise, tailored activity description or instruction.")
                },
                required=["name", "description"]
            )
        },
        required=["emotion", "general_advice", "song_recommendation", "exercise_recommendation"]
    )

    system_instruction = (
        "You are an empathetic, non-judgmental diary analyzer and personal recommender. "
        "Your task is to analyze the user's diary entry for its primary emotion. "
        "Then, generate one highly relevant general piece of advice, one specific song recommendation "
        "(with a working link), and one specific exercise or mindfulness activity, all tailored to the detected emotion. "
        "You MUST respond ONLY with the requested JSON object."
    )

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',  
            contents=diary_text,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
                response_schema=json_schema,
            )
        )

        result_json = json.loads(response.text)
        
        return jsonify(result_json)

    except Exception as e:
        print(f"Gemini API Error: {e}")
        return jsonify({
            'error': 'The model failed to generate recommendations. Please try a different entry.',
            'details': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)