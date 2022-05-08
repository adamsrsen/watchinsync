import {MigrationInterface, QueryRunner} from "typeorm";

export class chat1652015153214 implements MigrationInterface {
    name = 'chat1652015153214'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "FK_c8db5603420d119933bbc5c398c"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "FK_8d970615662f8a9b63c76d622a2"`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "adminPermissionsId" integer`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "UQ_a05b2b94a7ebd6b17fba359398a" UNIQUE ("adminPermissionsId")`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "moderatorPermissionsId" integer`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "UQ_8a2e91a4449874762b00b04fc79" UNIQUE ("moderatorPermissionsId")`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "memberPermissionsId" integer`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "UQ_44231b4ff712525d2a7cd91850f" UNIQUE ("memberPermissionsId")`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "permissions_id_seq" OWNED BY "permissions"."id"`);
        await queryRunner.query(`ALTER TABLE "permissions" ALTER COLUMN "id" SET DEFAULT nextval('"permissions_id_seq"')`);
        await queryRunner.query(`ALTER TYPE "public"."roles_role_enum" RENAME TO "roles_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."roles_role_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "role" TYPE "public"."roles_role_enum" USING "role"::"text"::"public"."roles_role_enum"`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "role" SET DEFAULT '3'`);
        await queryRunner.query(`DROP TYPE "public"."roles_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "timestamp"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_a05b2b94a7ebd6b17fba359398a" FOREIGN KEY ("adminPermissionsId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_8a2e91a4449874762b00b04fc79" FOREIGN KEY ("moderatorPermissionsId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_44231b4ff712525d2a7cd91850f" FOREIGN KEY ("memberPermissionsId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "FK_c8db5603420d119933bbc5c398c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "FK_8d970615662f8a9b63c76d622a2" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "FK_8d970615662f8a9b63c76d622a2"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "FK_c8db5603420d119933bbc5c398c"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_44231b4ff712525d2a7cd91850f"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_8a2e91a4449874762b00b04fc79"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_a05b2b94a7ebd6b17fba359398a"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "timestamp"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "timestamp" TIMESTAMP NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."roles_role_enum_old" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "role" TYPE "public"."roles_role_enum_old" USING "role"::"text"::"public"."roles_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "role" SET DEFAULT '2'`);
        await queryRunner.query(`DROP TYPE "public"."roles_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."roles_role_enum_old" RENAME TO "roles_role_enum"`);
        await queryRunner.query(`ALTER TABLE "permissions" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "permissions_id_seq"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "UQ_44231b4ff712525d2a7cd91850f"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "memberPermissionsId"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "UQ_8a2e91a4449874762b00b04fc79"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "moderatorPermissionsId"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "UQ_a05b2b94a7ebd6b17fba359398a"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "adminPermissionsId"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "FK_8d970615662f8a9b63c76d622a2" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "FK_c8db5603420d119933bbc5c398c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
