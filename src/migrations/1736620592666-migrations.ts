import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1736620592666 implements MigrationInterface {
  name = 'Migrations1736620592666';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "location" ("id" SERIAL NOT NULL, "city" character varying NOT NULL, CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_locations" ("user_id" integer NOT NULL, "location_id" integer NOT NULL, CONSTRAINT "PK_aac5bef9251764c6f9efc0bab40" PRIMARY KEY ("user_id", "location_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_437edca703095b237b5bdb35e2" ON "user_locations" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3f495c9a559977dbbc1901a143" ON "user_locations" ("location_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user_locations" ADD CONSTRAINT "FK_437edca703095b237b5bdb35e22" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_locations" ADD CONSTRAINT "FK_3f495c9a559977dbbc1901a143e" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_locations" DROP CONSTRAINT "FK_3f495c9a559977dbbc1901a143e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_locations" DROP CONSTRAINT "FK_437edca703095b237b5bdb35e22"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3f495c9a559977dbbc1901a143"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_437edca703095b237b5bdb35e2"`,
    );
    await queryRunner.query(`DROP TABLE "user_locations"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "location"`);
  }
}
