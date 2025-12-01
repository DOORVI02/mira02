'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <nav className="flex justify-between items-center mb-16">
          <div className="text-2xl font-bold text-slate-800">🔮 Mira</div>
          <Link 
            href="/analyze"
            className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Start Analysis
          </Link>
        </nav>

        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
            AI-Powered Data Analysis
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Upload your CSV, get instant insights with beautiful visualizations and actionable KPIs. 
            Powered by E2B sandboxes and Gemini AI.
          </p>
          <Link 
            href="/analyze"
            className="inline-block bg-blue-600 text-white text-lg font-semibold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Start Analysis →
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <FeatureCard 
            icon="📊"
            title="Smart Data Analysis"
            description="Upload any CSV file and our AI automatically detects patterns, calculates KPIs, and identifies trends in your data."
          />
          <FeatureCard 
            icon="📈"
            title="Auto-Generated Charts"
            description="Get beautiful matplotlib visualizations - histograms, bar charts, scatter plots - all generated automatically."
          />
          <FeatureCard 
            icon="🤖"
            title="AI-Powered Insights"
            description="Gemini AI analyzes your data in a secure E2B sandbox, running real Python code to extract meaningful insights."
          />
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 mb-20">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-10">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Step number={1} title="Upload CSV" description="Drop your data file" />
            <Step number={2} title="AI Analysis" description="Gemini + E2B process your data" />
            <Step number={3} title="Visualizations" description="Charts generated with matplotlib" />
            <Step number={4} title="Get Insights" description="KPIs and recommendations" />
          </div>
        </div>

        {/* Tech Stack */}
        <div className="text-center mb-16">
          <h3 className="text-lg font-semibold text-slate-500 mb-4">Powered By</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['E2B Sandbox', 'Gemini AI', 'Next.js', 'Python', 'Matplotlib', 'Pandas'].map((tech) => (
              <span key={tech} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-full text-sm font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to analyze your data?</h2>
          <p className="text-blue-100 mb-6">No signup required. Just upload and get insights.</p>
          <Link 
            href="/analyze"
            className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Start Analysis
          </Link>
        </div>

        <footer className="text-center mt-16 text-slate-500 text-sm">
          Built for rapid data insights • Mira © 2025
        </footer>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
        {number}
      </div>
      <h4 className="font-semibold text-slate-800 mb-1">{title}</h4>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}
