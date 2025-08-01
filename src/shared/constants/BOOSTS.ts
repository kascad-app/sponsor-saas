export const BOOSTS = {
  GET_BOOSTS: "/offers/dashboard",
  GET_BOOST_BY_ID: "/offers",
  POST_BOOST: "/offers",
  PATCH_BOOST: "/offers/:offerId",
  DELETE_BOOST: "/offers/:offerId",

  ACCEPT_BOOST: "/offers/accept/:offerId/:riderId",
  REJECT_BOOST: "/offers/reject/:offerId/:riderId",

  BOOST_APPLICATION: "/offers/application",
};
