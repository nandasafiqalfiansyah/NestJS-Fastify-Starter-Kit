import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type RootStatusResponse = {
  app: {
    name: string;
    description: string;
    version: string;
    environment: string;
  };
  uptime: {
    totalSeconds: number;
    humanReadable: string;
  };
  runtime: {
    nodeVersion: string;
    platform: string;
    arch: string;
    pid: number;
    rssMb: number;
  };
  timestamp: string;
};

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getStatus(): RootStatusResponse {
    const totalSeconds = Math.floor(process.uptime());

    return {
      app: {
        name: this.configService.get<string>('APP_NAME', 'nest-fastify-app'),
        description: this.configService.get<string>(
          'APP_DESCRIPTION',
          'Nest Fastify API Service',
        ),
        version: this.configService.get<string>('APP_VERSION', '0.0.1'),
        environment: this.configService.get<string>('APP_ENV', 'development'),
      },
      uptime: {
        totalSeconds,
        humanReadable: this.formatUptime(totalSeconds),
      },
      runtime: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        pid: process.pid,
        rssMb:
          Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
      },
      timestamp: new Date().toISOString(),
    };
  }

  private formatUptime(totalSeconds: number): string {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
}
