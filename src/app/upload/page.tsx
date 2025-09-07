import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import Uploader from "./uploader";

export default async function Home() {
  console.log("hello upload");
  const session = await auth();
  console.log("session", session);

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div>
      <div id='uppy-dashboard'/>
      <Uploader />
    </div>
  );
}
