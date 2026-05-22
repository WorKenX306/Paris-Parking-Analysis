# Analyse du stationnement parisien — Signalisation & Conformité

**Auteur : Mustapha Aziz Belkadhi**  
[LinkedIn](https://www.linkedin.com/in/belkadhi-mustapha-aziz-119619256/)

---

## Sujet

Ce projet analyse la relation entre le **type de stationnement** (payant / gratuit) et le **niveau de conformité de la signalisation** dans les 20 arrondissements de Paris.

**Hypothèse :** Les zones payantes bénéficient-elles d'une meilleure signalisation que les zones gratuites ? Ce lien varie-t-il selon l'arrondissement ?

---

## Données

- **Source :** [Paris Open Data](https://opendata.paris.fr/pages/home/)
- **Dataset :** Stationnement sur voie publique — emplacements
- **Volume :** ~65 000 emplacements
- **Récupération :** API officielle `/exports/csv`

---

## Stack technique

| Couche | Technologie |
|---|---|
| Exploration | Python, pandas, scipy |
| Backend | FastAPI, Server-Sent Events |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Recharts |
| Conteneurisation | Docker, docker-compose, nginx |

---

## Lancer le projet

### Prérequis
- Docker Desktop installé et démarré

### Démarrage

```bash
docker-compose up --build
```

Ouvrir [http://localhost](http://localhost) dans le navigateur, puis cliquer sur **Lancer l'analyse**.

---

## Structure du projet

```
tests/
├── Test.py                  # Script d'exploration Python (Jour 1)
├── docker-compose.yml       # Orchestration des conteneurs
├── backend/
│   ├── main.py              # API FastAPI + logique d'analyse
│   ├── requirements.txt
│   └── Dockerfile
└── frontend/
    ├── src/
    │   ├── App.tsx
    │   ├── types.ts
    │   └── components/
    │       ├── HeroSection.tsx
    │       ├── ProgressSection.tsx
    │       ├── ResultsSection.tsx
    │       ├── StatCards.tsx
    │       ├── ChiSquareCard.tsx
    │       ├── MissingValuesCard.tsx
    │       ├── Footer.tsx
    │       └── charts/
    │           ├── ConformityByPaymentChart.tsx
    │           ├── ConformityByDistrictChart.tsx
    │           └── HeatmapChart.tsx
    ├── Dockerfile
    └── nginx.conf
```

---

## Méthode statistique

Le lien entre type de stationnement et conformité est testé via un **test du chi-deux (χ²)** :
- H0 : le type de parking n'a pas d'influence sur la conformité
- H1 : il existe un lien significatif (p < 0,05)

Les résultats sont présentés en langage accessible, avec les détails techniques disponibles pour les experts.
