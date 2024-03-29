import { getPageSession } from "@/auth/lucia";
import AuthForm from "@/components/auth/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await getPageSession();
  if (session?.user) redirect("/admin");
  
  return (
    <main className="max-w-lg mx-auto my-4 bg-card p-10">
      <h1 className="text-2xl font-bold text-center">
        Sign in to your account
      </h1>
      <AuthForm action="/api/login">
        <Label htmlFor="username" className="text-muted-foreground">
          Username
        </Label>
        <Input name="username" id="username" />
        <br />
        <Label htmlFor="password" className="text-muted-foreground">
          Password
        </Label>
        <Input type="password" name="password" id="password" />
        <br />
      </AuthForm>
    </main>
  );
};

export default Page;
