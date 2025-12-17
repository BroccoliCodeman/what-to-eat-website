import { PredictionResult } from "./predictionResult.interface";

export interface PredictionResponse {
  request_id: string;
  total_objects: number;
  active_learning_triggered: boolean;
  results: PredictionResult[];
}
