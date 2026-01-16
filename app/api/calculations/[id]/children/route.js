import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const children = await prisma.calculation.findMany({
      where: { parentId: id },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { username: true, avatarUrl: true } },
        children: { select: { id: true } } // Just to check if it has children
      }
    });

    return NextResponse.json(children);
  } catch (error) {
    console.error('Fetch children error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
