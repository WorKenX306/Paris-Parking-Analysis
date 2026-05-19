# =============================================================================
# TEST DATA SCIENTIST - JOUR 1
# Sujet : Relation entre type de stationnement (payant/gratuit)
#         et niveau de conformité de la signalisation par arrondissement
# Dataset : Stationnement sur voie publique - emplacements (Paris Open Data)
# Auteur  : Mustapha Aziz Belkadhi
# =============================================================================

import requests
import pandas as pd
import time

# =============================================================================
# ÉTAPE 1 — RÉCUPÉRATION DES DONNÉES VIA API
# =============================================================================

BASE_URL = (
    "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/"
    "stationnement-voie-publique-emplacements/records"
)

def fetch_all_records(limit=100, max_records=None):
    """
    Récupère tous les enregistrements du dataset via pagination.
    - limit       : nombre de records par appel (max 100 selon l'API)
    - max_records : si None, récupère tout le dataset
    """
    all_records = []
    offset = 0

    # Premier appel pour connaître le total
    r = requests.get(BASE_URL, params={"limit": 1})
    total = r.json().get("total_count", 0)
    if max_records:
        total = min(total, max_records)

    print(f"Total d'enregistrements à récupérer : {total}")

    while offset < total:
        params = {"limit": limit, "offset": offset}
        r = requests.get(BASE_URL, params=params)

        if r.status_code != 200:
            print(f"Erreur API à l'offset {offset} : {r.status_code}")
            break

        batch = r.json().get("results", [])
        if not batch:
            break

        all_records.extend(batch)
        offset += len(batch)
        print(f"  Récupéré {offset}/{total} enregistrements...", end="\r")
        time.sleep(0.1)  # Respecter le rate limit

    print(f"\nRécupération terminée : {len(all_records)} enregistrements.")
    return all_records


# --- Lancement de la récupération ---
records = fetch_all_records(limit=100)
df = pd.DataFrame(records)

# Sauvegarde locale pour ne pas rappeler l'API à chaque fois
df.to_csv("stationnement_paris.csv", index=False, encoding="utf-8-sig")
print("Données sauvegardées dans stationnement_paris.csv")


# =============================================================================
# ÉTAPE 2 — EXPLORATION INITIALE DU DATASET
# =============================================================================

print("\n" + "="*60)
print("EXPLORATION INITIALE")
print("="*60)

print(f"\nDimensions : {df.shape[0]} lignes x {df.shape[1]} colonnes")

print("\n--- Colonnes disponibles ---")
print(df.columns.tolist())

print("\n--- Types de données ---")
print(df.dtypes)

print("\n--- Aperçu des 3 premières lignes ---")
print(df.head(3).to_string())

print("\n--- Valeurs manquantes (%) ---")
missing = (df.isnull().sum() / len(df) * 100).sort_values(ascending=False)
print(missing[missing > 0].round(2))


# =============================================================================
# ÉTAPE 3 — FOCUS SUR LES COLONNES CLÉS POUR NOTRE HYPOTHÈSE
# =============================================================================
# Colonnes importantes :
#   regpri   → régime de priorité (type de stationnement : PAYANT, GRATUIT, etc.)
#   regpar   → régime de parking (Payant, Gratuit, Mixte, Vélos...)
#   confsign → conformité de la signalisation (Conforme / Non conforme)
#   arrond   → arrondissement (1 à 20)
#   signhor  → signalisation horizontale (Présente / Absente)
#   signvert → signalisation verticale (Présente / Absente)

KEY_COLS = ["regpri", "regpar", "confsign", "arrond", "signhor", "signvert"]

print("\n" + "="*60)
print("ANALYSE DES COLONNES CLÉS")
print("="*60)

for col in KEY_COLS:
    if col in df.columns:
        print(f"\n[{col}] — {df[col].nunique()} valeurs uniques :")
        print(df[col].value_counts(dropna=False).to_string())


# =============================================================================
# ÉTAPE 4 — NETTOYAGE ET PRÉPARATION
# =============================================================================

print("\n" + "="*60)
print("NETTOYAGE")
print("="*60)

# Garder uniquement les lignes avec arrondissement valide (1-20)
df = df[df["arrond"].between(1, 20)].copy()
print(f"Après filtre arrondissement : {len(df)} lignes")

# Normaliser les colonnes texte (strip + majuscules)
for col in ["regpri", "regpar", "confsign", "signhor", "signvert"]:
    if col in df.columns:
        df[col] = df[col].astype(str).str.strip().str.upper()

# Créer une colonne binaire : est-ce payant ?
# regpar contient : Payant, Gratuit, Mixte, Vélos, Livraison, etc.
df["est_payant"] = df["regpar"].apply(
    lambda x: "Payant" if "PAYANT" in x else ("Gratuit" if "GRATUIT" in x else "Autre")
)

# Créer une colonne binaire : signalisation conforme ?
df["est_conforme"] = df["confsign"].apply(
    lambda x: True if "CONFORME" in x and "NON" not in x else False
)

print("\nDistribution est_payant :")
print(df["est_payant"].value_counts())

print("\nDistribution est_conforme :")
print(df["est_conforme"].value_counts())

print("\nCrosstab payant x conformité :")
ct = pd.crosstab(df["est_payant"], df["est_conforme"], margins=True)
print(ct)


# =============================================================================
# ÉTAPE 5 — STATISTIQUES PAR ARRONDISSEMENT
# =============================================================================

print("\n" + "="*60)
print("STATISTIQUES PAR ARRONDISSEMENT")
print("="*60)

# Taux de conformité par arrondissement et type de stationnement
agg = df.groupby(["arrond", "est_payant"]).agg(
    total=("est_conforme", "count"),
    conformes=("est_conforme", "sum")
).reset_index()

agg["taux_conformite"] = (agg["conformes"] / agg["total"] * 100).round(2)

print(agg.to_string(index=False))

# Sauvegarde du dataframe nettoyé
df.to_csv("stationnement_nettoye.csv", index=False, encoding="utf-8-sig")
agg.to_csv("conformite_par_arrond.csv", index=False, encoding="utf-8-sig")
print("\nFichiers sauvegardés : stationnement_nettoye.csv, conformite_par_arrond.csv")

print("\n" + "="*60)
print("JOUR 1 TERMINÉ — Prêt pour l'analyse (Jour 2)")
print("="*60)
