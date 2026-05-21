import { Play, Database, MapPin, BarChart2 } from 'lucide-react'
import { AnalysisStatus } from '../types'

interface Props {
  onStart: () => void
  status: AnalysisStatus
}

export default function HeroSection({ onStart, status }: Props) {
  const isLoading = status === 'loading'

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-paris-blue/20 border-b border-gray-800">
      {/* Grille de fond */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 py-20">
        {/* Badge source */}
        <div className="inline-flex items-center gap-2 bg-paris-blue/20 border border-paris-blue/40 rounded-full px-4 py-1.5 text-sm text-blue-300 mb-8">
          <MapPin size={14} />
          Paris Open Data · Stationnement sur voie publique
        </div>

        {/* Titre */}
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
          La signalisation des parkings parisiens
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            est-elle vraiment aux normes ?
          </span>
        </h1>

        {/* Signature auteur */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-px bg-gray-600" />
          <a
            href="https://www.linkedin.com/in/belkadhi-mustapha-aziz-119619256/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors duration-150 group"
          >
            <span>par</span>
            <span className="font-semibold text-gray-300 group-hover:text-blue-400">
              Mustapha Aziz Belkadhi
            </span>
            {/* Icône LinkedIn inline */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 text-blue-500 group-hover:text-blue-400"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <div className="w-8 h-px bg-gray-600" />
        </div>

        {/* Hypothèse — langage simple */}
        <div className="max-w-3xl mb-12 space-y-4">
          <p className="text-lg text-gray-300 leading-relaxed">
            <span className="text-white font-semibold">Notre question : </span>
            Les zones de stationnement payant sont-elles mieux signalées que les zones gratuites ?
            Et est-ce que ça change selon l'arrondissement ?
          </p>
          <p className="text-base text-gray-400 leading-relaxed">
            On part de l'idée que là où la Ville perçoit des recettes (parking payant), elle a
            plus d'intérêt à entretenir une signalisation correcte. On va vérifier si les données
            confirment ou contredisent cette hypothèse.
          </p>
          <p className="text-sm text-gray-500 leading-relaxed border-l-2 border-gray-700 pl-4">
            <span className="text-gray-400 font-medium">Pour les experts — </span>
            Nous testons l'indépendance entre la variable « type de régime » (payant / gratuit / autre)
            et la variable « conformité de la signalisation » via un test du chi-deux (χ²),
            avec une analyse spatiale par arrondissement.
          </p>
        </div>

        {/* 3 cartes d'info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <InfoCard
            icon={<Database size={20} className="text-blue-400" />}
            title="Les données"
            lines={[
              'Source : Paris Open Data',
              '~65 000 emplacements de stationnement',
              'Données collectées sur le terrain par la Ville',
            ]}
          />
          <InfoCard
            icon={<MapPin size={20} className="text-emerald-400" />}
            title="Le problème"
            lines={[
              'Une signalisation absente ou incorrecte',
              'peut entraîner des amendes injustes.',
              'Où sont les zones les plus mal signalées ?',
            ]}
          />
          <InfoCard
            icon={<BarChart2 size={20} className="text-purple-400" />}
            title="Notre méthode"
            lines={[
              'Comparaison payant vs gratuit',
              'Taux de conformité par arrondissement',
              'Test statistique pour valider le lien',
            ]}
          />
        </div>

        {/* Bouton lancer */}
        <button
          onClick={onStart}
          disabled={isLoading}
          className={`
            inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg
            transition-all duration-200 shadow-lg
            ${isLoading
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white hover:shadow-blue-500/25 hover:scale-105 active:scale-100'
            }
          `}
        >
          {isLoading ? (
            <>
              <span className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              Analyse en cours...
            </>
          ) : (
            <>
              <Play size={20} fill="currentColor" />
              Lancer l'analyse
            </>
          )}
        </button>

        {status === 'done' && (
          <p className="mt-4 text-sm text-emerald-400">
            ✓ Analyse terminée — faites défiler pour voir les résultats
          </p>
        )}
      </div>
    </section>
  )
}

function InfoCard({
  icon,
  title,
  lines,
}: {
  icon: React.ReactNode
  title: string
  lines: string[]
}) {
  return (
    <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-5 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="font-semibold text-white">{title}</span>
      </div>
      {lines.map((line, i) => (
        <p key={i} className="text-sm text-gray-400 leading-relaxed">
          {line}
        </p>
      ))}
    </div>
  )
}
