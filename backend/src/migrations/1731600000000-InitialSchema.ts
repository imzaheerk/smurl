import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from 'typeorm';

/** Add FK only if it does not already exist (idempotent for DBs created by synchronize). */
async function createForeignKeyIfNotExists(
  queryRunner: QueryRunner,
  tableName: string,
  fk: TableForeignKey
): Promise<void> {
  const table = await queryRunner.getTable(tableName);
  if (!table) return;
  const exists = table.foreignKeys.some(
    (existing) =>
      existing.columnNames.length === fk.columnNames.length &&
      fk.columnNames.every((col) => existing.columnNames.includes(col))
  );
  if (!exists) {
    await queryRunner.createForeignKey(tableName, fk);
  }
}

export class InitialSchema1731600000000 implements MigrationInterface {
  name = 'InitialSchema1731600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()'
          },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'password', type: 'varchar' },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' }
        ]
      }),
      true
    );

    await queryRunner.createTable(
      new Table({
        name: 'folder',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()'
          },
          { name: 'userId', type: 'uuid' },
          { name: 'name', type: 'varchar' },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' }
        ]
      }),
      true
    );

    await queryRunner.createTable(
      new Table({
        name: 'url',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()'
          },
          { name: 'shortCode', type: 'varchar', isUnique: true },
          { name: 'originalUrl', type: 'varchar' },
          { name: 'clickCount', type: 'int', default: 0 },
          { name: 'customAlias', type: 'varchar', isNullable: true },
          { name: 'expiresAt', type: 'timestamp', isNullable: true },
          { name: 'activeFrom', type: 'timestamp', isNullable: true },
          { name: 'activeTo', type: 'timestamp', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'userId', type: 'uuid', isNullable: true },
          { name: 'folderId', type: 'uuid', isNullable: true }
        ]
      }),
      true
    );

    await queryRunner.createTable(
      new Table({
        name: 'analytics',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()'
          },
          { name: 'urlId', type: 'uuid' },
          { name: 'ipAddress', type: 'varchar', isNullable: true },
          { name: 'userAgent', type: 'varchar', isNullable: true },
          { name: 'referrer', type: 'varchar', isNullable: true },
          { name: 'country', type: 'varchar', isNullable: true },
          { name: 'browser', type: 'varchar', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' }
        ]
      }),
      true
    );

    await queryRunner.createTable(
      new Table({
        name: 'api_key',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()'
          },
          { name: 'userId', type: 'uuid' },
          { name: 'keyHash', type: 'varchar' },
          { name: 'keyPrefix', type: 'varchar' },
          { name: 'name', type: 'varchar', length: '100' },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' }
        ]
      }),
      true
    );

    await queryRunner.createTable(
      new Table({
        name: 'custom_domain',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()'
          },
          { name: 'userId', type: 'uuid' },
          { name: 'domain', type: 'varchar', isUnique: true },
          { name: 'verified', type: 'boolean', default: false },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' }
        ]
      }),
      true
    );

    await createForeignKeyIfNotExists(
      queryRunner,
      'folder',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );

    await createForeignKeyIfNotExists(
      queryRunner,
      'url',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );

    await createForeignKeyIfNotExists(
      queryRunner,
      'url',
      new TableForeignKey({
        columnNames: ['folderId'],
        referencedTableName: 'folder',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL'
      })
    );

    await createForeignKeyIfNotExists(
      queryRunner,
      'analytics',
      new TableForeignKey({
        columnNames: ['urlId'],
        referencedTableName: 'url',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );

    await createForeignKeyIfNotExists(
      queryRunner,
      'api_key',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );

    await createForeignKeyIfNotExists(
      queryRunner,
      'custom_domain',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const urlTable = await queryRunner.getTable('url');
    if (urlTable) {
      const userIdFk = urlTable.foreignKeys.find((fk) => fk.columnNames.indexOf('userId') !== -1);
      const folderIdFk = urlTable.foreignKeys.find((fk) => fk.columnNames.indexOf('folderId') !== -1);
      if (userIdFk) await queryRunner.dropForeignKey('url', userIdFk);
      if (folderIdFk) await queryRunner.dropForeignKey('url', folderIdFk);
    }

    const folderTable = await queryRunner.getTable('folder');
    if (folderTable) {
      const fk = folderTable.foreignKeys.find((fk) => fk.columnNames.indexOf('userId') !== -1);
      if (fk) await queryRunner.dropForeignKey('folder', fk);
    }

    const analyticsTable = await queryRunner.getTable('analytics');
    if (analyticsTable) {
      const fk = analyticsTable.foreignKeys.find((fk) => fk.columnNames.indexOf('urlId') !== -1);
      if (fk) await queryRunner.dropForeignKey('analytics', fk);
    }

    const apiKeyTable = await queryRunner.getTable('api_key');
    if (apiKeyTable) {
      const fk = apiKeyTable.foreignKeys.find((fk) => fk.columnNames.indexOf('userId') !== -1);
      if (fk) await queryRunner.dropForeignKey('api_key', fk);
    }

    const customDomainTable = await queryRunner.getTable('custom_domain');
    if (customDomainTable) {
      const fk = customDomainTable.foreignKeys.find((fk) => fk.columnNames.indexOf('userId') !== -1);
      if (fk) await queryRunner.dropForeignKey('custom_domain', fk);
    }

    await queryRunner.dropTable('analytics', true);
    await queryRunner.dropTable('url', true);
    await queryRunner.dropTable('api_key', true);
    await queryRunner.dropTable('custom_domain', true);
    await queryRunner.dropTable('folder', true);
    await queryRunner.dropTable('user', true);
  }
}
