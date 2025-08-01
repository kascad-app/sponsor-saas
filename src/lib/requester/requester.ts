import request, { ApiRequestConfig } from "./request";

type BaseRequest = <TData>(
  url: string,
  options?: ApiRequestConfig,
) => Promise<TData>;

type RequestResponse = {
  get: BaseRequest;
  post: BaseRequest;
  put: BaseRequest;
  delete: BaseRequest;
  patch: BaseRequest;
};

const requester = (auth = true): RequestResponse => {
  // eslint-disable-next-line prefer-const
  let baseOptions: ApiRequestConfig = {};

  if (auth) baseOptions.credentials = "include";

  const createRequest =
    (method: string) =>
    async <TData = unknown>(
      url: string,
      options?: ApiRequestConfig,
    ): Promise<TData> => {
      return request<TData>(url, { ...baseOptions, ...options, method });
    };

  return {
    get: createRequest("GET"),
    post: createRequest("POST"),
    put: createRequest("PUT"),
    delete: createRequest("DELETE"),
    patch: createRequest("PATCH"),
  };
};

export { requester };
