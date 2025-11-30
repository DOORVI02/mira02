# Migration Guide: Twilio → Meta WhatsApp Cloud API

## Overview

This project has been migrated from **Twilio WhatsApp API** to **Meta's WhatsApp Cloud API** (official). This provides:

- ✅ **Lower costs** - Direct Meta pricing without Twilio markup
- ✅ **More features** - Full access to WhatsApp Business Platform features
- ✅ **Better control** - Direct integration with Meta's infrastructure
- ✅ **Official support** - First-party API from Meta

## What Changed

### 1. Dependencies
**Removed:**
- `twilio` npm package

**No new dependencies needed** - Using native `fetch` API

### 2. Environment Variables

**Before (Twilio):**
```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886
```

**After (Meta WhatsApp Cloud API):**
```bash
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_ACCESS_TOKEN=your_meta_access_token_here
WHATSAPP_VERIFY_TOKEN=your_custom_verify_token_here
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id_here
```

### 3. Webhook Format

**Twilio Format:**
```typescript
{
  From: "whatsapp:+1234567890",
  Body: "Hello",
  NumMedia: "1",
  MediaUrl0: "https://...",
  MediaContentType0: "text/csv"
}
```

**Meta Format:**
```typescript
{
  object: "whatsapp_business_account",
  entry: [{
    id: "WABA_ID",
    changes: [{
      value: {
        messaging_product: "whatsapp",
        metadata: {
          display_phone_number: "15550783881",
          phone_number_id: "106540352242922"
        },
        messages: [{
          from: "1234567890",
          id: "wamid.HBgLMTY0...",
          timestamp: "1683229471",
          type: "text",
          text: { body: "Hello" }
        }]
      },
      field: "messages"
    }]
  }]
}
```

### 4. API Endpoints

**Twilio:**
- Send: `https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json`
- Auth: Basic Auth (AccountSid:AuthToken)

**Meta:**
- Send: `https://graph.facebook.com/v21.0/{phone_number_id}/messages`
- Auth: Bearer Token
- Media: `https://graph.facebook.com/v21.0/{media_id}`

## Setup Instructions

### Step 1: Get Meta WhatsApp Access

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app or use existing
3. Add **WhatsApp** product
4. Go to **API Setup** section
5. Note down:
   - **Phone Number ID** (e.g., `869982195231199`)
   - **WhatsApp Business Account ID** (e.g., `253230174206483322`)
   - **Temporary Access Token** (for testing)

### Step 2: Generate Permanent Access Token

**Temporary tokens expire in 24 hours.** For production:

1. Go to **App Settings** → **Basic**
2. Copy your **App ID** and **App Secret**
3. Generate a System User Access Token:
   - Go to **Business Settings** → **System Users**
   - Create a system user
   - Assign WhatsApp permissions
   - Generate token with `whatsapp_business_messaging` and `whatsapp_business_management` permissions

### Step 3: Configure Environment Variables

Create `.env.local`:

```bash
# Meta WhatsApp Cloud API
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_ACCESS_TOKEN=your_meta_access_token_here
WHATSAPP_VERIFY_TOKEN=your_custom_verify_token_here
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id_here

# E2B Sandbox
E2B_API_KEY=your_e2b_api_key_here

# Google Gemini
GOOGLE_API_KEY=your_google_gemini_api_key_here

# Exa Search API
EXA_API_KEY=your_exa_api_key_here

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
```

### Step 4: Configure Webhook

1. **Deploy to Vercel** (or use ngrok for local testing):
   ```bash
   vercel --prod
   ```

2. **Set Webhook URL** in Meta Dashboard:
   - Go to **WhatsApp** → **Configuration**
   - Click **Edit** next to Webhook
   - Enter: `https://your-app.vercel.app/api/webhook`
   - Enter Verify Token: `mira_verify_token_2024` (must match `.env.local`)
   - Click **Verify and Save**

3. **Subscribe to Webhook Fields**:
   - Check `messages` field
   - Save

### Step 5: Test the Integration

1. **Add Test Number**:
   - In Meta Dashboard, go to **API Setup**
   - Add your phone number to test recipients
   - You'll receive a verification code via WhatsApp

2. **Send Test Message**:
   - Send "Hello" to your WhatsApp Business number
   - You should receive a welcome message from Mira

3. **Test CSV Upload**:
   - Send a CSV file
   - Wait 3-5 minutes
   - Receive PDF report

## Code Changes

### New Files Created

