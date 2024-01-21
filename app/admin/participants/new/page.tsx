import { auth } from "@/auth/lucia";
import { ParticipantForm } from "@/components/participants/form";
import StyledLink from "@/components/ui/link";
import * as context from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {
  const authRequest = auth.handleRequest("GET", context);
  const session = await authRequest.validate();
  if (!session) redirect("/login");

  return (
    <>
      <h1 className="text-2xl font-bold">Log Game</h1>
      <div className="py-4">
        <ParticipantForm />
        <StyledLink href="/admin/" className="mt-4">Admin Home</StyledLink>
      </div>
    </>
  );
}

export default Page;