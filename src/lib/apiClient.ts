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

const baseURL = "/api";
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

// Add a default request interceptor to prepare Content-Type headers and Authorization headers
addRequestInterceptor((config) => {
  const headers = new Headers(config.headers || {});
  if (!headers.has("Content-Type") && !(config.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("Accept", "application/json");

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

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

    // Read the response body first to determine success from response contract
    let data: any;
    let isJson = false;
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      try {
        data = await response.json();
        isJson = true;
      } catch {
        data = await response.text();
      }
    } else {
      data = await response.text();
    }

    // Determine success based on response "status" property if present, otherwise fallback to response.ok
    let isSuccess = response.ok;
    if (isJson && data && typeof data === "object" && "status" in data) {
      isSuccess = data.status === "SUCCESS";
    }

    if (!isSuccess) {
      const statusCode =
        isJson && data && typeof data === "object" && "statusCode" in data
          ? data.statusCode
          : response.status;
      const statusText =
        isJson && data && typeof data === "object" && "message" in data
          ? data.message
          : response.statusText;
      const apiError = createApiError(
        statusCode,
        statusText || "API Error",
        data,
      );

      // Execute response interceptor error handlers
      for (const interceptor of responseInterceptors) {
        if (interceptor.onError) {
          interceptor.onError(apiError);
        }
      }

      // Trigger status specific handler if registered
      const statusHandler = errorHandlers.get(statusCode);
      if (statusHandler) {
        statusHandler(apiError);
      } else if (globalErrorHandler) {
        globalErrorHandler(apiError);
      }

      throw apiError;
    }

    // Do not extract data from the response wrapper on success, pass it as-is to the component/caller
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
