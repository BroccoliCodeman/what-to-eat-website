export interface PredictionResult {
  object_id: number;
  bbox: number[];
  prediction: string;
  confidence: number;
  status: string;
}
