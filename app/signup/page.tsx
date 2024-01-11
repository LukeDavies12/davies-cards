import AuthForm from "@/components/auth/form";
import Link from "next/link"; 
import { getPageSession } from "@/auth/lucia";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Page = async () => {
  const session = await getPageSession();
  if (session) redirect("/");
  return (
    <main className="max-w-lg mx-auto my-4 bg-card p-10">
      <h1 className="text-2xl font-bold text-center">Create an account</h1>
      <AuthForm action="/api/signup">
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
      <div className="mt-4 text-muted-foreground text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-secondary-foreground underline">
          Login
        </Link>
      </div>
    </main>
  );
};

export default Page;