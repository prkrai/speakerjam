import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const error = new Error('Validation failed');
      (error as any).statusCode = 400;
      (error as any).details = result.error.flatten();
      return next(error);
    }
    req.body = result.data;
    next();
  };
}
