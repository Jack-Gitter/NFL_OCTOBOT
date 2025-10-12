import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1760280030893 implements MigrationInterface {
    name = 'Migrations1760280030893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donations" RENAME COLUMN "donatorName" TO "donator_name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donations" RENAME COLUMN "donator_name" TO "donatorName"`);
    }

}
