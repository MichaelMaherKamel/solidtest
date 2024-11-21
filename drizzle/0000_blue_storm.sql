CREATE TABLE IF NOT EXISTS "products" (
	"productId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"productName" text NOT NULL,
	"productDescription" text NOT NULL,
	"category" text DEFAULT 'kitchensupplies' NOT NULL,
	"price" real NOT NULL,
	"storeId" uuid NOT NULL,
	"colorVariants" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stores" (
	"storeId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"storeName" text NOT NULL,
	"storeImage" text,
	"storePhone" text,
	"storeAddress" text,
	"featured" text DEFAULT 'no' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_storeId_stores_storeId_fk" FOREIGN KEY ("storeId") REFERENCES "public"."stores"("storeId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
