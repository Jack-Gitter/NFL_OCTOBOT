import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1760278957485 implements MigrationInterface {
    name = 'Migrations1760278957485'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Donations" ("id" bigint NOT NULL, "money" double precision NOT NULL, "donatorName" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, CONSTRAINT "PK_e33b23e4b84b4cc2ea43a6264fb" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Donations"`);
    }

}
