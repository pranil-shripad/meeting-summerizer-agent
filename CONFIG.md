# Configuration & Customization Guide

## Available Groq Models

You can change the model used by editing the `model` parameter in `app.py`.

### Fast & Lightweight

- `llama3-8b-8192` - Fast, good for simple summarization
- `mistral-7b-instruct-v0.2` - Fast, good quality

### Balanced Performance

- `mixtral-8x7b-32768` - **Current default**, best balance
- `llama3-70b-8192` - High quality, slower

### High Quality (Slower)

- `gpt-4o` - Highest quality, slowest

Example change:

```python
model="llama3-8b-8192",  # Change this line
```

---

## Temperature & Max Tokens

### Temperature (Creativity vs Consistency)

- `0.0` - Deterministic, same output every time
- `0.3` - **Current (more consistent)**, good for summaries
- `0.7` - Moderate creativity
- `1.0` - Maximum creativity

Lower = more consistent, Higher = more creative

### Max Tokens (Response Length)

- `500` - Short summaries
- `1000` - Medium length
- `2000` - Detailed responses

Current settings:

```python
temperature=0.3,
max_tokens=500,  # Change this for length
```

---

## Customizing System Prompts

### Example: Academic Tone Summary

Open `app.py` and modify the `summarize_meeting` function:

```python
def summarize_meeting(transcript: str) -> str:
    """Summarizes a meeting transcript in academic style."""
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are an academic researcher. Summarize meeting transcripts with scholarly precision, highlighting key research topics and methodological discussions.",  # CHANGED
            },
            {
                "role": "user",
                "content": f"Please summarize the following meeting transcript:\n\n{transcript}",
            },
        ],
        model="mixtral-8x7b-32768",
        temperature=0.3,
        max_tokens=500,
    )
    return chat_completion.choices[0].message.content
```

---

## Custom Templates

### Template: Executive Summary

```python
content: "You are a C-level executive assistant. Provide a brief 3-5 bullet point executive summary focused on business impact and decisions made."
```

### Template: Technical Meeting

```python
content: "You are a technical lead. Summarize technical discussions, architectural decisions, and technical action items in a structured format."
```

### Template: Sales Meeting

```python
content: "You are a sales manager. Extract key customer insights, objections discussed, next steps, and deal status from sales meetings."
```

---

## UI Customization

### Change Colors

Edit `static/style.css`:

```css
:root {
  --primary-color: #6366f1; /* Blue buttons */
  --secondary-color: #ec4899; /* Pink accents */
  --success-color: #10b981; /* Green */
  --danger-color: #ef4444; /* Red */
  --info-color: #0ea5e9; /* Cyan */
}
```

**Popular color schemes:**

Dark Professional:

```css
--primary-color: #1f2937;
--secondary-color: #6366f1;
--light-bg: #111827;
--card-bg: #1f2937;
```

Warm & Friendly:

```css
--primary-color: #f59e0b;
--secondary-color: #f97316;
--success-color: #eab308;
```

---

## Performance Optimization

### For Large Transcripts

If processing very long transcripts (5000+ chars):

1. **Split transcript**: Process in chunks
2. **Increase tokens**: Set `max_tokens=1000`
3. **Use faster model**: Switch to `llama3-8b-8192`

### For Speed

1. Lower `max_tokens` to 300
2. Set `temperature=0.1`
3. Use `llama3-8b-8192` model

### For Quality

1. Increase `max_tokens` to 1000
2. Set `temperature=0.5`
3. Use `llama3-70b-8192` or `gpt-4o` model

---

## Adding New Endpoints

### Example: Extract Decisions

Add this to `app.py`:

```python
def extract_decisions(transcript: str) -> str:
    """Extract decisions made during the meeting."""
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "Extract all decisions made during this meeting. Format as numbered list.",
            },
            {
                "role": "user",
                "content": f"Meeting transcript:\n\n{transcript}",
            },
        ],
        model="mixtral-8x7b-32768",
        temperature=0.3,
        max_tokens=500,
    )
    return chat_completion.choices[0].message.content

@app.route('/api/extract-decisions', methods=['POST'])
def api_extract_decisions():
    data = request.json
    transcript = data.get('transcript', '')
    if not transcript:
        return jsonify({'error': 'No transcript provided'}), 400
    try:
        decisions = extract_decisions(transcript)
        return jsonify({'decisions': decisions})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

Then add button in `templates/index.html`:

```html
<button id="decisionsBtn" class="btn btn-secondary">
  <span>⚖️ Extract Decisions</span>
</button>
```

And handler in `static/script.js`:

```javascript
document.getElementById("decisionsBtn").addEventListener("click", async () => {
  const data = await apiCall("extract-decisions", transcriptInput.value);
  if (data) {
    updateResult("decisions", data.decisions);
  }
});
```

---

## Rate Limiting

If you hit API rate limits, add throttling:

```python
import time
from functools import wraps

def rate_limit(calls_per_minute=10):
    min_interval = 60.0 / calls_per_minute
    last_called = [0.0]

    def decorator(func):
        def wrapper(*args, **kwargs):
            elapsed = time.time() - last_called[0]
            wait_time = min_interval - elapsed
            if wait_time > 0:
                time.sleep(wait_time)
            result = func(*args, **kwargs)
            last_called[0] = time.time()
            return result
        return wrapper
    return decorator

@app.route('/api/summarize', methods=['POST'])
@rate_limit(calls_per_minute=5)
def api_summarize():
    # ... rest of code
```

---

## Error Handling

Add better error messages in `app.py`:

```python
try:
    summary = summarize_meeting(transcript)
    return jsonify({'summary': summary})
except Exception as e:
    logger.error(f"Summarization error: {str(e)}")
    return jsonify({
        'error': 'Failed to process transcript',
        'detail': str(e)
    }), 500
```

---

## Logging

Add logging to track usage:

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/api/process-all', methods=['POST'])
def api_process_all():
    data = request.json
    transcript = data.get('transcript', '')

    logger.info(f"Processing transcript: {len(transcript)} characters")

    try:
        summary = summarize_meeting(transcript)
        action_items = extract_action_items(transcript)
        follow_up = draft_follow_up_message(summary, action_items)

        logger.info("Successfully processed meeting")

        return jsonify({
            'summary': summary,
            'action_items': action_items,
            'follow_up': follow_up,
        })
    except Exception as e:
        logger.error(f"Error processing meeting: {str(e)}")
        return jsonify({'error': str(e)}), 500
```

---

For more questions, check README.md or QUICKSTART.md
