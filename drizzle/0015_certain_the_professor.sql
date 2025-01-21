CREATE TYPE "public"."orderStatus" AS ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."paymentMethod" AS ENUM('cash', 'card');--> statement-breakpoint
CREATE TYPE "public"."paymentStatus" AS ENUM('pending', 'processing', 'completed', 'failed', 'refunded');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"orderId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sessionId" text NOT NULL,
	"userId" text,
	"orderNumber" text NOT NULL,
	"items" jsonb NOT NULL,
	"subtotal" real NOT NULL,
	"shippingCost" real NOT NULL,
	"total" real NOT NULL,
	"orderStatus" "orderStatus" DEFAULT 'pending' NOT NULL,
	"paymentStatus" "paymentStatus" DEFAULT 'pending' NOT NULL,
	"paymentMethod" "paymentMethod" DEFAULT 'cash' NOT NULL,
	"shippingAddress" jsonb NOT NULL,
	"storeSummaries" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"confirmedAt" timestamp,
	"processedAt" timestamp,
	"shippedAt" timestamp,
	"deliveredAt" timestamp,
	"cancelledAt" timestamp,
	"refundedAt" timestamp,
	CONSTRAINT "orders_orderNumber_unique" UNIQUE("orderNumber")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_user_id_idx" ON "orders" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_session_id_idx" ON "orders" USING btree ("sessionId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_number_idx" ON "orders" USING btree ("orderNumber");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_status_idx" ON "orders" USING btree ("orderStatus");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payment_status_idx" ON "orders" USING btree ("paymentStatus");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_created_at_idx" ON "orders" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_order_status_idx" ON "orders" USING btree ("userId","orderStatus","createdAt");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_order_status_idx" ON "orders" USING btree ("sessionId","orderStatus","createdAt");