import { AnalysisResult } from '../types'

interface Props {
  chiSquare: AnalysisResult['chi_square']
}

export default function ChiSquareCard({ chiSquare }: Props) {
  return (
    <div className={`border rounded-2xl p-6 ${chiSquare.significant ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-amber-500/40 bg-amber-950/10'}`}>

      {/* Verdict en langage simple — mis en avant */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-2">
            Le lien entre type de parking et signalisation est-il réel ?
          </h3>
          <p className="text-base text-gray-300 max-w-2xl leading-relaxed">
            {chiSquare.significant
              ? 'Oui — les données montrent clairement que le type de stationnement (payant ou gratuit) a un impact sur la qualité de la signalisation. Ce n\'est pas dû au hasard.'
              : 'Pas vraiment — la différence observée entre zones payantes et gratuites n\'est pas assez grande pour être certaine. Elle pourrait être due au hasard.'}
          </p>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${chiSquare.significant ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
          {chiSquare.significant ? '✓ Lien confirmé' : '✗ Lien non confirmé'}
        </span>
      </div>

      {/* Explication simple du raisonnement */}
      <div className="bg-gray-900/60 rounded-xl p-4 mb-5 text-sm text-gray-300 leading-relaxed">
        <p>
          Pour vérifier si le lien est réel, on a utilisé un test statistique qui compare
          ce qu'on observe dans les données à ce qu'on obtiendrait si le type de parking
          n'avait aucune influence sur la signalisation.
          {chiSquare.significant
            ? ' Le résultat montre que la différence est trop grande pour être due au hasard : il y a bien un lien.'
            : ' Le résultat montre que la différence pourrait facilement être due au hasard : on ne peut pas conclure à un lien.'}
        </p>
      </div>

      {/* Chiffres techniques — pour les experts */}
      <div className="border-t border-gray-700 pt-4">
        <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">Détails techniques (test du chi-deux)</p>
        <div className="grid grid-cols-3 gap-4">
          <Metric
            label="Valeur χ²"
            value={chiSquare.chi2.toString()}
            hint="Plus cette valeur est élevée, plus le lien est fort"
          />
          <Metric
            label="p-valeur"
            value={chiSquare.p_value.toString()}
            hint={chiSquare.significant ? 'Inférieure à 0,05 → lien statistiquement significatif' : 'Supérieure à 0,05 → pas de lien significatif'}
          />
          <Metric
            label="Degrés de liberté"
            value={chiSquare.degrees_of_freedom.toString()}
            hint="Nombre de catégories comparées moins 1"
          />
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="bg-gray-900/60 rounded-xl p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-gray-600 leading-snug">{hint}</p>
    </div>
  )
}
