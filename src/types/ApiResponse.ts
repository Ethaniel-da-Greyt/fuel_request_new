export type ApiResponse = {
  access_token?: string;
  role?: string;
  message?: string;
  error?: string;
  status?: number;
};

export type LaravelResponse = {
  status: number;
  error: string;
};
