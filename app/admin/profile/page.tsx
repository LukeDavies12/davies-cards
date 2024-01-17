import { auth } from "@/auth/lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";
import SignOutBtn from "@/components/auth/SignOutBtn";

const Page = async () => {
  const authRequest = auth.handleRequest("GET", context);
  const session = await authRequest.validate();
  if (!session) redirect("/login");
  
  return (
    <div className="container mx-auto mt-10 p-6 max-w-md bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-700">Username</h2>
        <p className="text-gray-600">{session.user.username}</p>
      </div>
      <SignOutBtn />
    </div>
  );
};

export default Page;
