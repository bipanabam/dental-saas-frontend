"use client"

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginSchema, type LoginInput } from "@/lib/schemas/auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Loader2, ShieldCheck } from "lucide-react";

export default function LoginForm() {
  const [isPending, setIsPending] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { username: "", password: "" },
  })

  async function onSubmit(values: LoginInput) {
    setServerError(null);
    setIsPending(true);

    try {
      const result = await signIn("credentials", {
        username: values.username,
        password: values.password,
        // Don't let NextAuth redirect — we handle it ourselves so we can
        // send the user to their tenant subdomain, not just "/dashboard".
        redirect: false,
      })

      if (result?.error) {
        // NextAuth maps authorize()'s null return to "CredentialsSignin"
        setServerError("Invalid email or password")
        return
      }

      if (process.env.NODE_ENV === "development") {
        window.location.href = `http://app.local:3000/redirect-to-tenant`
      } else {
        window.location.href = `https://dentalsaas.com/redirect-to-tenant`
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-brand-100 shadow-xl">
      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
          <ShieldCheck size={30} />
        </div>
        <CardTitle className="text-2xl font-heading">Welcome back</CardTitle>
        <CardDescription>Sign in to manage your dental clinic</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void form.handleSubmit(onSubmit)(e)
            }}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="doctor@example.com"
                        className="pl-10 focus-visible:ring-brand-500"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 focus-visible:ring-brand-500"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {serverError && (
              <p className="text-sm text-destructive">{serverError}</p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-brand-700 hover:bg-brand-800"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}