import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts'
import { AnalysisResult } from '../../types'

interface Props {
  data: AnalysisResult['by_district']
}

export default function ConformityByDistrictChart({ data }: Props) {
  const sorted = [...data].sort((a, b) => a.arrond - b.arrond)
  const avg = sorted.reduce((s, d) => s + d.taux, 0) / sorted.length

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-1">
        Conformité de la signalisation par arrondissement
      </h3>
      <p className="text-sm text-gray-400 mb-1">
        Chaque barre représente un arrondissement (du 1er au 20e).
      </p>
      <p className="text-xs text-gray-600 mb-6">
        La ligne pointillée jaune indique la moyenne parisienne ({avg.toFixed(1)}%).
        Les barres <span className="text-blue-400">bleues</span> sont au-dessus de la moyenne,
        les <span className="text-red-400">rouges</span> en dessous.
      </p>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={sorted} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="arrond"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            label={{ value: 'Arrondissement', position: 'insideBottom', offset: -10, fill: '#6b7280', fontSize: 12 }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
            labelFormatter={(label) => `${label}e arrondissement`}
            formatter={(value: number, _name: string, props) => [
              `${value}% de conformité (${props.payload.conformes.toLocaleString('fr-FR')} conformes sur ${props.payload.total.toLocaleString('fr-FR')} emplacements)`,
              '',
            ]}
          />
          <ReferenceLine
            y={avg}
            stroke="#f59e0b"
            strokeDasharray="6 3"
            label={{ value: `Moy. ${avg.toFixed(1)}%`, fill: '#f59e0b', fontSize: 11, position: 'right' }}
          />
          <Bar dataKey="taux" radius={[4, 4, 0, 0]}>
            {sorted.map((entry) => (
              <Cell
                key={entry.arrond}
                fill={entry.taux >= avg ? '#3b82f6' : '#ef4444'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
