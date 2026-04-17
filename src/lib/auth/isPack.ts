export interface PackProfile {
  plan: string | null;
  plan_expires_at: string | null;
}

/**
 * Returns true only when plan is "pack" AND plan_expires_at is non-null AND in the future.
 * Null expiry is never treated as "forever valid" (project hard rule).
 */
export function isPack(profile: PackProfile | null | undefined): boolean {
  if (!profile) return false;
  if (profile.plan !== 'pack') return false;
  if (!profile.plan_expires_at) return false;
  return new Date(profile.plan_expires_at) > new Date();
}
