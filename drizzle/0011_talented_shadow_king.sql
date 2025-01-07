ALTER TABLE "carts" DROP CONSTRAINT "carts_userId_user_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "cart_user_idx";--> statement-breakpoint
ALTER TABLE "carts" DROP COLUMN IF EXISTS "userId";