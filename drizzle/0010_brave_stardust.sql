CREATE TABLE IF NOT EXISTS "carts" (
	"cartId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sessionId" text NOT NULL,
	"userId" text,
	"items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastActive" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "carts" ADD CONSTRAINT "carts_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cart_session_idx" ON "carts" USING btree ("sessionId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cart_user_idx" ON "carts" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cart_last_active_idx" ON "carts" USING btree ("lastActive");