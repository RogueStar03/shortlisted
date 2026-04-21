-- Remove payment-related columns from profiles table.
-- Razorpay integration was removed; plan gating is not used in demo mode.
ALTER TABLE "public"."profiles" DROP CONSTRAINT IF EXISTS "profiles_plan_check";
ALTER TABLE "public"."profiles" DROP COLUMN IF EXISTS "plan";
ALTER TABLE "public"."profiles" DROP COLUMN IF EXISTS "plan_expires_at";
ALTER TABLE "public"."profiles" DROP COLUMN IF EXISTS "pack_started_at";
ALTER TABLE "public"."profiles" DROP COLUMN IF EXISTS "razorpay_customer_id";
