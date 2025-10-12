import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1760275897408 implements MigrationInterface {
    name = 'Migrations1760275897408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "all_time_donation_count" ("id" integer NOT NULL, "money" integer NOT NULL, CONSTRAINT "PK_5f7d9f5b9fbe3ccf93d839b2614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "monthly_donation_count" ("id" integer NOT NULL, "money" integer NOT NULL, CONSTRAINT "PK_cb5f0cb355078288d62c4a3c57a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "monthly_donation_count"`);
        await queryRunner.query(`DROP TABLE "all_time_donation_count"`);
    }

}
