/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle as drizzleMysql } from 'drizzle-orm/mysql2';
import { drizzle as drizzlePostgres } from 'drizzle-orm/node-postgres';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import { createPool as createMysqlPool } from 'mysql2/promise';
import { Pool } from 'pg';
import Database from 'better-sqlite3';
import { createDatabaseConfig } from './database.config';

export const DATABASE_CONFIG = Symbol('DATABASE_CONFIG');
export const DRIZZLE_DB = Symbol('DRIZZLE_DB');

export const databaseConfigProvider = {
  provide: DATABASE_CONFIG,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) =>
    createDatabaseConfig(configService),
};

export const drizzleDbProvider = {
  provide: DRIZZLE_DB,
  inject: [DATABASE_CONFIG],
  useFactory: (databaseConfig: ReturnType<typeof createDatabaseConfig>) => {
    const logger = new Logger('DrizzleProvider');

    if (databaseConfig.client === 'postgres') {
      const pgPool = new Pool({
        connectionString: databaseConfig.url,
        host: databaseConfig.host,
        port: databaseConfig.port,
        user: databaseConfig.user,
        password: databaseConfig.password,
        database: databaseConfig.name,
        ssl: databaseConfig.ssl ? { rejectUnauthorized: false } : undefined,
      });

      return drizzlePostgres(pgPool);
    }

    if (databaseConfig.client === 'mysql') {
      const mysqlPool = createMysqlPool({
        uri: databaseConfig.url,
        host: databaseConfig.host,
        port: databaseConfig.port,
        user: databaseConfig.user,
        password: databaseConfig.password,
        database: databaseConfig.name,
        ssl: databaseConfig.ssl ? {} : undefined,
      });

      return drizzleMysql(mysqlPool);
    }

    if (databaseConfig.client === 'sqlite') {
      const sqlite = new Database(databaseConfig.sqliteFile);
      return drizzleSqlite(sqlite);
    }

    logger.warn(
      `DB_CLIENT is set to "nosql" (${databaseConfig.noSqlProvider}). Drizzle ORM is SQL-only, so DRIZZLE_DB will be null.`,
    );

    return null;
  },
};
