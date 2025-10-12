import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1760276348584 implements MigrationInterface {
    name = 'Migrations1760276348584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "monthly_donation_count" ADD "topDonatorName" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "monthly_donation_count" DROP COLUMN "topDonatorName"`);
    }

}
