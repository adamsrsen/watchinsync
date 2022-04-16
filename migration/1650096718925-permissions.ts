import {MigrationInterface, QueryRunner} from "typeorm";

export class permissions1650096718925 implements MigrationInterface {
    name = 'permissions1650096718925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_a05b2b94a7ebd6b17fba359398a"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_44231b4ff712525d2a7cd91850f"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "permissions_id_seq" OWNED BY "permissions"."id"`);
        await queryRunner.query(`ALTER TABLE "permissions" ALTER COLUMN "id" SET DEFAULT nextval('"permissions_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_a05b2b94a7ebd6b17fba359398a" FOREIGN KEY ("adminPermissionsId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_8a2e91a4449874762b00b04fc79" FOREIGN KEY ("moderatorPermissionsId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_44231b4ff712525d2a7cd91850f" FOREIGN KEY ("memberPermissionsId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_44231b4ff712525d2a7cd91850f"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_8a2e91a4449874762b00b04fc79"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_a05b2b94a7ebd6b17fba359398a"`);
        await queryRunner.query(`ALTER TABLE "permissions" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "permissions_id_seq"`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_44231b4ff712525d2a7cd91850f" FOREIGN KEY ("memberPermissionsId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_a05b2b94a7ebd6b17fba359398a" FOREIGN KEY ("adminPermissionsId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
