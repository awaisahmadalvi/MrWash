import { Request, Response, NextFunction } from 'express';

export class ErrorMiddleware {
  public static handleError(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    console.error(error.stack);
    res.status(500).json({
      error: {
        message: error.message || 'Internal Server Error',
      },
    });
  }

  public static handleNotFound(req: Request, res: Response): void {
    res.status(404).json({
      error: {
        message: 'Not Found',
      },
    });
  }
}
