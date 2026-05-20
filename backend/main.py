from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import requests
import pandas as pd
import numpy as np
from scipy.stats import chi2_contingency
import json
import io

app = FastAPI(title="Paris Parking Analysis API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Export endpoint — returns the full dataset as CSV with no offset limit
EXPORT_URL = (
    "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/"
    "stationnement-voie-publique-emplacements/exports/csv"
    "?delimiter=%3B&list_separator=%2C&quote_all=false&with_bom=true"
)

# ---------------------------------------------------------------------------
# Helper — download full dataset via CSV export (no offset limit)
# ---------------------------------------------------------------------------
def fetch_csv() -> pd.DataFrame:
    """
    Uses the /exports/csv endpoint which streams the full dataset at once.
    The Paris API caps pagination at offset ~10k, but the export has no limit.
    """
    response = requests.get(EXPORT_URL, timeout=120, stream=True)
    response.raise_for_status()

    # Collect streamed bytes
    chunks = []
    for chunk in response.iter_content(chunk_size=65536):
        if chunk:
            chunks.append(chunk)

    raw = b"".join(chunks)

    # The export uses BOM + semicolon separator
    df = pd.read_csv(
        io.BytesIO(raw),
        sep=";",
        encoding="utf-8-sig",
        low_memory=False,
    )
    return df


# ---------------------------------------------------------------------------
# Helper — run the full analysis and return structured results
# ---------------------------------------------------------------------------
def run_analysis(df: pd.DataFrame) -> dict:
    # Normalize column names to lowercase (CSV export may differ from JSON API)
    df.columns = [c.lower().strip() for c in df.columns]

    # --- Clean ---
    df = df[df["arrond"].between(1, 20)].copy()
    for col in ["regpri", "regpar", "confsign", "signhor", "signvert"]:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip().str.upper()

    df["est_payant"] = df["regpar"].apply(
        lambda x: "Payant" if "PAYANT" in x else ("Gratuit" if "GRATUIT" in x else "Autre")
    )
    df["est_conforme"] = df["confsign"].apply(
        lambda x: True if "CONFORME" in x and "NON" not in x else False
    )

    # --- Summary stats ---
    total_spots = len(df)
    total_compliant = int(df["est_conforme"].sum())
    overall_rate = round(total_compliant / total_spots * 100, 2)

    payment_dist = df["est_payant"].value_counts().to_dict()
    conformity_dist = df["est_conforme"].value_counts().rename({True: "Conforme", False: "Non conforme"}).to_dict()

    # --- Chi-square test ---
    ct = pd.crosstab(df["est_payant"], df["est_conforme"])
    chi2, p_value, dof, expected = chi2_contingency(ct)

    # --- Conformity rate by payment type ---
    by_payment = (
        df.groupby("est_payant")["est_conforme"]
        .agg(["sum", "count"])
        .rename(columns={"sum": "conformes", "count": "total"})
        .reset_index()
    )
    by_payment["taux"] = (by_payment["conformes"] / by_payment["total"] * 100).round(2)
    by_payment_list = by_payment.to_dict(orient="records")

    # --- Conformity rate by district ---
    by_district = (
        df.groupby("arrond")["est_conforme"]
        .agg(["sum", "count"])
        .rename(columns={"sum": "conformes", "count": "total"})
        .reset_index()
    )
    by_district["taux"] = (by_district["conformes"] / by_district["total"] * 100).round(2)
    by_district_list = by_district.to_dict(orient="records")

    # --- Heatmap data: district x payment type → conformity rate ---
    agg = df.groupby(["arrond", "est_payant"]).agg(
        total=("est_conforme", "count"),
        conformes=("est_conforme", "sum")
    ).reset_index()
    agg["taux_conformite"] = (agg["conformes"] / agg["total"] * 100).round(2)
    heatmap_list = agg.to_dict(orient="records")

    # --- Missing values ---
    missing = (df.isnull().sum() / len(df) * 100).round(2)
    missing_dict = missing[missing > 0].sort_values(ascending=False).to_dict()

    return {
        "summary": {
            "total_spots": total_spots,
            "total_compliant": total_compliant,
            "overall_compliance_rate": overall_rate,
            "payment_distribution": payment_dist,
            "conformity_distribution": conformity_dist,
        },
        "chi_square": {
            "chi2": round(float(chi2), 4),
            "p_value": round(float(p_value), 6),
            "degrees_of_freedom": int(dof),
            "significant": bool(p_value < 0.05),
        },
        "by_payment": by_payment_list,
        "by_district": by_district_list,
        "heatmap": heatmap_list,
        "missing_values": missing_dict,
    }


# ---------------------------------------------------------------------------
# Streaming endpoint — SSE
# ---------------------------------------------------------------------------
@app.get("/api/analyze")
async def analyze():
    def full_stream():
        # Step 1 — download CSV export
        yield f"data: {json.dumps({'type': 'progress', 'message': 'Connecting to Paris Open Data export...', 'percent': 5})}\n\n"

        try:
            yield f"data: {json.dumps({'type': 'progress', 'message': 'Downloading full dataset (~65k rows)...', 'percent': 10})}\n\n"
            df = fetch_csv()
            total = len(df)
            yield f"data: {json.dumps({'type': 'progress', 'message': f'Downloaded {total:,} records. Cleaning data...', 'percent': 50})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': f'Download failed: {str(e)}'})}\n\n"
            return

        # Step 2 — run analysis
        try:
            yield f"data: {json.dumps({'type': 'progress', 'message': 'Running statistical analysis...', 'percent': 70})}\n\n"
            results = run_analysis(df)
            yield f"data: {json.dumps({'type': 'progress', 'message': 'Analysis complete!', 'percent': 100})}\n\n"
            yield f"data: {json.dumps({'type': 'result', 'data': results})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': f'Analysis error: {str(e)}'})}\n\n"

    return StreamingResponse(full_stream(), media_type="text/event-stream")


@app.get("/api/health")
def health():
    return {"status": "ok"}
