"use client";

import { useActionState } from "react";

import { loginAction } from "@/modules/auth/actions";

import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";

const initialState = {
  error: "",
};

export function LoginForm() {
  const [state, action] = useActionState(loginAction, initialState);

  return (
    <form action={action} className="grid gap-4">
      <Input name="email" placeholder="Email" required type="email" />
      <Input name="password" placeholder="Senha" required type="password" />
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <SubmitButton className="w-full" size="lg">
        Entrar no painel
      </SubmitButton>
    </form>
  );
}
