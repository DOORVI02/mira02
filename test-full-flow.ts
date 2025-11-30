// Full end-to-end test of the E2B agent via the actual module
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
  console.log('=== FULL E2B AGENT TEST ===\n');
  
  // Dynamically import the agent (compiled by Next.js)
  // We'll call it directly instead of through the webhook
  
  const csvBuffer = fs.readFileSync('./iris-dataset.csv');
  console.log(`📊 CSV loaded: ${csvBuffer.length} bytes`);
  
  // Import the actual agent
  const { runE2BAgent } = await import('./lib/e2b-agent.ts');
  
  console.log('\n🚀 Running E2B Agent...\n');
  
  try {
    const result = await runE2BAgent({
      csvBuffer,
      userMessage: 'Analyze this iris flower dataset. Show species distribution and key patterns.',
      conversationHistory: []
    });
    
    console.log('\n=== RESULTS ===');
    console.log('Summary length:', result.summary.length);
    console.log('Charts generated:', result.charts.length);
    
    // Save charts
    for (let i = 0; i < result.charts.length; i++) {
      const chartPath = `./output-chart-${i + 1}.png`;
      fs.writeFileSync(chartPath, result.charts[i]);
      console.log(`💾 Saved: ${chartPath}`);
    }
    
    console.log('\n--- Summary Preview ---');
    console.log(result.summary.substring(0, 500));
    
    if (result.structuredReport) {
      console.log('\n--- Structured Report ---');
      console.log('KPIs:', result.structuredReport.kpis?.slice(0, 3));
    }
    
    console.log('\n✅ SUCCESS!');
    
  } catch (error: any) {
    console.error('\n❌ FAILED:', error.message);
    console.error(error.stack);
  }
}

main();
