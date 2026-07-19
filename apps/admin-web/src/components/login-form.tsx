"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type FieldError, type UseFormRegister } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Enter the username assigned to your administrator account."),
  password: z
    .string()
    .min(12, "Enter your administrator password of at least 12 characters."),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { errors, isSubmitting, register, serverError, submitLogin } =
    useLoginSubmission();

  return (
    <form className="login-form" method="post" onSubmit={submitLogin} noValidate>
      <CredentialField
        id="username"
        label="Username"
        autoComplete="username"
        helper="Use the username assigned by your system owner."
        error={errors.username}
        register={register}
      />
      <CredentialField
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        helper="Password recovery will use your email when configured."
        error={errors.password}
        register={register}
      />
      <div className="form-status" aria-live="polite">
        {serverError}
      </div>
      <SubmitButton isSubmitting={isSubmitting} hasError={Boolean(serverError)} />
    </form>
  );
}

function useLoginSubmission() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const submitLogin = handleSubmit(async (values) => {
    setServerError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        setServerError(
          response.status === 401
            ? "That username and password did not match. Check both fields and try again."
            : "The sign-in service is unavailable. Wait a moment and try again.",
        );
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setServerError(
        "The sign-in service could not be reached. Check the connection and try again.",
      );
    }
  });

  return { errors, isSubmitting, register, serverError, submitLogin };
}

interface CredentialFieldProps {
  id: keyof LoginValues;
  label: string;
  type?: "password";
  autoComplete: string;
  helper: string;
  error?: FieldError;
  register: UseFormRegister<LoginValues>;
}

function CredentialField({
  id,
  label,
  type,
  autoComplete,
  helper,
  error,
  register,
}: CredentialFieldProps) {
  const messageId = `${id}-message`;

  return (
    <div className="field-group">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        autoComplete={autoComplete}
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

function SubmitButton({
  isSubmitting,
  hasError,
}: {
  isSubmitting: boolean;
  hasError: boolean;
}) {
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      data-state={isSubmitting ? "loading" : hasError ? "error" : "default"}
      className="w-full"
    >
      {isSubmitting ? (
        <>
          <LoaderCircle className="spinner" aria-hidden="true" />
          Signing in…
        </>
      ) : (
        "Sign in"
      )}
    </Button>
  );
}
