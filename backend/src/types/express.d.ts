import { Response } from 'express';

declare module 'express-serve-static-core' {
  interface Response {
    json<T = any>(body?: T): this;
  }
}

export type ApiResponse<T = any> = Response<T | { error: string }>;