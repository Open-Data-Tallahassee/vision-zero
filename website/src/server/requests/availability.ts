import "server-only";
import { pathways } from "@/config/pathways";
import { POLICIES_APPROVED } from "@/server/policies/versions";

/** A request form only opens when it has an operator (flag), somewhere to store requests, and approved policies. */
export const requestsOpen = {
  city: () => pathways.cityRequests && !!process.env.DATABASE_URL && POLICIES_APPROVED,
  data: () => pathways.dataRequests && !!process.env.DATABASE_URL && POLICIES_APPROVED,
};
