import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1760280030894 implements MigrationInterface {
    name = 'Migrations1760280030894'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
                                drop table donation; 
                                drop table monthly_donation_count;
                                drop table all_time_donation_count;
                                drop table "Donations"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(``);
    }

}