1. **`lib/whatsapp.ts`** - Meta WhatsApp Cloud API client
   - `sendWhatsAppMessage()` - Send text/document messages
   - `downloadMedia()` - Download media files
   - `markMessageAsRead()` - Mark messages as read
   - `extractPhoneNumber()` - Clean phone numbers

2. **Updated `app/api/webhook/route.ts`**:
   - Added `GET` handler for webhook verification
   - Updated `POST` handler for Meta webhook format
   - Handles text, document, image, audio, video messages
   - Proper error handling and status updates

3. **Updated `lib/types.ts`**:
   - Added Meta WhatsApp webhook types
   - Removed Twilio-specific types

### Removed Files

- `lib/twilio.ts` - No longer needed

## API Differences

### Sending Messages

**Twilio:**
```typescript
await client.messages.create({
  from: `whatsapp:${whatsappNumber}`,
  to: `whatsapp:${to}`,
  body: message,
  mediaUrl: [mediaUrl]
});
```

**Meta:**
```typescript
await fetch(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: cleanPhone,
    type: 'document',
    document: {
      link: mediaUrl,
      caption: message,
      filename: 'report.pdf',
    },
  }),
});
```

### Downloading Media

**Twilio:**
```typescript
const response = await fetch(mediaUrl, {
  headers: {
    'Authorization': `Basic ${base64Credentials}`
  }
});
```

**Meta:**
```typescript
// Step 1: Get media URL
const mediaInfo = await fetch(`https://graph.facebook.com/v21.0/${mediaId}`, {
  headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
});

// Step 2: Download media
const mediaResponse = await fetch(mediaInfo.url, {
  headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
});
```

## Webhook Verification

Meta requires webhook verification on setup:

```typescript
export async function GET(req: NextRequest) {
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  
  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}
```

## Testing Checklist

- [ ] Webhook verification successful
- [ ] Receive text messages
- [ ] Send text messages
- [ ] Receive CSV documents
- [ ] Download CSV files
- [ ] Send PDF documents
- [ ] Messages marked as read
- [ ] Error handling works
- [ ] Session management works
- [ ] Background processing works

## Troubleshooting

### Webhook Not Receiving Messages

1. **Check webhook URL** is publicly accessible
2. **Verify token** matches in Meta Dashboard and `.env.local`
3. **Check logs** in Vercel dashboard
4. **Test webhook** using Meta's Test button

### Cannot Send Messages

1. **Verify access token** is valid and not expired
2. **Check phone number ID** is correct
3. **Ensure recipient** is added to test numbers (for test mode)
4. **Check rate limits** - Meta has sending limits

### Media Download Fails

1. **Check media ID** is valid
2. **Verify access token** has media permissions
3. **Check file size** - Meta has size limits
4. **Ensure MIME type** is supported

### Messages Not Delivered

1. **Check recipient number** format (no + or spaces)
2. **Verify business account** is approved
3. **Check message template** approval (for templates)
4. **Review Meta's messaging policies**

## Production Considerations

### 1. Access Token Management

- Use **System User tokens** for production
- Store tokens securely (environment variables)
- Implement token refresh logic
- Monitor token expiration

### 2. Rate Limits

Meta has rate limits:
- **1000 messages/day** (free tier)
- **Unlimited** (paid tier)
- **80 messages/second** per phone number

### 3. Message Templates

For business-initiated conversations:
- Create message templates in Meta Dashboard
- Get templates approved
- Use template API for sending

### 4. Webhook Security

- Validate webhook signatures
- Use HTTPS only
- Implement request validation
- Rate limit webhook endpoint

### 5. Error Handling

- Implement retry logic
- Log all errors
- Monitor webhook failures
- Set up alerts

## Cost Comparison

### Twilio Pricing
- **$0.005/message** (US)
- Plus Twilio markup
- Additional fees for media

### Meta Direct Pricing
- **Free tier**: 1000 conversations/month
- **Paid**: $0.0042-0.0168/conversation (varies by country)
- No markup
- More cost-effective at scale

## Resources

- [Meta WhatsApp Cloud API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Getting Started Guide](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)
- [Webhook Reference](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks)
- [Message Templates](https://developers.facebook.com/docs/whatsapp/message-templates)
- [API Reference](https://developers.facebook.com/docs/whatsapp/cloud-api/reference)

## Support

For issues:
1. Check [Meta Developer Community](https://developers.facebook.com/community/)
2. Review [WhatsApp Business API Changelog](https://developers.facebook.com/docs/whatsapp/changelog)
3. Contact Meta Business Support

---

**Migration completed successfully!** 🎉

Your app now uses Meta's official WhatsApp Cloud API for better performance, lower costs, and more features.
