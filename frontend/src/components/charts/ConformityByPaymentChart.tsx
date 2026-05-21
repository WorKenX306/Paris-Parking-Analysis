import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts'
import { AnalysisResult } from '../../types'

interface Props {
  data: AnalysisResult['by_payment']
}

const COLORS: Record<string, string> = {
  Payant: '#3b82f6',
  Gratuit: '#10b981',
  Autre: '#8b5cf6',
}

const LABELS: Record<string, string> = {
  Payant: 'Payant',
  Gratuit: 'Gratuit',
  Autre: 'Autre',
}

export default function ConformityByPaymentChart({ data }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-1">
        Signalisation conforme selon le type de parking
      </h3>
      <p className="text-sm text-gray-400 mb-1">
        Quelle proportion des emplacements a une signalisation aux normes ?
      </p>
      <p className="text-xs text-gray-600 mb-6">
        Plus la barre est haute, mieux les emplacements de ce type sont signalés.
      </p>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="est_payant"
            tick={{ fill: '#9ca3af', fontSize: 13 }}
            tickFormatter={(v) => LABELS[v] ?? v}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
            labelStyle={{ color: '#f9fafb', fontWeight: 600 }}
            labelFormatter={(v) => LABELS[v] ?? v}
            formatter={(value: number, _name: string, props) => [
              `${value}% — ${props.payload.conformes.toLocaleString('fr-FR')} conformes sur ${props.payload.total.toLocaleString('fr-FR')} emplacements`,
              'Taux de conformité',
            ]}
          />
          <Bar dataKey="taux" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.est_payant} fill={COLORS[entry.est_payant] ?? '#6b7280'} />
            ))}
            <LabelList
              dataKey="taux"
              position="top"
              formatter={(v: number) => `${v}%`}
              style={{ fill: '#e5e7eb', fontSize: 13, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
