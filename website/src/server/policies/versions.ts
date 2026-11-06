// Bump a version whenever the policy text changes. Requests record the versions the visitor accepted.
export const POLICY_VERSIONS = {
  // 2026-11-06.2: public downloads, CC BY 4.0 licence and credit, as-is data, no re-identification.
  terms: { version: "2026-11-06.2", effective: "2026-11-06" as string | null },
  privacy: { version: "2026-11-06", effective: "2026-11-06" as string | null },
};

/** Policies must be approved by the publisher before request forms open (POLICY-REQUIREMENTS.md). */
export const POLICIES_APPROVED = POLICY_VERSIONS.terms.effective !== null && POLICY_VERSIONS.privacy.effective !== null;
