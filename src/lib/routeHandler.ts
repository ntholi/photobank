import { NextResponse } from 'next/server';

type ErrorCode =
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'VALIDATION_ERROR';

class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export async function routeHandler<T>(handler: () => Promise<T>) {
  try {
    const result = await handler();
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof AppError) {
      switch (error.code) {
        case 'NOT_FOUND':
          return NextResponse.json(
            { error: 'Resource not found' },
            { status: 404 },
          );
        case 'UNAUTHORIZED':
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        case 'FORBIDDEN':
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        case 'VALIDATION_ERROR':
          return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
