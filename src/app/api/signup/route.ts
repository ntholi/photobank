import { NextResponse } from 'next/server';
import { saveUserToDB } from '../users/userService';

export async function POST(request: Request) {
  const { email, password, names } = await request.json();

  if (!email || !password) {
    throw new Error('Missing Fields');
  }

  throw new Error('Not implemented');
}
