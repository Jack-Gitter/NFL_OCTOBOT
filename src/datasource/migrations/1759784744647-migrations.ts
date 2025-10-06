import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1759784744647 implements MigrationInterface {
    name = 'Migrations1759784744647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "play" ("id" integer NOT NULL, CONSTRAINT "PK_78bc0ac5050cc1068217341a73e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "play"`);
    }

}
