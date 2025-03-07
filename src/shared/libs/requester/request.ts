import { APIResponse } from "@kascad-app/shared-types";

type FetchOptions = Omit<RequestInit, "body"> & {
  data?: unknown;
};

const request = async <TData>(
  url: string,
  options?: FetchOptions
): Promise<APIResponse<TData>> => {
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
  const data: APIResponse<TData> = await response.json();

  if (!data.success) {
    return data;
  }

  return data;
};

export type { FetchOptions as ApiRequestConfig };
export default request;
