import { auth } from "@/auth/lucia";
import SignOutBtn from "@/components/auth/SignOutBtn";
import StyledLink from "@/components/ui/link";
import * as context from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {
  const authRequest = auth.handleRequest("GET", context);
  const session = await authRequest.validate();
  if (!session) redirect("/login");

  return (
    <>
      <h1 className="text-2xl font-bold">Admin</h1>
      <div className="py-4 flex flex-col gap-4">
        <StyledLink href="/admin/log">Log Game</StyledLink>
        <StyledLink href="/admin/games">All Games Table</StyledLink>
        <StyledLink href="/admin/profile">Profile</StyledLink>
        <SignOutBtn />
      </div>
    </>
  );
}

export default Page;