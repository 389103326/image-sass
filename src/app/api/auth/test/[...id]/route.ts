import { NextRequest, NextResponse } from "next/server"

// [id] 匹配一级
// 【...id】 匹配所有级

// http://localhost:3000/api/auth/test/1234?name=zhangsan
// {"message":"Hello, 1234 zhangsan!"}
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const searchParams = request.nextUrl.searchParams
  const name = searchParams.get('name')
  return NextResponse.json({
    message: `Hello, ${params.id} ${name}!`,
  })
}