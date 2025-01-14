CREATE TYPE "public"."city" AS ENUM('Cairo');--> statement-breakpoint
CREATE TYPE "public"."country" AS ENUM('Egypt');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "addresses" (
	"addressId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sessionId" text NOT NULL,
	"userId" varchar(255),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"address" text NOT NULL,
	"buildingNumber" integer NOT NULL,
	"flatNumber" integer NOT NULL,
	"city" "city" DEFAULT 'Cairo' NOT NULL,
	"district" varchar(255) NOT NULL,
	"postalCode" integer,
	"country" "country" DEFAULT 'Egypt' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "address_user_id_idx" ON "addresses" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "address_session_id_idx" ON "addresses" USING btree ("sessionId");