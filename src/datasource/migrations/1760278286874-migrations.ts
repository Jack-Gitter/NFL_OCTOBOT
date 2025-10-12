import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1760278286874 implements MigrationInterface {
    name = 'Migrations1760278286874'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donation" DROP COLUMN "donatorAmount"`);
        await queryRunner.query(`ALTER TABLE "donation" DROP CONSTRAINT "PK_25fb5a541964bc5cfc18fb13a82"`);
        await queryRunner.query(`ALTER TABLE "donation" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "donation" ADD "id" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "donation" ADD CONSTRAINT "PK_25fb5a541964bc5cfc18fb13a82" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donation" DROP CONSTRAINT "PK_25fb5a541964bc5cfc18fb13a82"`);
        await queryRunner.query(`ALTER TABLE "donation" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "donation" ADD "id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "donation" ADD CONSTRAINT "PK_25fb5a541964bc5cfc18fb13a82" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "donation" ADD "donatorAmount" double precision NOT NULL`);
    }

}
