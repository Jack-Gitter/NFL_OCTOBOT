import { MigrationInterface, QueryRunner } from "typeorm";

export class ConvertIdToStringMigration implements MigrationInterface {
    name = 'ConvertIdToStringMigration'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // octopus_count
        await queryRunner.query(`ALTER TABLE "octopus_count" DROP CONSTRAINT "PK_d9e6ba3779603a657ca987fd2f5"`);
        await queryRunner.query(`
            ALTER TABLE "octopus_count"
            ALTER COLUMN "id" TYPE VARCHAR USING "id"::VARCHAR
        `);
        await queryRunner.query(`ALTER TABLE "octopus_count" ADD CONSTRAINT "PK_d9e6ba3779603a657ca987fd2f5" PRIMARY KEY ("id")`);

        // player_octopus_count
        await queryRunner.query(`ALTER TABLE "player_octopus_count" DROP CONSTRAINT "PK_1473f394caaf90dd56dca9d61e5"`);
        await queryRunner.query(`
            ALTER TABLE "player_octopus_count"
            ALTER COLUMN "id" TYPE VARCHAR USING "id"::VARCHAR
        `);
        await queryRunner.query(`ALTER TABLE "player_octopus_count" ADD CONSTRAINT "PK_1473f394caaf90dd56dca9d61e5" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert octopus_count
        await queryRunner.query(`ALTER TABLE "octopus_count" DROP CONSTRAINT "PK_d9e6ba3779603a657ca987fd2f5"`);
        await queryRunner.query(`
            ALTER TABLE "octopus_count"
            ALTER COLUMN "id" TYPE INTEGER USING "id"::INTEGER
        `);
        await queryRunner.query(`ALTER TABLE "octopus_count" ADD CONSTRAINT "PK_d9e6ba3779603a657ca987fd2f5" PRIMARY KEY ("id")`);

        // Revert player_octopus_count
        await queryRunner.query(`ALTER TABLE "player_octopus_count" DROP CONSTRAINT "PK_1473f394caaf90dd56dca9d61e5"`);
        await queryRunner.query(`
            ALTER TABLE "player_octopus_count"
            ALTER COLUMN "id" TYPE BIGINT USING "id"::BIGINT
        `);
        await queryRunner.query(`ALTER TABLE "player_octopus_count" ADD CONSTRAINT "PK_1473f394caaf90dd56dca9d61e5" PRIMARY KEY ("id")`);
    }
}
