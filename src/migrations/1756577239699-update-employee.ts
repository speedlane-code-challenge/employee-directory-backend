import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEmployee1756577239699 implements MigrationInterface {
    name = 'UpdateEmployee1756577239699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee\` DROP COLUMN \`gender\``);
        await queryRunner.query(`ALTER TABLE \`employee\` ADD \`gender\` enum ('Male', 'Female') NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee\` DROP COLUMN \`gender\``);
        await queryRunner.query(`ALTER TABLE \`employee\` ADD \`gender\` varchar(255) NOT NULL`);
    }

}
