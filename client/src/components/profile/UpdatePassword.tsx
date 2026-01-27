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
import { updateUserPasswordSchema } from "@/schema/user";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation } from "@apollo/client";
import { UPDATE_USER_PASSWORD_MUTATION } from "@/graphql/mutations/user";
import { Button } from "../ui/button";
import { CURRENT_USER } from "@/graphql/queries/user";

const UpdatePassword = () => {
  const form = useForm<z.infer<typeof updateUserPasswordSchema>>({
    resolver: zodResolver(updateUserPasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [updateUserPassword, { loading }] = useMutation(
    UPDATE_USER_PASSWORD_MUTATION,
    {
      onCompleted: () => {
        toast.success("Password updated successfully.");
      },
      refetchQueries: [CURRENT_USER],
    },
  );

  async function onSubmit(values: z.infer<typeof updateUserPasswordSchema>) {
    const userInput = {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    };
    console.log(userInput);

    try {
      await updateUserPassword({
        variables: {
          oldPassword: userInput.oldPassword,
          newPassword: userInput.newPassword,
        },
      });
    } catch (err: any) {
      toast.error(err.message.split(":")[1]);
    } finally {
      form.reset();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Password</CardTitle>
        <CardDescription>Don't forget your new password!</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormDescription>Enter your old password.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormDescription>Re-enter your new password.</FormDescription>
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
  );
};

export default UpdatePassword;
