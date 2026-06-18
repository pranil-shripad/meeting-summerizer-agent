# Quick Start Guide

## 30-Second Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Run the Server

```bash
python app.py
```

### 3. Open in Browser

Visit: `http://localhost:5000`

---

## That's it! 🎉

You now have a fully functional meeting summarizer running locally.

## First Test

1. Copy the sample transcript provided in the app
2. Click **⚡ Process All**
3. Watch the magic happen! ✨

## Sample Transcript (For Testing)

If you want to test the app without your own transcript, use this sample meeting:

```
Meeting started at 10:00 AM.
Attendees: Alice (Product Manager), Bob (Lead Developer), Carol (Marketing Specialist).

Alice: Good morning, team. Today's agenda is to review the Q3 product roadmap, discuss the new feature 'Project X', and plan for its marketing launch.

Bob: From a development perspective, 'Project X' is on track. We've completed 80% of the core features. We still need to finalize the API integration with the new payment gateway by end of next week. I'll assign David to look into this immediately.

Alice: Excellent, Bob. Carol, what are your thoughts on the marketing strategy for 'Project X'?

Carol: I've drafted a preliminary campaign. We need to get final approval on the messaging from legal by Friday. Also, I'll need the finalized product screenshots from the design team by Monday next week to prepare the launch materials. I will reach out to the design team today. Let's aim for a launch date in the first week of October.

Alice: Sounds good. So, Bob, please ensure David prioritizes the payment gateway integration. Carol, follow up with legal for messaging approval by Friday and with design for screenshots by Monday. I will schedule a follow-up meeting for next Tuesday to review progress on all these items.

Bob: Got it. David will be on it.

Carol: Will do.

Meeting ended at 10:45 AM.
```

## Need Help?

- **API Key Issues?** Check the README.md file
- **Port Already in Use?** Edit `app.py` and change `port=5000` to another number
- **Can't Connect?** Make sure Flask is running (check terminal for errors)

## Next Steps

1. **Customize the app**: Edit prompts in `app.py` for different behavior
2. **Deploy**: See README.md for Heroku/Docker deployment options
3. **Extend**: Add new features like audio upload, PDF export, etc.

---

Happy summarizing! 📝
