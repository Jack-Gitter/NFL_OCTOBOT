import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1760287342286 implements MigrationInterface {
    name = 'Migrations1760287342286'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donations" ADD "donatorId" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donations" DROP COLUMN "donatorId"`);
    }

}
