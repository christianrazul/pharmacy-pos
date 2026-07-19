import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it, vi } from "vitest";
import { LoginForm } from "./login-form";

const replace = vi.fn();
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, refresh }),
}));

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

it("shows field guidance before sending incomplete credentials", async () => {
  const user = userEvent.setup();
  render(<LoginForm />);

  await user.click(screen.getByRole("button", { name: "Sign in" }));

  expect(
    await screen.findByText(
      "Enter the username assigned to your administrator account.",
    ),
  ).toBeVisible();
  expect(fetch).not.toHaveBeenCalled();
});

it("keeps the user on the form when credentials are rejected", async () => {
  vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 401 }));
  const user = userEvent.setup();
  render(<LoginForm />);

  await user.type(screen.getByLabelText("Username"), "central-admin");
  await user.type(
    screen.getByLabelText("Password"),
    "IncorrectPassword2026!",
  );
  await user.click(screen.getByRole("button", { name: "Sign in" }));

  expect(
    await screen.findByText(
      "That username and password did not match. Check both fields and try again.",
    ),
  ).toBeVisible();
  expect(replace).not.toHaveBeenCalled();
});

it("moves to the protected dashboard after a valid login", async () => {
  vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 200 }));
  const user = userEvent.setup();
  render(<LoginForm />);

  await user.type(screen.getByLabelText("Username"), "central-admin");
  await user.type(
    screen.getByLabelText("Password"),
    "ValidTestPassword2026!",
  );
  await user.click(screen.getByRole("button", { name: "Sign in" }));

  expect(replace).toHaveBeenCalledWith("/dashboard");
  expect(refresh).toHaveBeenCalled();
});
