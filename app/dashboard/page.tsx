import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <p>Signed in as user: {userId}</p>
    </div>
  );
}
