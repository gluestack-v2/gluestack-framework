import path from 'path';
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
export async function GET(request) {
  const jsonDirectory = path.resolve('public', 'log.txt');
  console.log(jsonDirectory, 'jsonDirectory');
  const fileContents = await fs.readFile(jsonDirectory, 'utf8');
  return new NextResponse(fileContents);
}
