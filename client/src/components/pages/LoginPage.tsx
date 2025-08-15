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
import { LOGIN_MUTATION } from "@/graphql/mutations/auth";
import { CURRENT_USER } from "@/graphql/queries/user";
import { loginSchema } from "@/schema/auth";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const LoginPage = () => {
  const naviagte = useNavigate();

  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted() {
      toast.success("Login successful.");
      return naviagte("/");
    },
    refetchQueries: [CURRENT_USER],
  });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const email = values.email;
    const password = values.password;
    try {
      await login({
        variables: { email, password },
      });
    } catch (err: any) {
      form.reset()
      console.log(err.message);
      toast.error(
        err.message.includes(":") ? err.message.split(":")[1] : err.message
      );
    }
  }

  return (
    <section className="layout w-1/4 mt-20">
      <Card>
        <CardHeader>
          <CardTitle>Login to account</CardTitle>
          <CardDescription>
            Login your existing account form here
          </CardDescription>
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormDescription>
                      <Link
                        to={"/reset"}
                        className="text-xs font-medium text-gray-500 underline"
                      >
                        Forgot password?
                      </Link>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};

export default LoginPage;
