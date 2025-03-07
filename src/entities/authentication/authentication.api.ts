import { requester } from "@/src/shared/libs/requester/requester";
import {
  loginSponsorDto,
  registerSponsorDto,
  Sponsor,
} from "@kascad-app/shared-types";

import Cookies from "js-cookie";

type APIAuthentication = {
  me: typeof me;
  login: typeof login;
  register: typeof register;
  refreshToken: typeof refreshToken;
  logout: typeof logout;
};

const BASE_URL = "/auth";

const me = async () => requester().get<Sponsor>(`${BASE_URL}/me`);

const login = async (data: loginSponsorDto) =>
  requester().post<Sponsor>(`${BASE_URL}/login`, { data });

const register = async (data: registerSponsorDto) =>
  requester().post<Sponsor>("/auth/register", {
    data,
  });

const refreshToken = async () =>
  requester().post<Sponsor>("/auth/refresh-token");

const logout = async () => {
  requester().post("/auth/logout", { data: {} });
  Cookies.remove("authToken");
};

export { me, login, register, refreshToken, logout };

export type { APIAuthentication };
