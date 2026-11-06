import "server-only";

// Each community pathway stays off until someone is named to operate it (see IMPLEMENTATION-CHECKLIST.md, 7.8).
export const pathways = {
  cityRequests: process.env.ENABLE_CITY_REQUESTS === "true",
  dataRequests: process.env.ENABLE_DATA_REQUESTS === "true",
  donationUrl: process.env.DONATION_URL?.startsWith("https://") ? process.env.DONATION_URL : null,
};
