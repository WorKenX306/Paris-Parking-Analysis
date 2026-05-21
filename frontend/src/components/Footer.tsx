export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-800 bg-gray-950 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Gauche — nom + copyright */}
        <div className="text-center md:text-left">
          <p className="text-white font-semibold text-sm">Mustapha Aziz Belkadhi</p>
          <p className="text-gray-500 text-xs mt-1">
            © {year} Tous droits réservés · Analyse Data Science — Paris Open Data
          </p>
        </div>

        {/* Droite — liens sociaux */}
        <div className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/belkadhi-mustapha-aziz-119619256/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-400 hover:text-blue-400 hover:border-blue-500/50 transition-all duration-150 text-sm"
          >
            {/* LinkedIn icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 text-blue-500"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
        </div>

      </div>
    </footer>
  )
}
