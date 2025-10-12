import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1760277622939 implements MigrationInterface {
    name = 'Migrations1760277622939'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "all_time_donation_count" ADD "topDonatorName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "all_time_donation_count" ADD "topDonatorAmount" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "monthly_donation_count" ADD "topDonatorAmount" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "all_time_donation_count" DROP COLUMN "money"`);
        await queryRunner.query(`ALTER TABLE "all_time_donation_count" ADD "money" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "monthly_donation_count" DROP COLUMN "money"`);
        await queryRunner.query(`ALTER TABLE "monthly_donation_count" ADD "money" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "monthly_donation_count" DROP COLUMN "money"`);
        await queryRunner.query(`ALTER TABLE "monthly_donation_count" ADD "money" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "all_time_donation_count" DROP COLUMN "money"`);
        await queryRunner.query(`ALTER TABLE "all_time_donation_count" ADD "money" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "monthly_donation_count" DROP COLUMN "topDonatorAmount"`);
        await queryRunner.query(`ALTER TABLE "all_time_donation_count" DROP COLUMN "topDonatorAmount"`);
        await queryRunner.query(`ALTER TABLE "all_time_donation_count" DROP COLUMN "topDonatorName"`);
    }

}
