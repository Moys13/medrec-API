interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
  timestamp?: string;
  meta?: object | null;
  error?: object | null;
}

interface ErrorDetail {
  message: string;
}

const responseApi = <T>(
  status: string,
  message: string,
  data?: T,
  error?: ErrorDetail | null,
  meta?: object | null,
): ApiResponse<T> => {
  return {
    status,
    message,
    data,
    timestamp: new Date().toISOString(),
    error: error || null,
    meta: meta || null,
  };
};

export default responseApi;
