import {MigrationInterface, QueryRunner} from "typeorm";

export class videos1648376623845 implements MigrationInterface {
    name = 'videos1648376623845'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "videos" DROP CONSTRAINT "FK_009df165edbdd06fa78e3bb1864"`);
        await queryRunner.query(`ALTER TABLE "videos" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "videos" ADD CONSTRAINT "FK_009df165edbdd06fa78e3bb1864" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "videos" DROP CONSTRAINT "FK_009df165edbdd06fa78e3bb1864"`);
        await queryRunner.query(`ALTER TABLE "videos" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "videos" ADD CONSTRAINT "FK_009df165edbdd06fa78e3bb1864" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
