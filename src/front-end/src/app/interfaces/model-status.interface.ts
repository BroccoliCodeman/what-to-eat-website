export interface ModelStatus {
  status: string;
  model_version: string;
  uncertain_count: number;
  labeled_count: number;
  total_classes: number;
  device: string;
}