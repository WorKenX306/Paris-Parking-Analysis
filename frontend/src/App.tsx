import { useState } from 'react'
import { AnalysisResult, AnalysisStatus } from './types'
import HeroSection from './components/HeroSection'
import ProgressSection from './components/ProgressSection'
import ResultsSection from './components/ResultsSection'
import Footer from './components/Footer'

export default function App() {
  const [status, setStatus] = useState<AnalysisStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const startAnalysis = () => {
    setStatus('loading')
    setProgress(0)
    setProgressMessage('Connexion à l\'API Paris Open Data...')
    setResult(null)
    setError(null)

    // Use env var for backend URL (set at build time on Render)
    // Falls back to relative /api for local docker-compose usage
    const backendUrl = import.meta.env.VITE_BACKEND_URL ?? ''
    const eventSource = new EventSource(`${backendUrl}/api/analyze`)

    eventSource.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data)

        if (parsed.type === 'progress') {
          setProgress(parsed.percent)
          setProgressMessage(parsed.message)
        } else if (parsed.type === 'result') {
          setResult(parsed.data)
          setStatus('done')
          eventSource.close()
        } else if (parsed.type === 'error') {
          setError(parsed.message)
          setStatus('error')
          eventSource.close()
        }
      } catch {
        // ignore parse errors on empty lines
      }
    }

    eventSource.onerror = () => {
      setError('Connexion au serveur impossible. Vérifiez que le backend est bien démarré.')
      setStatus('error')
      eventSource.close()
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection onStart={startAnalysis} status={status} />

      {(status === 'loading') && (
        <ProgressSection progress={progress} message={progressMessage} />
      )}

      {status === 'error' && (
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="bg-red-900/40 border border-red-500 rounded-xl p-6 text-red-300">
            <p className="font-semibold text-red-400 mb-1">L'analyse a échoué</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {status === 'done' && result && (
        <ResultsSection result={result} />
      )}

      <div className="flex-1" />
      <Footer />
    </div>
  )
}
