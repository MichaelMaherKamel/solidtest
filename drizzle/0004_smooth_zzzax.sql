ALTER TABLE "stores" ADD COLUMN "userId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "subscription" text DEFAULT 'basic' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stores" ADD CONSTRAINT "stores_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "store_user_id_idx" ON "stores" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "store_featured_created_idx" ON "stores" USING btree ("featured","createdAt");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "store_name_idx" ON "stores" USING btree ("storeName");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "store_image_idx" ON "stores" USING btree ("storeImage");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "store_subscription_idx" ON "stores" USING btree ("subscription");