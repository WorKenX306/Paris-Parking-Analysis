import { AnalysisResult } from '../../types'

interface Props {
  data: AnalysisResult['heatmap']
}

function getColor(value: number): string {
  if (value >= 80) return 'bg-emerald-500'
  if (value >= 65) return 'bg-emerald-700'
  if (value >= 50) return 'bg-yellow-600'
  if (value >= 35) return 'bg-orange-600'
  return 'bg-red-600'
}

export default function HeatmapChart({ data }: Props) {
  const districts = Array.from(new Set(data.map((d) => d.arrond))).sort((a, b) => a - b)
  const types = Array.from(new Set(data.map((d) => d.est_payant))).sort()

  const lookup: Record<string, number> = {}
  data.forEach((d) => {
    lookup[`${d.arrond}-${d.est_payant}`] = d.taux_conformite
  })

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-1">
        Vue d'ensemble : arrondissement × type de parking
      </h3>
      <p className="text-sm text-gray-400 mb-1">
        Chaque case montre le taux de conformité pour un arrondissement et un type de parking donné.
      </p>
      <p className="text-xs text-gray-600 mb-6">
        Plus la case est verte, mieux la signalisation est respectée. Rouge = beaucoup d'emplacements mal signalés.
      </p>

      <div className="overflow-x-auto">
        <table className="text-xs border-separate border-spacing-1 min-w-full">
          <thead>
            <tr>
              <th className="text-gray-500 text-left pr-3 pb-2 font-normal">Arrond.</th>
              {types.map((t) => (
                <th key={t} className="text-gray-400 font-semibold pb-2 px-2 text-center whitespace-nowrap">
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {districts.map((arrond) => (
              <tr key={arrond}>
                <td className="text-gray-400 font-mono pr-3 py-0.5">{arrond}e</td>
                {types.map((type) => {
                  const val = lookup[`${arrond}-${type}`]
                  return (
                    <td key={type} className="py-0.5 px-0.5">
                      {val !== undefined ? (
                        <div
                          className={`${getColor(val)} rounded text-white font-semibold text-center py-1.5 px-2 min-w-[52px]`}
                          title={`${arrond}e arr. · ${type} : ${val}% de conformité`}
                        >
                          {val}%
                        </div>
                      ) : (
                        <div className="bg-gray-800 rounded text-gray-600 text-center py-1.5 px-2 min-w-[52px]">
                          —
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Légende */}
      <div className="flex items-center gap-3 mt-5 flex-wrap">
        <span className="text-xs text-gray-500">Légende :</span>
        {[
          { label: '≥ 80% — Très bien', cls: 'bg-emerald-500' },
          { label: '65–80% — Bien', cls: 'bg-emerald-700' },
          { label: '50–65% — Moyen', cls: 'bg-yellow-600' },
          { label: '35–50% — Insuffisant', cls: 'bg-orange-600' },
          { label: '< 35% — Problématique', cls: 'bg-red-600' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded ${l.cls}`} />
            <span className="text-xs text-gray-400">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
