import { Building2, LayoutDashboard, PackageSearch, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="dashboard-shell">
      <SideRail username={user.username} />
      <DashboardContent />
    </main>
  );
}

function SideRail({ username }: { username: string }) {
  return (
    <aside className="side-rail">
      <Brand />
      <nav aria-label="Primary navigation" className="primary-nav">
        <a href="/dashboard" aria-current="page">
          <LayoutDashboard aria-hidden="true" />
          Overview
        </a>
        <span className="nav-coming" aria-disabled="true">
          <Building2 aria-hidden="true" />
          Branches
          <small>Soon</small>
        </span>
        <span className="nav-coming" aria-disabled="true">
          <PackageSearch aria-hidden="true" />
          Inventory
          <small>Later</small>
        </span>
      </nav>
      <div className="rail-account">
        <div>
          <span className="account-label">Signed in as</span>
          <strong>{username}</strong>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}

function DashboardContent() {
  return (
    <section className="dashboard-main">
      <header className="mobile-header">
        <Brand />
        <LogoutButton />
      </header>
      <div className="dashboard-heading">
        <div>
          <h1>Central overview</h1>
          <p>Monitor the organization here as branches come online.</p>
        </div>
        <div className="identity-chip">
          <ShieldCheck aria-hidden="true" />
          Central admin
        </div>
      </div>
      <BranchWorkbench />
      <footer className="dashboard-footer">
        <span>Pharmacy POS</span>
        <span>Cloud administration · Offline branch operation planned</span>
      </footer>
    </section>
  );
}

function BranchWorkbench() {
  return (
    <section className="branch-workbench" aria-labelledby="branches-heading">
      <div className="workbench-heading">
        <div>
          <h2 id="branches-heading">Branches</h2>
          <p>The branch directory will become the entry point for operations.</p>
        </div>
        <span className="count-readout" aria-label="Zero branches">0</span>
      </div>
      <div className="empty-branches">
        <Building2 aria-hidden="true" />
        <div>
          <h3>No branches configured</h3>
          <p>
            Branch creation is intentionally outside this milestone. The next slice will add the first real branch record here.
          </p>
        </div>
      </div>
    </section>
  );
}

function Brand() {
  return (
    <div className="rail-brand">
      <span className="brand-mark" aria-hidden="true">Rx</span>
      <span>Pharmacy POS</span>
    </div>
  );
}
