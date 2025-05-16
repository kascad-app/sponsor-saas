import { KeyedMutator } from "swr";

import { Sponsor } from "@kascad-app/shared-types";
export type Session = {
  mutate: KeyedMutator<Sponsor>;
} & (SignedOutSession | SignedInSession);

export type SignedInSession = {
  loggedIn: true;
  user: Sponsor;
  loading: boolean;
  validating: boolean;
};

export type SignedOutSession = {
  loggedIn: false;
  user: undefined;
  loading: boolean;
};
