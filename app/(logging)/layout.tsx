import { getCurrentSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function AuthCheck({ children }: { children: React.ReactNode }) {
  const { session, user } = await getCurrentSession();

  if (!session || !user) {
    redirect("/");
  }

  return <>{children}</>;
}

export default function LoggingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <AuthCheck>{children}</AuthCheck>
    </Suspense>
  );
}

