import { PrismaClient } from '@generated/prisma';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  // Extract the id from the URL
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  if (!id) {
    return NextResponse.json({ error: 'Missing email id' }, { status: 400 });
  }

  try {
    const email = await prisma.mfilesEmail.findUnique({
      where: { id },
    });
    if (!email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }
    return NextResponse.json(email);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch email', details: String(error) },
      { status: 500 }
    );
  }
}
