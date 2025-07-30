import useSWR, { SWRConfiguration } from "swr";
import { requester } from "../requester/requester";

export const useAPI = <T = unknown>(
  path: string | null,
  options?: SWRConfiguration
) => {
  return useSWR<T>(
    path,
    async (url) => {
      const response = await requester().get<T>(url);
      return response;
    },
    options
  );
};

export async function sendSWRRequest<T, P>(
  url: string,
  { arg }: { arg: P } = { arg: {} as P }
): Promise<T> {
  return requester()
    .post<T>(url, {
      data: arg === undefined ? {} : arg,
    })
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}

export async function sendSWRUpdate<T, P>(
  url: string,
  { arg }: { arg: P } = { arg: {} as P }
): Promise<T> {
  return requester()
    .put<T>(url, {
      data: arg === undefined ? {} : arg,
    })
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}

