import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerOptions: any = new DocumentBuilder()
  .setTitle('Weather Api')
  .setDescription('weather API and provides additional features.')
  .setVersion('0.0.2')
  .addServer(process.env.LOCAL_APP_URL, 'local_server')
  .addBearerAuth()
  .build();
