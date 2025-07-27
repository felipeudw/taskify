import { Logger } from '@nestjs/common';
import * as morgan from 'morgan';

export function useRequestLogging(app) {
  const logger = new Logger('Request');
  app.use(
    morgan(':method :url :status :response-time ms', {
      stream: {
        write: (message) => Logger.log(message.trim(), 'Request'),
      },
    }),
  );
}
