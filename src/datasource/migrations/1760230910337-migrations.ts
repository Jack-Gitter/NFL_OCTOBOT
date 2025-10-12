import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1760230910337 implements MigrationInterface {
    name = 'Migrations1760230910337'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scoring_play" DROP CONSTRAINT "PK_ff055cec311534b733a1897a1d8"`);
        await queryRunner.query(`
            ALTER TABLE "scoring_play"
            ALTER COLUMN "id" TYPE VARCHAR USING "id"::VARCHAR
        `);
        await queryRunner.query(`ALTER TABLE "scoring_play" ADD CONSTRAINT "PK_ff055cec311534b733a1897a1d8" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scoring_play" DROP CONSTRAINT "PK_ff055cec311534b733a1897a1d8"`);
        await queryRunner.query(`
            ALTER TABLE "scoring_play"
            ALTER COLUMN "id" TYPE BIGINT USING "id"::BIGINT
        `);
        await queryRunner.query(`ALTER TABLE "scoring_play" ADD CONSTRAINT "PK_ff055cec311534b733a1897a1d8" PRIMARY KEY ("id")`);
    }
}
