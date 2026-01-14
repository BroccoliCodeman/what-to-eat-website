export interface PoolItem {
  id: string;  // Ім'я файлу (наприклад, "uuid_0.jpg")
  url: string; // Відносний шлях, який повертає бекенд
}

export interface PoolResponse {
  count: number;
  items: PoolItem[];
}

export interface FeedbackRequest {
  image_id: string;
  correct_label: string;
}

export interface FeedbackResponse {
  status: string;
  message: string;
}

export interface RetrainResponse {
  status: string;
  message: string;
  samples_count: number;
}

export interface ClassListResponse {
  classes: string[];
}