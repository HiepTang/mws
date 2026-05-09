import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <main
      style={{
        maxWidth: 720,
        margin: "60px auto",
        padding: "0 24px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 32,
        }}
      >
        <h1 style={{ fontSize: 32, margin: 0 }}>Admin</h1>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            style={{
              background: "transparent",
              color: "#5a4a44",
              border: "1px solid #c8c0b8",
              padding: "6px 12px",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </form>
      </header>

      <p style={{ color: "#5a4a44", lineHeight: 1.6 }}>
        Signed in as <strong>{session.user.email}</strong>.
      </p>

      <section
        style={{
          background: "#fbf8f3",
          border: "1px solid #e8e0d4",
          borderRadius: 6,
          padding: 24,
          marginTop: 32,
        }}
      >
        <h2 style={{ fontSize: 20, margin: "0 0 8px" }}>Coming in Phase 7</h2>
        <p style={{ color: "#5a4a44", margin: 0, lineHeight: 1.6 }}>
          Pending review queue, contact-form inbox, approve/reject controls,
          and gallery toggles will land here in the admin phase. For now this
          page exists to verify the magic-link sign-in works end-to-end.
        </p>
      </section>
    </main>
  );
}
