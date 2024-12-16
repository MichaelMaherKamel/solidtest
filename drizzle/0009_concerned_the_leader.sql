ALTER TABLE "products" ADD COLUMN "totalInventory" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "searchVector" text;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_name_idx" ON "products" USING btree ("productName");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "category_idx" ON "products" USING btree ("category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_store_id_idx" ON "products" USING btree ("storeId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "price_idx" ON "products" USING btree ("price");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "created_at_idx" ON "products" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "category_store_idx" ON "products" USING btree ("category","storeId","createdAt");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "inventory_idx" ON "products" USING btree ("totalInventory");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "color_variants_gin_idx" ON "products" USING btree ("colorVariants");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "search_vector_idx" ON "products" USING btree ("searchVector");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "category_filter_idx" ON "products" USING btree ("category","totalInventory","price");