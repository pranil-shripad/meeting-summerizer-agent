from flask import Flask, render_template, request, jsonify
from groq import Groq
from dotenv import load_dotenv
import os
from datetime import datetime

app = Flask(__name__)

# Initialize the Groq client
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)

def summarize_meeting(transcript: str) -> str:
    """Summarizes a meeting transcript using the Groq API."""
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": """You are a professional meeting summarizer. Provide a well-structured summary with:
- **Overview**: Brief 1-2 sentence overview of the meeting
- **Key Topics Discussed**: Bullet points of main discussion points
- **Decisions Made**: Important decisions reached
- **Important Notes**: Any other critical information

Use markdown formatting for clear structure.""",
            },
            {
                "role": "user",
                "content": f"Please summarize the following meeting transcript:\n\n{transcript}",
            },
        ],
        model="openai/gpt-oss-120b",
        temperature=0.3,
        max_tokens=600,
    )
    return chat_completion.choices[0].message.content

def extract_action_items(transcript: str) -> str:
    """Extracts action items from a meeting transcript using the Groq API."""
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": """You are an expert at extracting action items from meetings. For each action item, provide:
- **Task**: Clear description of what needs to be done
- **Owner**: Person responsible (if mentioned)
- **Deadline**: Due date (if mentioned)
- **Priority**: High/Medium/Low (infer from context)

Format as a numbered list with these details for each item. If no action items exist, state: 'No action items identified.'""",
            },
            {
                "role": "user",
                "content": f"Please extract action items from the following meeting transcript:\n\n{transcript}",
            },
        ],
        model="openai/gpt-oss-120b",
        temperature=0.3,
        max_tokens=600,
    )
    return chat_completion.choices[0].message.content

def draft_follow_up_message(summary: str, action_items: str) -> str:
    """Drafts a follow-up message based on a summary and action items using the Groq API."""
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": """You are a professional business writer. Draft a polished follow-up email with:
- **Subject Line**: Professional subject line
- **Greeting & Opening**: Reference to the meeting
- **Meeting Summary Section**: Key points discussed
- **Action Items Section**: Clear, numbered list of next steps with owners
- **Next Steps/Timeline**: When to reconnect
- **Closing**: Professional sign-off

Use professional business email format with clear sections and markdown formatting.""",
            },
            {
                "role": "user",
                "content": f"Please draft a follow-up email based on this summary and action items:\n\nSummary:\n{summary}\n\nAction Items:\n{action_items}",
            },
        ],
        model="openai/gpt-oss-120b",
        temperature=0.3,
        max_tokens=800,
    )
    return chat_completion.choices[0].message.content

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/summarize', methods=['POST'])
def api_summarize():
    data = request.json
    transcript = data.get('transcript', '')
    
    if not transcript:
        return jsonify({'error': 'No transcript provided'}), 400
    
    try:
        summary = summarize_meeting(transcript)
        return jsonify({'summary': summary})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/extract-actions', methods=['POST'])
def api_extract_actions():
    data = request.json
    transcript = data.get('transcript', '')
    
    if not transcript:
        return jsonify({'error': 'No transcript provided'}), 400
    
    try:
        action_items = extract_action_items(transcript)
        return jsonify({'action_items': action_items})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/follow-up', methods=['POST'])
def api_follow_up():
    data = request.json
    transcript = data.get('transcript', '')
    
    if not transcript:
        return jsonify({'error': 'No transcript provided'}), 400
    
    try:
        summary = summarize_meeting(transcript)
        action_items = extract_action_items(transcript)
        follow_up = draft_follow_up_message(summary, action_items)
        return jsonify({
            'summary': summary,
            'action_items': action_items,
            'follow_up': follow_up
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/process-all', methods=['POST'])
def api_process_all():
    data = request.json
    transcript = data.get('transcript', '')
    
    if not transcript:
        return jsonify({'error': 'No transcript provided'}), 400
    
    try:
        summary = summarize_meeting(transcript)
        action_items = extract_action_items(transcript)
        follow_up = draft_follow_up_message(summary, action_items)
        
        return jsonify({
            'summary': summary,
            'action_items': action_items,
            'follow_up': follow_up,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
