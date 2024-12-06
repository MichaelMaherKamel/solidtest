CREATE TABLE IF NOT EXISTS "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profileId" text NOT NULL,
	"profileName" text NOT NULL,
	"profileEmail" text NOT NULL,
	"profileAvatarUrl" text,
	"profileRole" text DEFAULT 'user' NOT NULL,
	CONSTRAINT "profiles_profileId_unique" UNIQUE("profileId"),
	CONSTRAINT "profiles_profileEmail_unique" UNIQUE("profileEmail")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "profile_id_idx" ON "profiles" USING btree ("profileId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "profile_email_idx" ON "profiles" USING btree ("profileEmail");