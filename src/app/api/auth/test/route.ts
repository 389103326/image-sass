import { NextResponse, NextRequest } from "next/server";
import {
  updateUserSchema,
  insertUserSchema,
} from "@/server/db/validate-schema";

export async function GET(request: NextRequest) {
  console.log("*********"); // next start 时不会执行
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get("name");
  const email = searchParams.get("email");

  const result = insertUserSchema.safeParse({
    name,
    email,
  });

  // const result = updateUserSchema.safeParse({
  //   name,
  // });

  if (result.success) {
    return NextResponse.json(result.data);
  }

  console.log(result.error);
  return NextResponse.json({ error: result.error.message });
}
