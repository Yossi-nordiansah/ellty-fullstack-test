import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { z } from 'zod';

const avatarSchema = z.object({
  avatarUrl: z.string().url().or(z.string().startsWith('data:image')),
});

export async function PATCH(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { avatarUrl } = avatarSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: { avatarUrl },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Update avatar error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
