import { NextRequest, NextResponse } from 'next/server';
import { runE2BAgent } from '../../../lib/e2b-agent';

export const maxDuration = 300; // 5 minutes max
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'Please upload a CSV file' }, { status: 400 });
    }

    console.log(`📊 Received file: ${file.name} (${file.size} bytes)`);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const csvBuffer = Buffer.from(arrayBuffer);

    console.log('🚀 Starting E2B analysis...');

    // Run the E2B agent
    const result = await runE2BAgent({
      csvBuffer,
      userMessage: `Analyze this CSV file named "${file.name}". Provide key insights, statistics, and create meaningful visualizations.`,
      conversationHistory: [],
    });

    console.log(`✅ Analysis complete: ${result.charts.length} charts generated`);

    // Convert chart buffers to base64 for JSON response
    const chartsBase64 = result.charts.map((chart) => chart.toString('base64'));

    return NextResponse.json({
      summary: result.summary,
      kpis: result.structuredReport?.kpis || [],
      charts: chartsBase64,
      structuredReport: result.structuredReport,
    });
  } catch (error: any) {
    console.error('❌ Analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    );
  }
}
