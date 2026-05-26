import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialSchema1710000000000 implements MigrationInterface {
  name = "CreateInitialSchema1710000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "user_status_enum" AS ENUM ('active', 'pending_deletion', 'deleted', 'suspended')`
    );
    await queryRunner.query(`CREATE TYPE "weight_unit_enum" AS ENUM ('kg', 'lb')`);
    await queryRunner.query(`CREATE TYPE "app_theme_enum" AS ENUM ('system', 'light', 'dark')`);
    await queryRunner.query(
      `CREATE TYPE "ai_tone_enum" AS ENUM ('gentle', 'celebration', 'comfort', 'reset')`
    );
    await queryRunner.query(
      `CREATE TYPE "mood_enum" AS ENUM ('happy', 'calm', 'tired', 'anxious', 'neutral')`
    );
    await queryRunner.query(`CREATE TYPE "record_source_enum" AS ENUM ('manual', 'imported')`);
    await queryRunner.query(
      `CREATE TYPE "account_deletion_status_enum" AS ENUM ('requested', 'processing', 'completed', 'cancelled')`
    );

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "email" varchar(255) NOT NULL,
        "email_normalized" varchar(255) NOT NULL,
        "password_hash" varchar(255) NOT NULL,
        "status" "user_status_enum" NOT NULL DEFAULT 'active',
        "email_verified_at" timestamptz,
        "last_login_at" timestamptz,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz,
        CONSTRAINT "pk_users" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "idx_users_status" ON "users" ("status")`);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "uniq_users_email_normalized_active"
      ON "users" ("email_normalized")
      WHERE "deleted_at" IS NULL
    `);

    await queryRunner.query(`
      CREATE TABLE "user_profiles" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "nickname" varchar(40),
        "avatar_url" varchar(500),
        "height_cm" numeric(5,2),
        "initial_weight_kg" numeric(5,2),
        "target_weight_kg" numeric(5,2),
        "onboarding_completed" boolean NOT NULL DEFAULT false,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz,
        CONSTRAINT "pk_user_profiles" PRIMARY KEY ("id"),
        CONSTRAINT "uniq_user_profiles_user_id" UNIQUE ("user_id"),
        CONSTRAINT "fk_user_profiles_user_id"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "user_settings" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "weight_unit" "weight_unit_enum" NOT NULL DEFAULT 'kg',
        "reminder_enabled" boolean NOT NULL DEFAULT true,
        "reminder_time" time,
        "timezone" varchar(80) NOT NULL DEFAULT 'Asia/Shanghai',
        "theme" "app_theme_enum" NOT NULL DEFAULT 'system',
        "ai_tone_preference" "ai_tone_enum" NOT NULL DEFAULT 'gentle',
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz,
        CONSTRAINT "pk_user_settings" PRIMARY KEY ("id"),
        CONSTRAINT "uniq_user_settings_user_id" UNIQUE ("user_id"),
        CONSTRAINT "fk_user_settings_user_id"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "weight_records" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "weight_kg" numeric(5,2) NOT NULL,
        "local_date" date NOT NULL,
        "timezone" varchar(80) NOT NULL,
        "mood" "mood_enum",
        "note" text,
        "source" "record_source_enum" NOT NULL DEFAULT 'manual',
        "recorded_at" timestamptz NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz,
        CONSTRAINT "pk_weight_records" PRIMARY KEY ("id"),
        CONSTRAINT "fk_weight_records_user_id"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "uniq_weight_records_user_local_date_active"
      ON "weight_records" ("user_id", "local_date")
      WHERE "deleted_at" IS NULL
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_weight_records_user_local_date_desc"
      ON "weight_records" ("user_id", "local_date" DESC)
      WHERE "deleted_at" IS NULL
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_weight_records_user_recorded_at_desc"
      ON "weight_records" ("user_id", "recorded_at" DESC)
      WHERE "deleted_at" IS NULL
    `);

    await queryRunner.query(`
      CREATE TABLE "ai_encouragements" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "weight_record_id" uuid NOT NULL,
        "title" varchar(80) NOT NULL,
        "message" text NOT NULL,
        "tone" "ai_tone_enum" NOT NULL DEFAULT 'gentle',
        "tags" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "model" varchar(80) NOT NULL,
        "prompt_version" varchar(40) NOT NULL,
        "input_snapshot" jsonb,
        "raw_output" jsonb,
        "generated_at" timestamptz NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz,
        CONSTRAINT "pk_ai_encouragements" PRIMARY KEY ("id"),
        CONSTRAINT "fk_ai_encouragements_user_id"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_ai_encouragements_weight_record_id"
          FOREIGN KEY ("weight_record_id") REFERENCES "weight_records"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_ai_encouragements_user_created_at"
      ON "ai_encouragements" ("user_id", "created_at" DESC)
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "uniq_ai_encouragements_weight_record_active"
      ON "ai_encouragements" ("weight_record_id")
      WHERE "deleted_at" IS NULL
    `);

    await queryRunner.query(`
      CREATE TABLE "refresh_tokens" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "token_hash" varchar(255) NOT NULL,
        "token_family" varchar(80),
        "device_name" varchar(120),
        "expires_at" timestamptz NOT NULL,
        "revoked_at" timestamptz,
        "last_used_at" timestamptz,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz,
        CONSTRAINT "pk_refresh_tokens" PRIMARY KEY ("id"),
        CONSTRAINT "fk_refresh_tokens_user_id"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "idx_refresh_tokens_user_id" ON "refresh_tokens" ("user_id")`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uniq_refresh_tokens_token_hash" ON "refresh_tokens" ("token_hash")`
    );

    await queryRunner.query(`
      CREATE TABLE "account_deletion_requests" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "status" "account_deletion_status_enum" NOT NULL DEFAULT 'requested',
        "reason" text,
        "requested_at" timestamptz NOT NULL,
        "scheduled_delete_at" timestamptz,
        "completed_at" timestamptz,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz,
        CONSTRAINT "pk_account_deletion_requests" PRIMARY KEY ("id"),
        CONSTRAINT "fk_account_deletion_requests_user_id"
          FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_account_deletion_requests_user_status"
      ON "account_deletion_requests" ("user_id", "status")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_account_deletion_requests_user_status"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "account_deletion_requests"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "uniq_refresh_tokens_token_hash"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_refresh_tokens_user_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "refresh_tokens"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "uniq_ai_encouragements_weight_record_active"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_ai_encouragements_user_created_at"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "ai_encouragements"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_weight_records_user_recorded_at_desc"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_weight_records_user_local_date_desc"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "uniq_weight_records_user_local_date_active"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "weight_records"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_settings"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_profiles"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "uniq_users_email_normalized_active"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_status"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "account_deletion_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "record_source_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "mood_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "ai_tone_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "app_theme_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "weight_unit_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "user_status_enum"`);
  }
}
