import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { resetPasswordSchema } from "@/schema/user";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation } from "@apollo/client";
import { RESET_PASSWORD_MUTATION } from "@/graphql/mutations/user";
import { Button } from "../ui/button";
import { CURRENT_USER } from "@/graphql/queries/user";
import { useNavigate, useParams } from "react-router";

const ResetPasswordPage = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD_MUTATION, {
    onCompleted: () => {
      toast.success("Password reset successfully.");
      navigate("/");
    },
    refetchQueries: [CURRENT_USER],
  });

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    const userInput = {
      newPassword: values.newPassword,
      confirmNewPassword: values.confirmNewPassword,
    };
    console.log(userInput);

    try {
      await resetPassword({
        variables: {
          token: params.token,
          newPassword: userInput.newPassword,
          confirmNewPassword: userInput.confirmNewPassword,
        },
      });
    } catch (err: any) {
      toast.error(err.message.split(":")[1]);
    } finally {
      form.reset();
    }
  }
  return (
    <main className="layout space-y-4 mb-4">
      <Card>
        <CardHeader>
          <CardTitle>Reset New Password</CardTitle>
          <CardDescription>Don't forget your new password!</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormDescription>Enter your new password.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormDescription>
                      Re-enter your new password.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating ..." : "Update password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
};

export default ResetPasswordPage;
