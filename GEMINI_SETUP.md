# Gemini API Setup Guide

## Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

## Step 2: Configure Environment Variables

Create a `.env.local` file in your project root with:

```
GEMINI_API_KEY=your_actual_api_key_here
```

Replace  with the API key you copied.

## Step 3: Test Your API Key

Run the test script to verify your API key works:

```bash
npm install
node test-gemini.js
```

You should see:
```
🔑 API Key found: AIzaSyC...
🚀 Testing Gemini API...
✅ Gemini API is working!
Response: Hello! Gemini API is working correctly.
```

## Step 4: Start Your Application

```bash
npm run dev
```

Visit http://localhost:3000 and click "Get New Topic" to test the Gemini integration.

## Troubleshooting

### If you see "API key not configured":
- Make sure you created the `.env.local` file
- Make sure the file is in the project root directory
- Restart your development server after adding the environment variable

### If you see "API Error":
- Check that your API key is correct
- Make sure you have billing enabled on your Google Cloud account
- Verify the API key has the necessary permissions

### If you see "Fallback Topic":
- The app will use pre-written topics if Gemini API fails
- Check the console logs for more detailed error information

## API Key Security

- Never commit your `.env.local` file to version control
- The `.env.local` file is already in `.gitignore`
- Keep your API key secure and don't share it publicly
