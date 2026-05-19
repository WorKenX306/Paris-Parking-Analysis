export default function DemarcheSection() {
  const steps = [
    {
      num: '01',
      titre: 'On a exploré les données',
      detail:
        'En parcourant le dataset, on a remarqué que les emplacements ont deux informations clés : leur type de régime (payant, gratuit, autre) et si leur signalisation est conforme ou non. La question s\'est posée naturellement.',
      color: 'border-blue-500/40 text-blue-400',
    },
    {
      num: '02',
      titre: 'On a formulé une hypothèse',
      detail:
        'Là où la Ville perçoit des recettes (parking payant), elle a probablement plus d\'intérêt à maintenir une signalisation correcte. On a donc supposé que les zones payantes seraient mieux conformes.',
      color: 'border-purple-500/40 text-purple-400',
    },
    {
      num: '03',
      titre: 'On a testé cette hypothèse',
      detail:
        'On a calculé le taux de conformité pour chaque type de stationnement, puis utilisé un test statistique (chi-deux) pour vérifier si la différence observée est réelle ou due au hasard.',
      color: 'border-amber-500/40 text-amber-400',
    },
    {
      num: '04',
      titre: 'On a analysé la dimension spatiale',
      detail:
        'On a ensuite regardé si ce lien varie selon les arrondissements — parce qu\'une tendance globale peut cacher des disparités locales importantes.',
      color: 'border-emerald-500/40 text-emerald-400',
    },
  ]

  return (
    <section className="max-w-6xl mx-auto px-6 pt-14 pb-2">
      <h2 className="text-xl font-bold text-white mb-2">Notre démarche</h2>
      <p className="text-sm text-gray-400 mb-8">
        Comme un vrai data scientist, on n'est pas parti avec une réponse toute faite — on a laissé les données guider l'analyse.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((s) => (
          <div key={s.num} className={`border rounded-xl p-5 bg-gray-900/40 ${s.color.split(' ')[0]}`}>
            <span className={`text-2xl font-black mb-3 block ${s.color.split(' ')[1]}`}>{s.num}</span>
            <p className="text-white font-semibold text-sm mb-2">{s.titre}</p>
            <p className="text-gray-400 text-xs leading-relaxed">{s.detail}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
