import { isAuthenticatedVar } from "@/apollo/apollo-vars";
import { Button } from "@/components/ui/button";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { REGISTER_MUTATION } from "@/graphql/mutations/auth";
import { registerSchema } from "@/schema/auth";
import { useMutation, useReactiveVar } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

const RegisterPage = () => {
  const naviagte = useNavigate();
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);

  useEffect(() => {
    if (isAuthenticated) {
      naviagte("/");
    }
  }, [isAuthenticated, naviagte]);

  const [register, { loading, error }] = useMutation(REGISTER_MUTATION, {
    onCompleted() {
      toast.success("Registartion successful.");
      return naviagte("/login");
    },
  });

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    const userInput = {
      email: values.email,
      name: values.name,
      password: values.password,
    };

    try {
      await register({
        variables: { userInput },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // form.reset()
      toast.error(error.message);
    }
  }

  useEffect(() => {
    toast.error(error?.message);
  }, [error]);

  return (
    <section className="layout w-1/4 mt-20">
      <Card>
        <CardHeader>
          <CardTitle>Register new account</CardTitle>
          <CardDescription>
            Create your new account & enojoy our services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Bagan" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                Register
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};

export default RegisterPage;
