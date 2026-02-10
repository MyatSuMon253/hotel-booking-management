import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useMutation, useReactiveVar } from "@apollo/client";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { CURRENT_USER } from "@/graphql/queries/user";
import { isAuthenticatedVar } from "@/apollo/apollo-vars";
import { useEffect } from "react";
import { forgetPassword as forgetPasswordType } from "@/schema/user";
import { FORGET_PASSWORD_MUTATION } from "@/graphql/mutations/user";

const ForgetPasswordPage = () => {
  const naviagte = useNavigate();
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);

  useEffect(() => {
    if (isAuthenticated) naviagte("/");
  }, [isAuthenticated]);

  const [forgetPassword, { loading }] = useMutation(FORGET_PASSWORD_MUTATION, {
    onCompleted() {
      toast.success("Password reset email sent!");
    },
    refetchQueries: [CURRENT_USER],
  });

  const form = useForm<z.infer<typeof forgetPasswordType>>({
    resolver: zodResolver(forgetPasswordType),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof forgetPasswordType>) {
    const email = values.email;
    try {
      await forgetPassword({
        variables: { email },
      });
    } catch (err: any) {
      console.log(err.message);
      toast.error(
        err.message.includes(":") ? err.message.split(":")[1] : err.message,
      );
    }
  }

  return (
    <section className="layout w-1/4 mt-20">
      <Card>
        <CardHeader>
          <CardTitle>Password Recovery</CardTitle>
          <CardDescription>Just know your email ?; Don't worry</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@baganhotel.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is primary email address.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "loading ..." : "Reset Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};

export default ForgetPasswordPage;
