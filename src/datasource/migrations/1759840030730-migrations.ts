import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1759840030730 implements MigrationInterface {
    name = 'Migrations1759840030730'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "octopus_count" ("count" bigint NOT NULL, CONSTRAINT "PK_59c675b19535105354a5743701f" PRIMARY KEY ("count"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "octopus_count"`);
    }

}
