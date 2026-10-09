DROP INDEX "posts_user_id_created_at_idx";--> statement-breakpoint
CREATE INDEX "posts_user_id_id_idx" ON "posts" USING btree ("user_id","id");