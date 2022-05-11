import { ClientRequestError } from '../error/ClientRequestError';
import { Prisma } from '@prisma/client';

type InferArgs<T> = T extends (...t: [...infer Arg]) => any ? Arg : never;
type InferReturn<T> = T extends (...t: [...infer Arg]) => infer Res
  ? Res
  : never;

export function prismaErrorWrapper<TFunc extends (...args: any[]) => any>(
  func: TFunc
): (...args: InferArgs<TFunc>) => InferReturn<TFunc> {
  return (...args: InferArgs<TFunc>) => {
    try {
      return func(...args);
    } catch (err: unknown) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError ||
        err instanceof Prisma.PrismaClientValidationError
      ) {
        throw new ClientRequestError();
      } else if (err instanceof Prisma.PrismaClientInitializationError) {
        throw err;
      } else {
        throw Error('Unexpected error');
      }
    }
  };
}
