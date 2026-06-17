export interface RequestInterceptor {
  (config: RequestInit): RequestInit | Promise<RequestInit>;
}

export interface ResponseInterceptor<T = any> {
  onSuccess?: (data: T) => T | Promise<T>;
  onError?: (error: ApiError) => any;
}

export interface ApiError extends Error {
  status: number;
  statusText: string;
  data: any;
  __isApiError: true;
}

export function createApiError(
  status: number,
  statusText: string,
  data: any,
): ApiError {
  const error = new Error(`API Error: ${status} ${statusText}`) as any;
  error.name = "ApiError";
  error.status = status;
  error.statusText = statusText;
  error.data = data;
  error.__isApiError = true;
  return error as ApiError;
}

export function isApiError(error: any): error is ApiError {
  return (
    typeof error === "object" && error !== null && error.__isApiError === true
  );
}

const getBaseURL = (): string => {
  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;
    // Route API requests containing /api/ to port 3001
    return `${protocol}//${hostname}:3001/api`;
  }
  return "http://localhost:3001/api";
};

const baseURL = getBaseURL();
let requestInterceptors: RequestInterceptor[] = [];
let responseInterceptors: ResponseInterceptor[] = [];
const errorHandlers = new Map<number, (error: ApiError) => void>();
let globalErrorHandler: ((error: Error) => void) | undefined;

// Helper to register default headers before any client calls
export function addRequestInterceptor(
  interceptor: RequestInterceptor,
): () => void {
  requestInterceptors.push(interceptor);
  return () => {
    requestInterceptors = requestInterceptors.filter((i) => i !== interceptor);
  };
}

export function addResponseInterceptor<T>(
  interceptor: ResponseInterceptor<T>,
): () => void {
  responseInterceptors.push(interceptor);
  return () => {
    responseInterceptors = responseInterceptors.filter(
      (i) => i !== interceptor,
    );
  };
}

export function registerStatusHandler(
  status: number,
  handler: (error: ApiError) => void,
): void {
  errorHandlers.set(status, handler);
}

export function registerGlobalErrorHandler(
  handler: (error: Error) => void,
): void {
  globalErrorHandler = handler;
}

// Add a default request interceptor to prepare Content-Type headers
addRequestInterceptor((config) => {
  const headers = new Headers(config.headers || {});
  if (!headers.has("Content-Type") && !(config.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("Accept", "application/json");
  return { ...config, headers };
});

export async function request<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${baseURL}${path}`;

  // Execute request interceptors sequentially
  let config = { ...options };
  for (const interceptor of requestInterceptors) {
    config = await interceptor(config);
  }

  try {
    const response = await fetch(url, config);

    // Handle non-2xx statuses
    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }

      const apiError = createApiError(
        response.status,
        response.statusText,
        errorData,
      );

      // Execute response interceptor error handlers
      for (const interceptor of responseInterceptors) {
        if (interceptor.onError) {
          interceptor.onError(apiError);
        }
      }

      // Trigger status specific handler if registered
      const statusHandler = errorHandlers.get(response.status);
      if (statusHandler) {
        statusHandler(apiError);
      } else if (globalErrorHandler) {
        globalErrorHandler(apiError);
      }

      throw apiError;
    }

    // Massage the success response
    let data: any;
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Execute response interceptors sequentially on success
    let massagedData = data as T;
    for (const interceptor of responseInterceptors) {
      if (interceptor.onSuccess) {
        massagedData = await interceptor.onSuccess(massagedData);
      }
    }

    return massagedData;
  } catch (error: any) {
    // Catch network-level errors or standard request issues
    if (!isApiError(error)) {
      if (globalErrorHandler) {
        globalErrorHandler(error);
      }
    }
    throw error;
  }
}

export function get<T = any>(
  path: string,
  options?: Omit<RequestInit, "method" | "body">,
): Promise<T> {
  return request<T>(path, { ...options, method: "GET" });
}

export function post<T = any>(
  path: string,
  body?: any,
  options?: Omit<RequestInit, "method" | "body">,
): Promise<T> {
  const serializedBody =
    body !== undefined && !(body instanceof FormData)
      ? JSON.stringify(body)
      : body;
  return request<T>(path, { ...options, method: "POST", body: serializedBody });
}

export function put<T = any>(
  path: string,
  body?: any,
  options?: Omit<RequestInit, "method" | "body">,
): Promise<T> {
  const serializedBody =
    body !== undefined && !(body instanceof FormData)
      ? JSON.stringify(body)
      : body;
  return request<T>(path, { ...options, method: "PUT", body: serializedBody });
}

export function del<T = any>(
  path: string,
  options?: Omit<RequestInit, "method" | "body">,
): Promise<T> {
  return request<T>(path, { ...options, method: "DELETE" });
}

// Backward-compatible mapping of modern functions to a standard api client object
export const apiClient = {
  get,
  post,
  put,
  delete: del,
  request,
  addRequestInterceptor,
  addResponseInterceptor,
  registerStatusHandler,
  registerGlobalErrorHandler,
};
