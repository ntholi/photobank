/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServiceLogger } from './logger';

type Constructor<T> = new (...args: any[]) => T;

export function serviceWrapper<T extends object>(
  Service: Constructor<T>,
  resourceName: string,
): T {
  const logger = createServiceLogger(resourceName);

  return new Proxy(new Service(), {
    get(target: T, prop: string | symbol, receiver: unknown) {
      const originalMethod = Reflect.get(target, prop, receiver);

      if (typeof originalMethod === 'function') {
        return async function (...args: any[]) {
          const startTime = Date.now();
          const methodName = String(prop);

          logger.info(`Starting ${methodName}`, { args });

          try {
            const result = await originalMethod.apply(target, args);
            const duration = Date.now() - startTime;

            logger.info(`Completed ${methodName} in ${duration}ms`, {
              success: true,
              duration,
              result,
            });

            return result;
          } catch (error) {
            const duration = Date.now() - startTime;
            logger.error(
              `Failed ${methodName} after ${duration}ms: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
              {
                success: false,
                duration,
                error: error instanceof Error ? error.message : String(error),
                args,
              },
            );
            throw error;
          }
        };
      }

      return originalMethod;
    },
  });
}
