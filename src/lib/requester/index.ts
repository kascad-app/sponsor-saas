import { requester } from "./requester";

const fetcher = async (
  url: string,
  options?: FetcherOptions
): Promise<Sponsor> => {
  if (options?.method === "POST") {
    const response = await requester().post<Sponsor>(url, {
      data: options.data,
    });
    return response;
  }
  const response = await requester().get<Sponsor>(url);
  return response;
};
