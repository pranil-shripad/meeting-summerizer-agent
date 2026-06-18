# Meeting Summarizer Agent

A modern web application that transforms meeting transcripts into actionable insights using the Groq API. Generate summaries, extract action items, and draft follow-up emails automatically.

## Features

- **📝 Transcript Summarization**: Get concise summaries of meeting discussions
- **✓ Action Item Extraction**: Automatically identify tasks, responsible parties, and deadlines
- **✉️ Follow-up Email Generator**: Draft professional follow-up messages
- **⚡ Process All**: Run all analyses in one click
- **📋 Copy & Download**: Easy sharing and export of results
- **🎨 Modern UI**: Beautiful, responsive interface built with vanilla JavaScript

## Project Structure

```
meeting-summerizer-agent/
├── app.py                 # Flask backend API
├── requirements.txt       # Python dependencies
├── .env                  # Environment variables (API key)
├── templates/
│   └── index.html        # Main UI
└── static/
    ├── style.css         # Styling
    └── script.js         # Frontend logic
```

## Installation

### Prerequisites

- Python 3.8+
- pip (Python package manager)

### Setup Steps

1. **Clone or download the project** to your desired location

2. **Install Python dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

3. **Configure API Key**:
   - Open `app.py` and replace the API key with your Groq API key:
     ```python
     GROQ_API_KEY = 'your-groq-api-key-here'
     ```
   - Or set it as an environment variable:
     ```bash
     export GROQ_API_KEY='your-groq-api-key-here'
     ```

## Running the Application

### Start the Flask Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

### Access the UI

Open your web browser and navigate to:

```
http://localhost:5000
```

## Usage

1. **Paste your meeting transcript** into the text area
2. **Choose an action**:
   - **⚡ Process All**: Runs all analyses (recommended)
   - **📄 Summarize**: Get only the summary
   - **✓ Extract Actions**: Get only action items
   - **✉️ Draft Follow-up**: Get follow-up email
3. **View results** in the tabs below
4. **Copy or Download** your results

## API Endpoints

| Endpoint               | Method | Description             |
| ---------------------- | ------ | ----------------------- |
| `/`                    | GET    | Main UI page            |
| `/api/summarize`       | POST   | Summarize transcript    |
| `/api/extract-actions` | POST   | Extract action items    |
| `/api/follow-up`       | POST   | Draft follow-up message |
| `/api/process-all`     | POST   | Process all at once     |

### Request Format

```json
{
  "transcript": "Your meeting transcript here..."
}
```

### Response Format

```json
{
  "summary": "...",
  "action_items": "...",
  "follow_up": "...",
  "timestamp": "2024-01-01T12:00:00"
}
```

## Customization

### Modify AI Behavior

Edit the system prompts in `app.py`:

```python
def summarize_meeting(transcript: str) -> str:
    # Change the "content" field to modify prompt behavior
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "Your custom prompt here...",
            },
            ...
        ]
    )
```

### Change UI Styling

Edit `static/style.css` to customize colors, fonts, and layout:

```css
:root {
    --primary-color: #6366f1;  /* Customize colors */
    --secondary-color: #ec4899;
    ...
}
```

### Change UI Buttons

Edit `templates/index.html` and `static/script.js` to add new buttons or features

## Environment Variables

Create a `.env` file in the project root (optional):

```
GROQ_API_KEY=your-api-key-here
FLASK_ENV=development
FLASK_DEBUG=True
```

Then update `app.py` to load from `.env`:

```python
from dotenv import load_dotenv
load_dotenv()
GROQ_API_KEY = os.getenv('GROQ_API_KEY')
```

## Troubleshooting

### Port Already in Use

If port 5000 is already in use, modify `app.py`:

```python
if __name__ == '__main__':
    app.run(debug=True, port=8000)  # Change port number
```

### API Key Error

- Ensure your Groq API key is valid and has quota available
- Check API key formatting (no spaces)

### CORS Issues

If accessing from a different domain, add CORS support:

```bash
pip install flask-cors
```

Then in `app.py`:

```python
from flask_cors import CORS
CORS(app)
```

## Performance Tips

1. **Character Limit**: Transcript input is limited to 5000 characters
2. **API Rate Limits**: Be aware of Groq API rate limits
3. **Browser Cache**: Clear browser cache if UI doesn't update

## Deployment

### Heroku

```bash
# Create Procfile
echo "web: gunicorn app:app" > Procfile

# Deploy
heroku create your-app-name
git push heroku main
```

### Docker

```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

## Technologies Used

- **Backend**: Flask (Python web framework)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **AI**: Groq API with mixtral-8x7b model
- **Styling**: Custom CSS with modern design patterns

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:

1. Check the Troubleshooting section
2. Verify your Groq API key is valid
3. Check browser console for JavaScript errors
4. Check terminal for Python errors

## Future Enhancements

- [ ] Multi-file upload support
- [ ] Different AI model selection
- [ ] Custom prompt templates
- [ ] Meeting history/storage
- [ ] Audio file upload support
- [ ] Real-time transcript processing
- [ ] Team collaboration features
- [ ] Export to various formats (PDF, Markdown, etc.)

---

Built with ❤️ using Groq API
