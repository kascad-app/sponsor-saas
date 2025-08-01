import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";

import {
  loginSponsorDto,
  registerSponsorDto,
  Sponsor,
} from "@kascad-app/shared-types";
import { requester } from "@/src/lib/requester/requester";
import { sendSWRRequest } from "@/src/lib/swr/use-swr";
import { SWR_KEY } from "@/src/shared/constants/SWR_KEY";

export function useMe() {
  return useSWR<Sponsor>(
    SWR_KEY.AUTH.ME,
    () => requester().get<Sponsor>(SWR_KEY.AUTH.ME),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      dedupingInterval: 60000,
    },
  );
}

export function useLogin() {
  return useSWRMutation<Sponsor, Error, string, loginSponsorDto>(
    SWR_KEY.AUTH.LOGIN,
    sendSWRRequest,
    {
      rollbackOnError: true,
      onError() {
        console.log("error in useLogin");
      },
      onSuccess() {
        console.log("success in useLogin");
        mutate(SWR_KEY.AUTH.ME, undefined, true);
      },
    },
  );
}

export function useRegister() {
  return useSWRMutation<Sponsor, Error, string, registerSponsorDto>(
    SWR_KEY.AUTH.REGISTER,
    sendSWRRequest,
    {
      rollbackOnError: true,
      onSuccess() {
        console.log("success in useLogin");
        mutate(SWR_KEY.AUTH.ME, undefined, true);
      },
    },
  );
}

export function useLogout() {
  return useSWRMutation<void, Error, string>(
    SWR_KEY.AUTH.LOGOUT,
    sendSWRRequest,
    {
      optimisticData: () => undefined,
      onSuccess() {
        mutate(SWR_KEY.AUTH.ME, undefined, false);
        mutate(SWR_KEY.AUTH.LOGIN, undefined, false);
        mutate(SWR_KEY.AUTH.REGISTER, undefined, false);
      },
    },
  );
}
