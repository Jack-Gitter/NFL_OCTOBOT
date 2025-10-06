import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1759786272039 implements MigrationInterface {
    name = 'Migrations1759786272039'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "scoring_play" ("id" bigint NOT NULL, CONSTRAINT "PK_ff055cec311534b733a1897a1d8" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "scoring_play"`);
    }

}
