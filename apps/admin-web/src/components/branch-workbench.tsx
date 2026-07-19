"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, LoaderCircle, MapPin } from "lucide-react";
import { useState, type FormEventHandler } from "react";
import { useForm, type FieldError, type UseFormRegister } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Branch } from "@/lib/branches";

const branchSchema = z.object({
  name: z.string().trim().min(1, "Enter a branch name.").max(120),
  code: z
    .string()
    .trim()
    .min(1, "Enter a branch code.")
    .max(32)
    .regex(
      /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/,
      "Use letters, numbers, and single hyphens only.",
    ),
  address: z.string().trim().max(500).optional(),
});

type BranchValues = z.infer<typeof branchSchema>;

export function BranchWorkbench({
  initialBranches,
}: {
  initialBranches: Branch[] | null;
}) {
  const directoryUnavailable = initialBranches === null;
  const workbench = useBranchWorkbench(initialBranches ?? []);

  return (
    <section
      id="branches"
      className="branch-workbench"
      aria-labelledby="branches-heading"
    >
      <div className="workbench-heading">
        <div>
          <h2 id="branches-heading">Branches</h2>
          <p>Add and review the pharmacy locations managed centrally.</p>
        </div>
        <span
          className="count-readout"
          aria-label={
            directoryUnavailable
              ? "Branch count unavailable"
              : branchCountLabel(workbench.branches.length)
          }
        >
          {directoryUnavailable ? "—" : workbench.branches.length}
        </span>
      </div>
      {directoryUnavailable ? (
        <DirectoryUnavailable />
      ) : (
        <div className="branch-workspace">
          <BranchForm
            errors={workbench.form.formState.errors}
            isSubmitting={workbench.form.formState.isSubmitting}
            register={workbench.form.register}
            serverError={workbench.serverError}
            successMessage={workbench.successMessage}
            submitBranch={workbench.submitBranch}
          />
          <BranchDirectory branches={workbench.branches} />
        </div>
      )}
    </section>
  );
}

function useBranchWorkbench(initialBranches: Branch[]) {
  const [branches, setBranches] = useState(initialBranches);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const form = useForm<BranchValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: { name: "", code: "", address: "" },
  });
  const clearStatus = () => {
    setServerError(null);
    setSuccessMessage(null);
  };
  const submitBranch = form.handleSubmit(async (values) => {
    clearStatus();
    const result = await postBranch(values);

    if (!result.ok) {
      setServerError(result.error);
      return;
    }

    setBranches((current) => [...current, result.branch].sort(compareBranches));
    form.reset();
    setSuccessMessage(`${result.branch.name} was added.`);
  }, clearStatus);

  return { branches, form, serverError, submitBranch, successMessage };
}

async function postBranch(values: BranchValues): Promise<
  | { ok: true; branch: Branch }
  | { ok: false; error: string }
> {
  try {
    const response = await fetch("/api/branches", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        code: values.code,
        address: values.address || null,
      }),
    });

    if (!response.ok) {
      return { ok: false, error: creationError(response.status) };
    }

    const body = (await response.json()) as { branch: Branch };
    return { ok: true, branch: body.branch };
  } catch {
    return {
      ok: false,
      error: "The branch service could not be reached. Try again.",
    };
  }
}

interface BranchFormProps {
  errors: Partial<Record<keyof BranchValues, FieldError>>;
  isSubmitting: boolean;
  register: UseFormRegister<BranchValues>;
  serverError: string | null;
  successMessage: string | null;
  submitBranch: FormEventHandler<HTMLFormElement>;
}

function BranchForm({
  errors,
  isSubmitting,
  register,
  serverError,
  successMessage,
  submitBranch,
}: BranchFormProps) {
  return (
    <form className="branch-form" onSubmit={submitBranch} noValidate>
      <div className="branch-form-heading">
        <h3>Add a branch</h3>
        <p>New branches start with active status.</p>
      </div>
      <BranchField
        id="name"
        label="Branch name"
        helper="Use the public name staff recognize."
        error={errors.name}
        register={register}
      />
      <BranchField
        id="code"
        label="Branch code"
        helper="Letters, numbers, and hyphens; saved in uppercase."
        error={errors.code}
        register={register}
      />
      <BranchField
        id="address"
        label="Address"
        helper="Optional for this milestone."
        error={errors.address}
        register={register}
      />
      <FormStatus error={serverError} success={successMessage} />
      <SubmitBranchButton isSubmitting={isSubmitting} />
    </form>
  );
}

function FormStatus({
  error,
  success,
}: {
  error: string | null;
  success: string | null;
}) {
  return (
    <div className="branch-form-status" aria-live="polite">
      {error ? <span className="form-error">{error}</span> : null}
      {success ? <span className="form-success">{success}</span> : null}
    </div>
  );
}

function SubmitBranchButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      data-state={isSubmitting ? "loading" : "default"}
    >
      {isSubmitting ? (
        <>
          <LoaderCircle className="spinner" aria-hidden="true" />
          Adding branch…
        </>
      ) : (
        "Add branch"
      )}
    </Button>
  );
}

interface BranchFieldProps {
  id: keyof BranchValues;
  label: string;
  helper: string;
  error?: FieldError;
  register: UseFormRegister<BranchValues>;
}

function BranchField({
  id,
  label,
  helper,
  error,
  register,
}: BranchFieldProps) {
  const messageId = `branch-${id}-message`;

  return (
    <div className="field-group">
      <Label htmlFor={`branch-${id}`}>{label}</Label>
      <Input
        id={`branch-${id}`}
        autoComplete="off"
        aria-invalid={Boolean(error)}
        aria-describedby={messageId}
        {...register(id)}
      />
      <p id={messageId} className="field-message">
        {error?.message ?? helper}
      </p>
    </div>
  );
}

function BranchDirectory({ branches }: { branches: Branch[] }) {
  if (branches.length === 0) {
    return (
      <div className="empty-branches">
        <Building2 aria-hidden="true" />
        <div>
          <h3>No branches configured</h3>
          <p>Add the first branch to begin the central directory.</p>
        </div>
      </div>
    );
  }

  return (
    <ul className="branch-list" aria-label="Branch directory">
      {branches.map((branch) => (
        <li key={branch.id}>
          <div className="branch-identity">
            <strong>{branch.name}</strong>
            <span>{branch.code}</span>
          </div>
          <div className="branch-address">
            <MapPin aria-hidden="true" />
            <span>{branch.address ?? "No address provided"}</span>
          </div>
          <span className="status-badge">{statusLabel(branch.status)}</span>
        </li>
      ))}
    </ul>
  );
}

function DirectoryUnavailable() {
  return (
    <div className="directory-unavailable" role="status">
      <Building2 aria-hidden="true" />
      <div>
        <h3>Branch directory unavailable</h3>
        <p>Refresh after the API connection is restored.</p>
      </div>
    </div>
  );
}

function compareBranches(left: Branch, right: Branch): number {
  return (
    left.name.localeCompare(right.name) || left.code.localeCompare(right.code)
  );
}

function creationError(status: number): string {
  if (status === 409) {
    return "That branch code is already in use.";
  }

  if (status === 400) {
    return "Check the branch details and try again.";
  }

  return "The branch could not be added. Try again.";
}

function statusLabel(status: Branch["status"]): string {
  return status === "ACTIVE" ? "Active" : "Inactive";
}

function branchCountLabel(count: number): string {
  return `${count} ${count === 1 ? "branch" : "branches"}`;
}
