# Mira Setup Guide - Complete Instructions

## 🎯 Quick Overview

**Mira** is a WhatsApp-based AI data analyst that turns CSV files into beautiful PDF reports using:
- **Meta WhatsApp Cloud API** (official, no Twilio)
- **Google Gemini 2.5 Flash** (AI reasoning)
- **E2B Code Interpreter** (secure Python execution)
- **Exa MCP** (web research)
- **Vercel** (hosting)

---

## 📋 Prerequisites

- Node.js 18+ installed
- A Meta/Facebook Developer account
- A WhatsApp Business account
- API keys (all have free tiers)

---

## 🚀 Step-by-Step Setup

### 1. Clone and Install

```bash
git clone https://github.com/AWS-25/origin.git
cd origin
npm install
```

### 2. Get Meta WhatsApp Access

#### A. Create Meta App

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click **My Apps** → **Create App**
3. Select **Business** type
4. Fill in app details and create

#### B. Add WhatsApp Product

1. In your app dashboard, click **Add Product**
2. Find **WhatsApp** and click **Set Up**
3. You'll see the **API Setup** page

#### C. Get Your Credentials

From the API Setup page, note down:

```
Phone Number ID: 123456789012345
(Found under "From" dropdown)

WhatsApp Business Account ID: 987654321098765
(Found in the URL or account settings)

Temporary Access Token: EAAxxxxxxxxxxxxxxxx
(Click "Copy" button - valid for 24 hours)
```

#### D. Add Test Phone Number

1. Scroll to **Step 5: Send messages with the API**
2. Click **Add phone number**
3. Enter your personal WhatsApp number
4. You'll receive a verification code via WhatsApp
5. Enter the code to verify

### 3. Generate Permanent Access Token

**Important:** Temporary tokens expire in 24 hours!

#### Option A: System User Token (Recommended for Production)

