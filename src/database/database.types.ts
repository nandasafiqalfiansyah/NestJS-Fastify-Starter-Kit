export type DatabaseClient = 'postgres' | 'mysql' | 'sqlite' | 'nosql';

export type NoSqlProvider = 'mongodb' | 'dynamodb' | 'redis';

export type DatabaseConfig = {
  client: DatabaseClient;
  url?: string;
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  name?: string;
  ssl: boolean;
  sqliteFile: string;
  noSqlProvider: NoSqlProvider;
  noSqlUri?: string;
  noSqlDatabase?: string;
};
