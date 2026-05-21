export interface AnalysisResult {
  summary: {
    total_spots: number
    total_compliant: number
    overall_compliance_rate: number
    payment_distribution: Record<string, number>
    conformity_distribution: Record<string, number>
  }
  chi_square: {
    chi2: number
    p_value: number
    degrees_of_freedom: number
    significant: boolean
  }
  by_payment: Array<{
    est_payant: string
    conformes: number
    total: number
    taux: number
  }>
  by_district: Array<{
    arrond: number
    conformes: number
    total: number
    taux: number
  }>
  heatmap: Array<{
    arrond: number
    est_payant: string
    total: number
    conformes: number
    taux_conformite: number
  }>
  missing_values: Record<string, number>
}

export type AnalysisStatus = 'idle' | 'loading' | 'done' | 'error'

export interface ProgressEvent {
  type: 'progress'
  message: string
  percent: number
}

export interface ResultEvent {
  type: 'result'
  data: AnalysisResult
}

export interface ErrorEvent {
  type: 'error'
  message: string
}

export type SSEEvent = ProgressEvent | ResultEvent | ErrorEvent
