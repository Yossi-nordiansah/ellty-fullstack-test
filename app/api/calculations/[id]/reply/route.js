import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { z } from 'zod';
import { Decimal } from 'decimal.js';

const replySchema = z.object({
  operationType: z.enum(['ADD', 'SUB', 'MUL', 'DIV']),
  value: z.number(),
});

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { operationType, value } = replySchema.parse(body);

    const parent = await prisma.calculation.findUnique({
      where: { id },
    });

    if (!parent) {
      return NextResponse.json({ error: 'Parent calculation not found' }, { status: 404 });
    }

    let result;
    const left = new Decimal(parent.resultValue.toString());
    const right = new Decimal(value.toString());

    switch (operationType) {
      case 'ADD':
        result = left.plus(right);
        break;
      case 'SUB':
        result = left.minus(right);
        break;
      case 'MUL':
        result = left.times(right);
        break;
      case 'DIV':
        if (right.isZero()) return NextResponse.json({ error: 'Division by zero' }, { status: 400 });
        result = left.div(right);
        break;
      default:
        return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
    }

    const calculation = await prisma.calculation.create({
      data: {
        parentId: parent.id,
        rootId: parent.rootId,
        userId: user.userId,
        operationType,
        leftValue: parent.resultValue,
        rightValue: value,
        resultValue: result.toNumber(),
      },
    });

    return NextResponse.json(calculation, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Reply calculation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
