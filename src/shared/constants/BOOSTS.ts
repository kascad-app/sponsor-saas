export const BOOSTS = {
  GET_BOOSTS: "/offers/dashboard",
  GET_BOOST_BY_ID: "/offers",
  POST_BOOST: "/offers",
  PATCH_BOOST: "/offers/:offerId",
  DELETE_BOOST: "/offers/:offerId",

  // TODO créer les routes pour créer les custom profil selon une offre
  CREATE_CUSTOM_PROFIL_RIDER: "/offers/:offerId",

  ACCEPT_BOOST: "/offers/accept/:offerId/:riderId",
  REJECT_BOOST: "/offers/reject/:offerId/:riderId",
};