1. Go to [Meta Business Settings](https://business.facebook.com/settings)
2. Click **Users** → **System Users**
3. Click **Add** to create a system user
4. Name it "Mira Bot" and assign Admin role
5. Click **Add Assets**
6. Select your app and toggle **Manage App**
7. Click **Generate New Token**
8. Select permissions:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
9. Copy the token (starts with `EAA...`)

#### Option B: User Access Token (Quick Testing)

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app
3. Click **Generate Access Token**
4. Select same permissions as above
5. Copy the token

### 4. Get Other API Keys

#### Google Gemini

1. Go to [Google AI Studio](https://ai.google.dev)
2. Click **Get API Key**
3. Create a new API key
4. Copy the key

#### E2B

1. Go to [E2B Dashboard](https://e2b.dev)
2. Sign up/login
3. Go to **API Keys**
4. Create new key
5. Copy the key (you get $100 free credits)

#### Exa

1. Go to [Exa](https://exa.ai)
2. Sign up
3. Go to dashboard
4. Copy your API key (1000 free searches)

#### Vercel Blob

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (or create one)
3. Go to **Storage** → **Create Database**
4. Select **Blob**
5. Copy the `BLOB_READ_WRITE_TOKEN`

### 5. Configure Environment Variables

Create `.env.local` in project root:

```bash
# Meta WhatsApp Cloud API
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_ACCESS_TOKEN=your_meta_access_token_here
WHATSAPP_VERIFY_TOKEN=your_custom_verify_token_here
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id_here

# E2B Sandbox
E2B_API_KEY=e2b_xxxxxxxxxxxxxxxxxxxxx

# Google Gemini
GOOGLE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxx

# Exa Search API
EXA_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_xxxxxxxxxxxxx
```

### 6. Test Locally

```bash
npm run dev
```

Server runs on `http://localhost:3000`

### 7. Expose Webhook (for local testing)

Open a new terminal:

```bash
# Install ngrok if you haven't
npm install -g ngrok

# Expose port 3000
ngrok http 3000
```

Copy the `https://` URL (e.g., `https://abc123.ngrok.io`)

### 8. Configure Meta Webhook

1. Go to your Meta App Dashboard
2. Click **WhatsApp** → **Configuration**
3. Find **Webhook** section
4. Click **Edit**

**Webhook Settings:**
```
Callback URL: https://abc123.ngrok.io/api/webhook
Verify Token: mira_verify_token_2024
```

5. Click **Verify and Save**
6. You should see ✅ "Webhook verified successfully"

**Subscribe to Fields:**
- Check ☑️ `messages`
- Click **Save**

### 9. Test the Bot!

1. Open WhatsApp on your phone
2. Send a message to your WhatsApp Business number
3. You should receive: "👋 Welcome to *Mira*..."
4. Send a CSV file
5. Wait 3-5 minutes
6. Receive your PDF report!

---

## 🌐 Deploy to Production

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/mira.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Add all environment variables from `.env.local`
4. Click **Deploy**
5. Wait for deployment to complete
6. Copy your production URL (e.g., `https://mira.vercel.app`)

### 3. Update Meta Webhook

1. Go back to Meta App Dashboard
2. **WhatsApp** → **Configuration** → **Webhook**
3. Click **Edit**
4. Update Callback URL: `https://mira.vercel.app/api/webhook`
5. Keep same Verify Token: `mira_verify_token_2024`
6. Click **Verify and Save**

### 4. Test Production

Send a CSV to your WhatsApp Business number and verify it works!

---

## 🔧 Troubleshooting

### Webhook Verification Failed

**Problem:** "Webhook verification failed" error

**Solutions:**
1. Check `WHATSAPP_VERIFY_TOKEN` in `.env.local` matches Meta Dashboard
2. Ensure webhook URL is publicly accessible
3. Check Vercel logs for errors
4. Try clicking "Verify and Save" again

### Cannot Receive Messages

**Problem:** Bot doesn't respond to messages

**Solutions:**
1. Check webhook is subscribed to `messages` field
2. Verify your phone number is added to test recipients
3. Check Vercel function logs
4. Ensure `WHATSAPP_ACCESS_TOKEN` is valid

### Cannot Send Messages

**Problem:** Bot receives messages but doesn't send replies

**Solutions:**
1. Verify `WHATSAPP_PHONE_NUMBER_ID` is correct
2. Check `WHATSAPP_ACCESS_TOKEN` hasn't expired
3. Ensure recipient is in test numbers (for test mode)
4. Check Meta API rate limits

### CSV Download Fails

**Problem:** "Couldn't download the CSV file" error

**Solutions:**
1. Ensure file is actually a CSV (not Excel)
2. Check file size (Meta has limits)
3. Verify `WHATSAPP_ACCESS_TOKEN` has media permissions
4. Check Vercel function logs for detailed error

### PDF Generation Fails

**Problem:** Analysis completes but no PDF received

**Solutions:**
1. Check `BLOB_READ_WRITE_TOKEN` is valid
2. Verify Vercel Blob storage is set up
3. Check Puppeteer is working (may need Vercel Pro for longer timeouts)
4. Review Vercel function logs

### Gemini API Errors

**Problem:** "GOOGLE_API_KEY missing" or API errors

**Solutions:**
1. Verify `GOOGLE_API_KEY` is set correctly
2. Check API key hasn't been restricted
3. Ensure you have quota remaining
4. Try regenerating the API key

### E2B Sandbox Timeout

**Problem:** "Connection to E2B Sandbox timed out"

**Solutions:**
1. Check `E2B_API_KEY` is valid
2. Verify you have credits remaining
3. Try again (sometimes E2B has temporary issues)
4. Check E2B status page

---

## 📊 Usage Limits & Costs

### Free Tier Limits

| Service | Free Tier | Cost After |
|---------|-----------|------------|
| **Meta WhatsApp** | 1000 conversations/month | $0.0042-0.0168/conversation |
| **Google Gemini** | 15 requests/minute | Pay-as-you-go |
| **E2B** | $100 credits | $0.10/minute |
| **Exa** | 1000 searches/month | $5/1000 searches |
| **Vercel** | 100GB bandwidth | $20/month Pro |
| **Vercel Blob** | 1GB storage | $0.15/GB |

### Estimated Costs

**Per Report:**
- E2B: ~$0.50 (5 minutes)
- Gemini: ~$0.01
- Exa: ~$0.005 (if URLs provided)
- Blob: ~$0.001
- **Total: ~$0.52/report**

**Monthly (100 reports):**
- ~$52/month
- Free tier covers first ~20 reports

---

## 🎯 Next Steps

1. ✅ Test with sample CSV files
2. ✅ Customize welcome message in `app/api/webhook/route.ts`
3. ✅ Add your branding to PDF template in `lib/pdf-generator.ts`
4. ✅ Set up monitoring and alerts
5. ✅ Apply for WhatsApp Business verification (for production)
6. ✅ Create message templates for business-initiated conversations
7. ✅ Implement analytics tracking
8. ✅ Add user feedback collection

---

## 📚 Additional Resources

- [Meta WhatsApp Docs](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Gemini API Docs](https://ai.google.dev/docs)
- [E2B Documentation](https://e2b.dev/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Migration Guide](./WHATSAPP_MIGRATION.md)

---

## 🆘 Support

Need help?

1. Check [WHATSAPP_MIGRATION.md](./WHATSAPP_MIGRATION.md) for detailed migration info
2. Review [Meta Developer Community](https://developers.facebook.com/community/)
3. Check Vercel function logs
4. Open an issue on GitHub

---

**You're all set!** 🎉

Your Mira bot is now ready to analyze CSV files via WhatsApp!
