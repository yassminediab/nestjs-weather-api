import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { GraphQLError } from 'graphql';

@Catch()
export class GqlAllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(GqlAllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): GraphQLError {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      if (typeof response === 'string') {
        message = response;
      } else if (typeof response === 'object' && response !== null) {
        message = (response as Record<string, any>).message || message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    this.logger.error(
      `[GraphQL Error] Status: ${status} - Message: ${message}`,
      exception?.toString(),
    );

    // Return a formatted GraphQL error
    return new GraphQLError(message, {
      extensions: {
        code: status,
      },
    });
  }
}
