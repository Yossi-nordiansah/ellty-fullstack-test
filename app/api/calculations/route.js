import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { z } from 'zod';

const startSchema = z.object({
  startValue: z.number(),
});

export async function GET() {
  try {
    const roots = await prisma.calculation.findMany({
      where: { parentId: null },
      include: {
        user: { select: { username: true, avatarUrl: true } },
        children: {
            orderBy: { createdAt: 'asc' },
            include: { user: { select: { username: true, avatarUrl: true } } }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(roots);
  } catch (error) {
    console.error('List calculations error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { startValue } = startSchema.parse(body);

    const calculation = await prisma.$transaction(async (tx) => {
      const calc = await tx.calculation.create({
        data: {
          operationType: 'START',
          leftValue: 0,
          rightValue: startValue,
          resultValue: startValue,
          userId: user.userId,
          rootId: 'TEMP', // Placeholder
        },
      });

      return await tx.calculation.update({
        where: { id: calc.id },
        data: { rootId: calc.id },
      });
    });

    return NextResponse.json(calculation, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Start calculation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
