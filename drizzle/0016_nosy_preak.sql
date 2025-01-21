ALTER TABLE "products" ADD COLUMN "storeName" text NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_store_name_idx" ON "products" USING btree ("storeName");