"use client";

import { trpcClient } from "@/utils/client-vanilla";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { UserInfo, SessionProvider } from "./user-info";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    trpcClient.hello.query().then((res) => {
      console.log("res", res);
    });
  }, []);

  return (
      <SessionProvider>
        <div className="h-screen flex justify-center items-center">
          <form className="flex flex-col gap-4 w-96 p-6 bg-white rounded-lg shadow-md">
            <h1 className="m-auto">App Name</h1>
            <Input name="name" placeholder="Enter your name" />
            <Textarea name="description" placeholder="Enter your description" />
            <Switch />
            <Button type="submit">Click me</Button>
          </form>
          <UserInfo />
        </div>
      </SessionProvider>
  );
}
