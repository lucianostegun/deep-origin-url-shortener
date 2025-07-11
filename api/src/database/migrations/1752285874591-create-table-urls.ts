import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableUrls1752285874591 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'urls',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'public_id',
            type: 'varchar',
            length: '26',
            isUnique: true,
          },
          {
            name: 'original_url',
            type: 'text',
          },
          {
            name: 'slug',
            type: 'varchar',
            length: '32',
            isUnique: true,
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'click_count',
            type: 'int',
            default: 0,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        indices: [
          {
            name: 'IDX_URLS_PUBLIC_ID',
            columnNames: ['public_id'],
          },
          {
            name: 'IDX_URLS_SLUG',
            columnNames: ['slug'],
          },
          {
            name: 'IDX_URLS_CREATED_AT',
            columnNames: ['created_at'],
          },
          {
            name: 'IDX_URLS_USER_ID',
            columnNames: ['user_id'],
          },
        ],
        foreignKeys: [
          {
            name: 'FK_URLS_USER_ID',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('urls');
  }
}
