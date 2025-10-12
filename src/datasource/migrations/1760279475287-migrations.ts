import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1760279475287 implements MigrationInterface {
    name = 'Migrations1760279475287'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "donations" ("id" bigint NOT NULL, "money" double precision NOT NULL, "donatorName" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, CONSTRAINT "PK_c01355d6f6f50fc6d1b4a946abf" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "donations"`);
    }

}
