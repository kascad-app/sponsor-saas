import useSWR from "swr";
import { requester } from "@/src/lib/requester/requester";
import { Rider } from "@kascad-app/shared-types";
import { SCOUTING } from "@/src/shared/constants/SCOUTING";
import { RIDERS_KEY } from "@/src/shared/constants/RIDERS";

// get all riders
export function useGetRiders() {
  const key = SCOUTING.SEARCH_RIDERS;
  return useSWR<Rider[]>(key, async () => {
    const response = await requester().post<Rider[]>(key!, {
      data: {},
    });
    return response;
  });
}

// get rider by id
export function useGetRiderBySlug(slug: string) {
  const key = slug ? `${RIDERS_KEY.ALL_RIDERS}/${slug}` : null;
  return useSWR<Rider>(key, async () => {
    const rider = await requester().get<Rider>(key!);
    return rider;
  });
}
