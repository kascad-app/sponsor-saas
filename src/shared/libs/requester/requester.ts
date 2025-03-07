import { APIResponse, APIResponsePromise } from "@kascad-app/shared-types";
import request, { ApiRequestConfig } from "./request";

// const createAuthHeaders = (jwtToken: string): HeadersInit => ({
//   Authorization: `${
//     process.env.NEXT_PUBLIC_AUTH_PREFIX || "Bearer"
//   } ${jwtToken}`,
// });

type BaseRequest = <TData>(
  url: string,
  options?: ApiRequestConfig
) => APIResponsePromise<TData>;

type RequestResponse = {
  get: BaseRequest;
  post: BaseRequest;
  put: BaseRequest;
  delete: BaseRequest;
};

const requester = (auth = true): RequestResponse => {
  // eslint-disable-next-line prefer-const
  let baseOptions: ApiRequestConfig = {};

  if (auth) baseOptions.credentials = "include";

  const createRequest =
    (method: string) =>
    async <TData = unknown>(
      url: string,
      options?: ApiRequestConfig
    ): Promise<APIResponse<TData>> => {
      return request<TData>(url, { ...baseOptions, ...options, method });
    };

  return {
    get: createRequest("GET"),
    post: createRequest("POST"),
    put: createRequest("PUT"),
    delete: createRequest("DELETE"),
  };
};

export { requester };
