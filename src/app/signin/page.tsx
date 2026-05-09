import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";

type SearchParams = Promise<{
  "check-email"?: string;
  error?: string;
}>;

export default async function SignInPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Already signed in? Skip the form.
  const session = await auth();
  if (session?.user) {
    redirect("/admin");
  }

  const params = await searchParams;
  const showCheckEmail = params["check-email"] === "1";
  const showError = params.error === "1";

  return (
    <main
      style={{
        maxWidth: 480,
        margin: "80px auto",
        padding: "0 24px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Admin sign-in</h1>
      <p style={{ color: "#5a4a44", marginBottom: 24, lineHeight: 1.5 }}>
        Enter your email. We&apos;ll send you a one-time link to sign in.
      </p>

      {showCheckEmail && (
        <div
          style={{
            background: "#f0f4ed",
            border: "1px solid #c4d4b8",
            color: "#3c5128",
            padding: "12px 16px",
            borderRadius: 6,
            marginBottom: 16,
            lineHeight: 1.5,
          }}
        >
          Check your inbox. The link expires in 24 hours.
        </div>
      )}

      {showError && (
        <div
          style={{
            background: "#fbecec",
            border: "1px solid #e0b4b4",
            color: "#7a2828",
            padding: "12px 16px",
            borderRadius: 6,
            marginBottom: 16,
            lineHeight: 1.5,
          }}
        >
          Sign-in failed. Double-check the email or try again.
        </div>
      )}

      <form
        action={async (formData) => {
          "use server";
          await signIn("resend", formData);
        }}
      >
        {/* Tells Auth.js where to land the user after a successful magic-link
            click. Without this, the callbackUrl defaults to the current URL
            (/signin) and users round-trip back to the form. */}
        <input type="hidden" name="redirectTo" value="/admin" />

        <label
          htmlFor="email"
          style={{ display: "block", marginBottom: 6, fontWeight: 500 }}
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          autoFocus
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1px solid #c8c0b8",
            borderRadius: 4,
            fontSize: 16,
            marginBottom: 16,
          }}
        />
        <button
          type="submit"
          style={{
            background: "#9a1f2c",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: 4,
            fontSize: 16,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Send link
        </button>
      </form>
    </main>
  );
}
