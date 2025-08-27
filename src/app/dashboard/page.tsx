import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  console.log("hello world");
  const session = await auth();
  console.log("session", session);

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div>dashboard home</div>
  );
}
