import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it, vi } from "vitest";
import { BranchWorkbench } from "./branch-workbench";

const centralBranch = {
  id: "branch-central",
  name: "Central Pharmacy",
  code: "CENTRAL-01",
  address: "10 Central Avenue",
  status: "ACTIVE" as const,
};
const westBranch = {
  id: "branch-west",
  name: "West Pharmacy",
  code: "WEST-01",
  address: null,
  status: "ACTIVE" as const,
};

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

it("shows the branch form and truthful empty directory", () => {
  render(<BranchWorkbench initialBranches={[]} />);

  expect(screen.getByRole("heading", { name: "Add a branch" })).toBeVisible();
  expect(screen.getByText("No branches configured")).toBeVisible();
  expect(screen.getByLabelText("0 branches")).toBeVisible();
});

it("adds a branch and keeps the directory alphabetized", async () => {
  vi.mocked(fetch).mockResolvedValue(
    Response.json({ branch: centralBranch }, { status: 201 }),
  );
  const user = userEvent.setup();
  render(<BranchWorkbench initialBranches={[westBranch]} />);
  expect(screen.getByLabelText("1 branch")).toBeVisible();

  await fillBranchForm(user, {
    name: "Central Pharmacy",
    code: "central-01",
    address: "10 Central Avenue",
  });

  expect(await screen.findByText("Central Pharmacy was added.")).toBeVisible();
  expect(screen.getByLabelText("2 branches")).toBeVisible();
  expect(
    screen.getAllByRole("listitem").map((item) => item.textContent),
  ).toEqual([
    "Central PharmacyCENTRAL-0110 Central AvenueActive",
    "West PharmacyWEST-01No address providedActive",
  ]);
  expect(fetch).toHaveBeenCalledWith(
    "/api/branches",
    expect.objectContaining({
      method: "POST",
      body: JSON.stringify(branchInput()),
    }),
  );
});

it("reports duplicate branch codes without changing the directory", async () => {
  vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 409 }));
  const user = userEvent.setup();
  render(<BranchWorkbench initialBranches={[]} />);

  await user.type(screen.getByLabelText("Branch name"), "Main Pharmacy");
  await user.type(screen.getByLabelText("Branch code"), "MAIN-01");
  await user.click(screen.getByRole("button", { name: "Add branch" }));

  expect(
    await screen.findByText("That branch code is already in use."),
  ).toBeVisible();
  expect(screen.getByLabelText("0 branches")).toBeVisible();
});

it("does not present an empty directory when loading failed", () => {
  render(<BranchWorkbench initialBranches={null} />);

  expect(screen.getByText("Branch directory unavailable")).toBeVisible();
  expect(screen.getByLabelText("Branch count unavailable")).toBeVisible();
  expect(screen.queryByText("No branches configured")).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Add branch" }),
  ).not.toBeInTheDocument();
});

function branchInput() {
  return {
    name: "Central Pharmacy",
    code: "central-01",
    address: "10 Central Avenue",
  };
}

async function fillBranchForm(
  user: ReturnType<typeof userEvent.setup>,
  input: { name: string; code: string; address: string },
) {
  await user.type(screen.getByLabelText("Branch name"), input.name);
  await user.type(screen.getByLabelText("Branch code"), input.code);
  await user.type(screen.getByLabelText("Address"), input.address);
  await user.click(screen.getByRole("button", { name: "Add branch" }));
}
