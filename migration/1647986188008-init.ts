import {MigrationInterface, QueryRunner} from "typeorm";

export class init1647986188008 implements MigrationInterface {
    name = 'init1647986188008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permission" ("id" integer NOT NULL, "play_pause" boolean NOT NULL, "seek" boolean NOT NULL, "playback_speed" boolean NOT NULL, "add_video" boolean NOT NULL, "skip_video" boolean NOT NULL, "remove_video" boolean NOT NULL, "chat" boolean NOT NULL, "video_chat" boolean NOT NULL, "change_role" boolean NOT NULL, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."video_type_enum" AS ENUM('youtube', 'vimeo', 'twitch', 'facebook', 'direct')`);
        await queryRunner.query(`CREATE TABLE "video" ("id" SERIAL NOT NULL, "type" "public"."video_type_enum" NOT NULL, "link" character varying NOT NULL, "position" integer NOT NULL, "played" boolean NOT NULL, "userId" integer, "roomId" uuid, CONSTRAINT "PK_1a2f3856250765d72e7e1636c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room" ("id" uuid NOT NULL, "name" character varying NOT NULL, "ownerId" integer, CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."role_role_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "role" ("role" "public"."role_role_enum" NOT NULL DEFAULT '2', "userId" integer NOT NULL, "roomId" uuid NOT NULL, CONSTRAINT "PK_34572ea33e1ad5750057530aeac" PRIMARY KEY ("userId", "roomId"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, "userId" integer, "roomId" uuid, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "video" ADD CONSTRAINT "FK_74e27b13f8ac66f999400df12f6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "video" ADD CONSTRAINT "FK_3a3f36205c87d35ffd6eafbf553" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room" ADD CONSTRAINT "FK_65283be59094a73fed31ffeee4e" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "FK_3e02d32dd4707c91433de0390ea" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "FK_c0424a0cfb3fa2353d885ad25a0" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_fdfe54a21d1542c564384b74d5c" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_fdfe54a21d1542c564384b74d5c"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_446251f8ceb2132af01b68eb593"`);
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_c0424a0cfb3fa2353d885ad25a0"`);
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_3e02d32dd4707c91433de0390ea"`);
        await queryRunner.query(`ALTER TABLE "room" DROP CONSTRAINT "FK_65283be59094a73fed31ffeee4e"`);
        await queryRunner.query(`ALTER TABLE "video" DROP CONSTRAINT "FK_3a3f36205c87d35ffd6eafbf553"`);
        await queryRunner.query(`ALTER TABLE "video" DROP CONSTRAINT "FK_74e27b13f8ac66f999400df12f6"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TYPE "public"."role_role_enum"`);
        await queryRunner.query(`DROP TABLE "room"`);
        await queryRunner.query(`DROP TABLE "video"`);
        await queryRunner.query(`DROP TYPE "public"."video_type_enum"`);
        await queryRunner.query(`DROP TABLE "permission"`);
    }

}
