import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1760277959113 implements MigrationInterface {
    name = 'Migrations1760277959113'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "donation" ("id" integer NOT NULL, "money" double precision NOT NULL, "donatorName" character varying NOT NULL, "donatorAmount" double precision NOT NULL, "timestamp" TIMESTAMP NOT NULL, CONSTRAINT "PK_25fb5a541964bc5cfc18fb13a82" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "donation"`);
    }

}
