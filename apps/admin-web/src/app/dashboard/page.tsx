import { Building2, LayoutDashboard, PackageSearch, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BranchWorkbench } from "@/components/branch-workbench";
import { LogoutButton } from "@/components/logout-button";
import { getCurrentUser } from "@/lib/auth";
import { getBranches } from "@/lib/branches";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const branches = await getBranches();

  return (
    <main className="dashboard-shell">
      <SideRail username={user.username} />
      <DashboardContent initialBranches={branches} />
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
        <a href="#branches">
          <Building2 aria-hidden="true" />
          Branches
        </a>
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

function DashboardContent({
  initialBranches,
}: {
  initialBranches: Awaited<ReturnType<typeof getBranches>>;
}) {
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
      <BranchWorkbench initialBranches={initialBranches} />
      <footer className="dashboard-footer">
        <span>Pharmacy POS</span>
        <span>Cloud administration · Offline branch operation planned</span>
      </footer>
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
