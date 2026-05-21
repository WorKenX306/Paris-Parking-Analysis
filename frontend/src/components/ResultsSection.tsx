import { AnalysisResult } from '../types'
import StatCards from './StatCards'
import ChiSquareCard from './ChiSquareCard'
import ConformityByPaymentChart from './charts/ConformityByPaymentChart'
import ConformityByDistrictChart from './charts/ConformityByDistrictChart'
import HeatmapChart from './charts/HeatmapChart'
import MissingValuesCard from './MissingValuesCard'

interface Props {
  result: AnalysisResult
}

export default function ResultsSection({ result }: Props) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 space-y-10">

      {/* En-tête résultats */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Résultats de l'analyse</h2>
        <p className="text-gray-400">
          Basé sur {result.summary.total_spots.toLocaleString('fr-FR')} emplacements de stationnement
          répartis dans les 20 arrondissements de Paris.
        </p>
      </div>

      {/* Chiffres clés */}
      <StatCards summary={result.summary} />

      {/* Réponse à la question principale */}
      <ChiSquareCard chiSquare={result.chi_square} />

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConformityByPaymentChart data={result.by_payment} />
        <MissingValuesCard missing={result.missing_values} />
      </div>

      <ConformityByDistrictChart data={result.by_district} />

      <HeatmapChart data={result.heatmap} />

      {/* Conclusion */}
      <div className="bg-gradient-to-br from-blue-950/60 to-gray-900 border border-blue-800/40 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-white mb-3">Ce qu'on peut retenir</h3>
        <p className="text-gray-300 leading-relaxed text-base">
          {result.chi_square.significant
            ? `Les données confirment qu'il existe un lien entre le type de stationnement et la qualité de la signalisation à Paris. Les zones payantes tendent à avoir une signalisation mieux conforme que les zones gratuites — et cette tendance varie selon les arrondissements. Ce résultat n'est pas dû au hasard (test du chi-deux : χ² = ${result.chi_square.chi2}, p = ${result.chi_square.p_value}).`
            : `Les données ne permettent pas de confirmer un lien clair entre le type de stationnement et la qualité de la signalisation (test du chi-deux : χ² = ${result.chi_square.chi2}, p = ${result.chi_square.p_value}). Les différences observées pourraient être dues au hasard. D'autres facteurs — comme l'ancienneté des relevés ou la densité de circulation — mériteraient d'être explorés.`
          }
        </p>
      </div>

      {/* Limites et incertitudes */}
      <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-white mb-3">⚠️ Limites et incertitudes</h3>
        <p className="text-sm text-gray-400 mb-5">
          Toute analyse de données a ses limites. Voici ce qu'il faut garder en tête pour interpréter ces résultats correctement.
        </p>
        <div className="space-y-4">
          <LimiteItem
            titre="Les données ne sont pas en temps réel"
            detail="Les relevés terrain ont été effectués entre 2020 et 2024. La situation sur le terrain a pu évoluer depuis — des emplacements peuvent avoir été rénovés ou dégradés."
          />
          <LimiteItem
            titre="La conformité ne mesure pas tout"
            detail="Un emplacement « conforme » signifie que la signalisation respecte les normes au moment du relevé. Cela ne dit rien sur la visibilité réelle, l'usure ou la compréhension par les conducteurs."
          />
          <LimiteItem
            titre="Certains champs sont incomplets"
            detail="Comme le montre le tableau des données manquantes, certains emplacements n'ont pas toutes les informations renseignées. Les résultats portent uniquement sur les données disponibles."
          />
          <LimiteItem
            titre="Le lien statistique n'est pas une cause"
            detail="Même si un lien est confirmé entre type de parking et conformité, cela ne prouve pas que l'un cause l'autre. D'autres facteurs (ancienneté du quartier, densité, budget de voirie) peuvent expliquer ce qu'on observe."
          />
          <LimiteItem
            titre="La catégorie « Autre » regroupe des cas variés"
            detail="Les emplacements classés « Autre » (vélos, livraisons, zones mixtes...) sont très différents les uns des autres. Les regrouper dans une même catégorie peut masquer des disparités internes."
          />
        </div>
      </div>

    </section>
  )
}

function LimiteItem({ titre, detail }: { titre: string; detail: string }) {
  return (
    <div className="flex gap-4">
      <span className="mt-1 w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
      <div>
        <p className="text-white font-medium text-sm mb-0.5">{titre}</p>
        <p className="text-gray-400 text-sm leading-relaxed">{detail}</p>
      </div>
    </div>
  )
}
