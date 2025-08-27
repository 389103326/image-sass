import { NextResponse } from "next/server"

export async function GET() {
  console.log('*********') // next start 时不会执行
  return NextResponse.json({
    message: `Hello World!`,
  })
}