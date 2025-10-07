import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1759842320859 implements MigrationInterface {
    name = 'Migrations1759842320859'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "scoring_play" ("id" bigint NOT NULL, CONSTRAINT "PK_ff055cec311534b733a1897a1d8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "octopus_count" ("id" integer NOT NULL, "count" bigint NOT NULL, CONSTRAINT "PK_d9e6ba3779603a657ca987fd2f5" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "octopus_count"`);
        await queryRunner.query(`DROP TABLE "scoring_play"`);
    }

}
