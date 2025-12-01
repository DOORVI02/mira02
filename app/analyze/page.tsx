'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

interface AnalysisResult {
  summary: string;
  kpis: string[];
  charts: string[]; // base64 encoded images
  structuredReport?: {
    summary: string;
    kpis: string[];
    charts: { title: string; bullets: string[] }[];
    nextSteps?: string[];
  };
}

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.name.endsWith('.csv')) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Please upload a CSV file');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.name.endsWith('.csv')) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please upload a CSV file');
    }
  };

  const analyzeFile = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setProgress('Uploading file...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      setProgress('Starting AI analysis...');

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Analysis failed');
      }

      setProgress('Processing results...');
      const data = await response.json();
      setResult(data);
      setProgress('');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setProgress('');
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setProgress('');
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-slate-800">🔮 Mira</Link>
          {result && (
            <button 
              onClick={resetAnalysis}
              className="text-slate-600 hover:text-slate-800 text-sm"
            >
              ← New Analysis
            </button>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {!result ? (
          /* Upload Section */
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 text-center mb-2">
              Analyze Your Data
            </h1>
            <p className="text-slate-600 text-center mb-8">
              Upload a CSV file to get AI-powered insights and visualizations
            </p>

            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                file ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:border-blue-400 bg-white'
              }`}
            >
              {file ? (
                <div>
                  <div className="text-4xl mb-3">📄</div>
                  <p className="font-medium text-slate-800">{file.name}</p>
                  <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                  <button 
                    onClick={() => setFile(null)}
                    className="mt-3 text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-4xl mb-3">📊</div>
                  <p className="font-medium text-slate-800 mb-2">Drop your CSV file here</p>
                  <p className="text-sm text-slate-500 mb-4">or click to browse</p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-input"
                  />
                  <label
                    htmlFor="file-input"
                    className="inline-block bg-slate-100 text-slate-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors"
                  >
                    Select File
                  </label>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={analyzeFile}
              disabled={!file || loading}
              className={`w-full mt-6 py-4 rounded-xl font-semibold text-lg transition-all ${
                file && !loading
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner /> {progress || 'Analyzing...'}
                </span>
              ) : (
                'Start Analysis'
              )}
            </button>

            {loading && (
              <p className="text-center text-sm text-slate-500 mt-4">
                This may take 1-2 minutes. AI is analyzing your data and generating charts...
              </p>
            )}
          </div>
        ) : (
          /* Results Section */
          <div>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-slate-800">Analysis Results</h1>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                ✓ Complete
              </span>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-3">📝 Summary</h2>
              <p className="text-slate-600 leading-relaxed">
                {result.structuredReport?.summary || result.summary}
              </p>
            </div>

            {/* KPIs */}
            {(result.structuredReport?.kpis || result.kpis)?.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">📊 Key Metrics</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(result.structuredReport?.kpis || result.kpis).map((kpi, i) => (
                    <div key={i} className="bg-slate-50 rounded-lg p-4">
                      <p className="text-slate-700 font-medium">{kpi}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Charts */}
            {result.charts?.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">📈 Visualizations</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {result.charts.map((chart, i) => (
                    <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
                      <img 
                        src={`data:image/png;base64,${chart}`} 
                        alt={`Chart ${i + 1}`}
                        className="w-full"
                      />
                      {result.structuredReport?.charts?.[i] && (
                        <div className="p-4 bg-slate-50">
                          <h4 className="font-medium text-slate-800 mb-2">
                            {result.structuredReport.charts[i].title}
                          </h4>
                          <ul className="text-sm text-slate-600 space-y-1">
                            {result.structuredReport.charts[i].bullets?.map((b, j) => (
                              <li key={j}>• {b}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps */}
            {result.structuredReport?.nextSteps && result.structuredReport.nextSteps.length > 0 && (
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h2 className="text-lg font-semibold text-blue-800 mb-3">💡 Recommendations</h2>
                <ul className="space-y-2">
                  {result.structuredReport.nextSteps.map((step, i) => (
                    <li key={i} className="text-blue-700 flex items-start gap-2">
                      <span className="text-blue-500">→</span> {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}
