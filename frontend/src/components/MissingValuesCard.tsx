interface Props {
  missing: Record<string, number>
}

export default function MissingValuesCard({ missing }: Props) {
  const entries = Object.entries(missing).slice(0, 10)

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-1">Données manquantes</h3>
      <p className="text-sm text-gray-400 mb-5">
        Certains emplacements n'ont pas toutes les informations renseignées.
        Voici les champs les plus incomplets.
      </p>

      {entries.length === 0 ? (
        <p className="text-emerald-400 text-sm">Aucune donnée manquante détectée.</p>
      ) : (
        <div className="space-y-3">
          {entries.map(([col, pct]) => (
            <div key={col}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300 font-mono">{col}</span>
                <span className={pct > 50 ? 'text-red-400' : pct > 20 ? 'text-amber-400' : 'text-gray-400'}>
                  {pct}% manquant
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${pct > 50 ? 'bg-red-500' : pct > 20 ? 'bg-amber-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
