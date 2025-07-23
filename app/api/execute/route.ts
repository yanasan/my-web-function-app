
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const filePath = path.join('/tmp', 'result.json');
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ message: 'Data received successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error writing file', error }, { status: 500 });
  }
}
