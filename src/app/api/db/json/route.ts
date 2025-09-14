import { PrismaClient } from '@generated/prisma';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const emails = await prisma.mfilesEmail.findMany();
    return NextResponse.json(emails);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch emails', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const item = await request.json();
    // Validate and sanitize input
    const validItem = {
      name: item.name,
      body: item.body,
      createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
    };
    // Insert into MongoDB
    const created = await prisma.mfilesEmail.create({
      data: validItem,
    });
    return NextResponse.json({ success: true, id: created.id });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to store email', details: String(error) },
      { status: 400 }
    );
  }
}
