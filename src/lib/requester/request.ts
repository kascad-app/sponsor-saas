type FetchOptions = Omit<RequestInit, "body"> & {
  data?: unknown;
};

const request = async <TData>(
  url: string,
  options?: FetchOptions
): Promise<TData> => {
  const headers = new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
    credentials: "include",
    ...options?.headers,
  });

  const config: RequestInit = {
    ...options,
    headers,
    body: options?.data ? JSON.stringify(options.data) : undefined,
    method: options?.method || "GET",
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_PATH}${url}`,
    config
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data: TData = await response.json();
    return data;
  }

  return {} as TData;
};

export type { FetchOptions as ApiRequestConfig };
export default request;
