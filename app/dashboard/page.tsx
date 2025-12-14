import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    return (
      <div style={{ padding: "2rem" }}>
        <p>You must sign in to see the dashboard.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      <p>Signed in as user: {userId}</p>
    </div>
  );
}

