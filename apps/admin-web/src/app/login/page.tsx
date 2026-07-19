import { Network, ShieldCheck, Store } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="login-shell">
      <LoginPanel />
      <LoginContext />
    </main>
  );
}

function LoginPanel() {
  return (
    <section className="login-panel" aria-labelledby="login-heading">
      <div className="brand-lockup">
        <span className="brand-mark" aria-hidden="true">Rx</span>
        <span>Pharmacy POS</span>
      </div>
      <div className="login-copy">
        <h1 id="login-heading">Central administration</h1>
        <p>
          Sign in to manage the cloud record that will connect every pharmacy branch.
        </p>
      </div>
      <LoginForm />
      <footer className="login-footer">
        Authorized central administrators only.
      </footer>
    </section>
  );
}

function LoginContext() {
  return (
    <aside className="login-context" aria-label="System operating model">
      <div className="context-copy">
        <p className="context-kicker">One operating record</p>
        <h2>Keep every branch visible.</h2>
        <p>
          Central administration stays in the cloud. Branch sales will keep working locally and synchronize when connectivity returns.
        </p>
      </div>
      <dl className="operating-model">
        <div>
          <ShieldCheck aria-hidden="true" />
          <dt>Central control</dt>
          <dd>Administrator access and policy live in one trusted service.</dd>
        </div>
        <div>
          <Store aria-hidden="true" />
          <dt>Branch continuity</dt>
          <dd>Future POS workflows remain usable during a network interruption.</dd>
        </div>
        <div>
          <Network aria-hidden="true" />
          <dt>Deferred sync</dt>
          <dd>Queued branch activity reconciles after the connection returns.</dd>
        </div>
      </dl>
    </aside>
  );
}
