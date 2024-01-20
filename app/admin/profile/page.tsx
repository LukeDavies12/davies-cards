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
      <div className="container mx-auto mt-10 p-6 max-w-md bg-white shadow-sm rounded-lg mb-12">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <div className="mb-6 flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-medium text-gray-700">Username</h2>
            <p className="text-gray-600">{session.user.username}</p>
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-700">User Id</h2>
            <p className="text-gray-600">{session.user.userId}</p>
          </div>
        </div>
        <SignOutBtn />
      </div>
      <StyledLink href="/admin/" className="mt-4">Admin Home</StyledLink>
    </>
  );
};

export default Page;
