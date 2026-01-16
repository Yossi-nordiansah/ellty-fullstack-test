import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const registerSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = registerSchema.parse(body);

    const existingUser = await prisma.user.findFirst({
      where: { 
        username: {
          equals: username,
          mode: 'insensitive'
        }
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        avatarUrl: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Alexander', // Default Male Avatar
      },
    });

    return NextResponse.json({ message: 'User created successfully', userId: user.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
