// Meta WhatsApp Cloud API Integration

const WHATSAPP_API_URL = 'https://graph.facebook.com/v21.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
  console.warn('⚠️ WhatsApp credentials not configured');
}

/**
 * Send a text message via WhatsApp Cloud API
 */
export async function sendWhatsAppMessage(
  to: string,
  message: string,
  mediaUrl?: string
): Promise<void> {
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    throw new Error('WhatsApp not configured');
  }

  // Remove any non-numeric characters from phone number
  const cleanPhone = to.replace(/\D/g, '');

  const url = `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`;

  let body: any;

  if (mediaUrl) {
    // Send document with caption
    body = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanPhone,
      type: 'document',
      document: {
        link: mediaUrl,
        caption: message,
        filename: 'report.pdf',
      },
    };
  } else {
    // Send text message
    body = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanPhone,
      type: 'text',
      text: {
        preview_url: false,
        body: message,
      },
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('WhatsApp API Error:', error);
    throw new Error(`Failed to send WhatsApp message: ${response.statusText}`);
  }

  const result = await response.json();
  console.log('✅ Message sent:', result);
}

/**
 * Download media from WhatsApp Cloud API
 */
export async function downloadMedia(mediaId: string): Promise<Buffer> {
  if (!ACCESS_TOKEN) {
    throw new Error('WhatsApp not configured');
  }

  // Step 1: Get media URL
  const mediaInfoUrl = `${WHATSAPP_API_URL}/${mediaId}`;
  const mediaInfoResponse = await fetch(mediaInfoUrl, {
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
    },
  });

  if (!mediaInfoResponse.ok) {
    throw new Error(`Failed to get media info: ${mediaInfoResponse.statusText}`);
  }

  const mediaInfo = await mediaInfoResponse.json();
  const mediaUrl = mediaInfo.url;

  // Step 2: Download media file
  const mediaResponse = await fetch(mediaUrl, {
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
    },
  });

  if (!mediaResponse.ok) {
    throw new Error(`Failed to download media: ${mediaResponse.statusText}`);
  }

  return Buffer.from(await mediaResponse.arrayBuffer());
}

/**
 * Extract phone number from WhatsApp webhook payload
 */
export function extractPhoneNumber(phone: string): string {
  // Remove any non-numeric characters
  return phone.replace(/\D/g, '');
}

/**
 * Mark message as read
 */
export async function markMessageAsRead(messageId: string): Promise<void> {
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    return;
  }

  const url = `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`;

  await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    }),
  });
}
