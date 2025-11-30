export interface UserSession {
  userId: string;
  csvPath?: string;
  csvBuffer?: Buffer;
  conversationHistory: Message[];
  analysisResults?: AnalysisResults;
  lastActivity: Date;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface AnalysisResults {
  reasoning: string;
  sqlQueries: ToolCallResult[];
  webResearch: ToolCallResult[];
  charts: ToolCallResult[];
  statistics: ToolCallResult[];
}

export interface ToolCallResult {
  toolName: string;
  args: any;
  result: any;
}

// Meta WhatsApp Cloud API Webhook Types
export interface WhatsAppWebhookPayload {
  object: string;
  entry: WhatsAppEntry[];
}

export interface WhatsAppEntry {
  id: string;
  changes: WhatsAppChange[];
}

export interface WhatsAppChange {
  value: WhatsAppValue;
  field: string;
}

export interface WhatsAppValue {
  messaging_product: string;
  metadata: WhatsAppMetadata;
  contacts?: WhatsAppContact[];
  messages?: WhatsAppMessage[];
  statuses?: WhatsAppStatus[];
}

export interface WhatsAppMetadata {
  display_phone_number: string;
  phone_number_id: string;
}

export interface WhatsAppContact {
  profile: {
    name: string;
  };
  wa_id: string;
}

export interface WhatsAppMessage {
  from: string;
  id: string;
  timestamp: string;
  type: string;
  text?: {
    body: string;
  };
  image?: WhatsAppMedia;
  document?: WhatsAppMedia;
  audio?: WhatsAppMedia;
  video?: WhatsAppMedia;
  context?: {
    from: string;
    id: string;
  };
}

export interface WhatsAppMedia {
  id?: string;
  mime_type?: string;
  sha256?: string;
  caption?: string;
  filename?: string;
}

export interface WhatsAppStatus {
  id: string;
  status: string;
  timestamp: string;
  recipient_id: string;
}

export interface E2BAgentInput {
  csvBuffer: Buffer;
  userMessage: string;
  conversationHistory: Message[];
}

export interface E2BAgentOutput {
  summary: string;
  charts: Buffer[];  // Array of chart image buffers from matplotlib
  externalContext?: string;
  structuredReport?: ReportData;
  insights: any;     // Raw insights from agent
}

export interface ReportChart {
  title: string;
  bullets: string[];
}

export interface ReportData {
  summary: string;
  kpis: string[];
  charts: ReportChart[];
  externalContext?: string[];
  nextSteps?: string[];
  additionalDetails?: string[];
}
