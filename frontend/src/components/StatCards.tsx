import { AnalysisResult } from '../types'

interface Props {
  summary: AnalysisResult['summary']
}

export default function StatCards({ summary }: Props) {
  const cards = [
    {
      label: 'Emplacements analysés',
      value: summary.total_spots.toLocaleString('fr-FR'),
      sub: 'dans les 20 arrondissements de Paris',
      color: 'border-blue-500/40 bg-blue-950/20',
      accent: 'text-blue-400',
    },
    {
      label: 'Signalisation conforme',
      value: summary.total_compliant.toLocaleString('fr-FR'),
      sub: `soit ${summary.overall_compliance_rate}% des emplacements`,
      color: 'border-emerald-500/40 bg-emerald-950/20',
      accent: 'text-emerald-400',
    },
    {
      label: 'Zones payantes',
      value: (summary.payment_distribution['Payant'] ?? 0).toLocaleString('fr-FR'),
      sub: 'emplacements avec horodateur',
      color: 'border-purple-500/40 bg-purple-950/20',
      accent: 'text-purple-400',
    },
    {
      label: 'Zones gratuites',
      value: (summary.payment_distribution['Gratuit'] ?? 0).toLocaleString('fr-FR'),
      sub: 'emplacements sans paiement',
      color: 'border-amber-500/40 bg-amber-950/20',
      accent: 'text-amber-400',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div key={i} className={`border rounded-xl p-5 ${card.color}`}>
          <p className="text-sm text-gray-400 mb-1">{card.label}</p>
          <p className={`text-3xl font-bold ${card.accent}`}>{card.value}</p>
          <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
        </div>
      ))}
    </div>
  )
}
