import { NextResponse } from 'next/server';
import { saveUserToDB } from '../users/userService';

export async function POST(request: Request) {
  const { email, password, names } = await request.json();

  if (!email || !password) {
    throw new Error('Missing Fields');
  }
  /*
  try {
    const user = await adminAuth.createUser({
      email,
      password,
      displayName: names,
    });*/
  //await saveUserToDB(user);
  //return NextResponse.json({ user });
  /*
  } catch (error: FirebaseError | any) {
    console.log(error);
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 },
      );
    } else if (error.code === 'auth/invalid-email') {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    } else if (error.code === 'auth/weak-password') {
      return NextResponse.json({ error: 'Weak password' }, { status: 400 });
    } else {
      return NextResponse.json(
        { error: 'Something went wrong' },
        { status: 500 },
      );
    }
  }*/
}
