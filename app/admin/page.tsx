import { auth } from "@/auth/lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";
import SignOutBtn from "@/components/auth/SignOutBtn";

const Page = async () => {
  const authRequest = auth.handleRequest("GET", context);
	const session = await authRequest.validate();
	if (!session) redirect("/login");
  return (
    <>
      <h1 className="text-2xl font-bold">Admin</h1>
    </>
  );
}

export default Page;