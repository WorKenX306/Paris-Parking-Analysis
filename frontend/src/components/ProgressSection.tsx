interface Props {
  progress: number
  message: string
}

export default function ProgressSection({ progress, message }: Props) {
  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-white font-semibold">Récupération et analyse des données...</span>
        </div>

        {/* Barre de progression */}
        <div className="w-full bg-gray-800 rounded-full h-3 mb-3 overflow-hidden">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between text-sm text-gray-400 mb-6">
          <span>{message}</span>
          <span>{progress}%</span>
        </div>

        {/* Étapes */}
        <div className="space-y-2">
          {[
            { label: 'Connexion à l\'API Paris Open Data', done: progress >= 5 },
            { label: 'Téléchargement des ~65 000 emplacements', done: progress >= 40 },
            { label: 'Nettoyage et mise en forme des données', done: progress >= 60 },
            { label: 'Calcul des taux de conformité', done: progress >= 80 },
            { label: 'Test statistique et résultats par arrondissement', done: progress >= 100 },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors duration-300 ${
                  step.done
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-700 text-gray-500'
                }`}
              >
                {step.done ? '✓' : i + 1}
              </span>
              <span className={step.done ? 'text-gray-300' : 'text-gray-500'}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
