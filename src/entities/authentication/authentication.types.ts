import { KeyedMutator } from "swr";

import { APIResponse, Sponsor } from "@kascad-app/shared-types";
export type Session = {
  mutate: KeyedMutator<APIResponse<Sponsor>>;
} & (SignedOutSession | SignedInSession);

export type SignedInSession = {
  loggedIn: true;
  user: Sponsor;
  loading: boolean;
  validating: boolean;
  signOut: () => Promise<void>;
};

export type SignedOutSession = {
  loggedIn: false;
  user: undefined;
  loading: boolean;
};
