import { ConfigService } from '@nestjs/config';
import {
  DatabaseClient,
  DatabaseConfig,
  NoSqlProvider,
} from './database.types';

const toBoolean = (
  value: string | undefined,
  defaultValue = false,
): boolean => {
  if (!value) return defaultValue;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
};

export const createDatabaseConfig = (
  configService: ConfigService,
): DatabaseConfig => {
  const client = configService.get<DatabaseClient>('DB_CLIENT', 'postgres');

  return {
    client,
    url: configService.get<string>('DB_URL'),
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: Number(configService.get<string>('DB_PORT', '5432')),
    user: configService.get<string>('DB_USER', 'postgres'),
    password: configService.get<string>('DB_PASSWORD', ''),
    name: configService.get<string>('DB_NAME', 'app_db'),
    ssl: toBoolean(configService.get<string>('DB_SSL', 'false')),
    sqliteFile: configService.get<string>('DB_SQLITE_FILE', './data/app.db'),
    noSqlProvider: configService.get<NoSqlProvider>(
      'NOSQL_PROVIDER',
      'mongodb',
    ),
    noSqlUri: configService.get<string>('NOSQL_URI'),
    noSqlDatabase: configService.get<string>('NOSQL_DATABASE', 'app_nosql_db'),
  };
};
