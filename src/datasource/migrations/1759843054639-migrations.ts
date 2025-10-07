import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1759843054639 implements MigrationInterface {
    name = 'Migrations1759843054639'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "player_octopus_count" ("id" bigint NOT NULL, "octopusCount" bigint NOT NULL, CONSTRAINT "PK_1473f394caaf90dd56dca9d61e5" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "player_octopus_count"`);
    }

}
