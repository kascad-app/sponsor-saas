import useSWR, { SWRConfiguration } from "swr";
import { requester } from "../libs/requester/requester";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useAPI = <T = any>(
  path: string | null,
  options?: SWRConfiguration
) => {
  const fetcher = () => requester().get<T>(path!);

  return useSWR(path, fetcher, options);
};
