import {MigrationInterface, QueryRunner} from "typeorm";

export class rooms1648134462236 implements MigrationInterface {
    name = 'rooms1648134462236'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" ADD "public" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "public"`);
    }

}
