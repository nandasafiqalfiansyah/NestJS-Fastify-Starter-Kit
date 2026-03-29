import { Global, Module } from '@nestjs/common';
import { databaseConfigProvider, drizzleDbProvider } from './drizzle.provider';

@Global()
@Module({
  providers: [databaseConfigProvider, drizzleDbProvider],
  exports: [databaseConfigProvider, drizzleDbProvider],
})
export class DatabaseModule {}
