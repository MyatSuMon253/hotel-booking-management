import { useEffect } from "react";
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
import { updateUserInfoSchema } from "@/schema/user";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useReactiveVar } from "@apollo/client";
import { UPDATE_USER_INFO_MUTATION } from "@/graphql/mutations/user";
import { Button } from "../ui/button";
import { userInfoVar } from "@/apollo/apollo-vars";
import { CURRENT_USER } from "@/graphql/queries/user";

const UserInfo = () => {
  const user = useReactiveVar(userInfoVar);

  useEffect(() => {
    if (user) {
      form.setValue("email", user.email);
      form.setValue("name", user.name);
    }
  }, [user]);

  const [updateUserInfo, { loading }] = useMutation(UPDATE_USER_INFO_MUTATION, {
    onCompleted() {
      toast.success("User information updated successfully.");
    },
    refetchQueries: [CURRENT_USER],
  });

  const form = useForm<z.infer<typeof updateUserInfoSchema>>({
    resolver: zodResolver(updateUserInfoSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof updateUserInfoSchema>) {
    const userInput = {
      email: values.email,
      name: values.name,
    };

    console.log(userInput);
    try {
      await updateUserInfo({
        variables: { userInfo: userInput },
      });
    } catch (err: any) {
      toast.error(err.message.split(":")[1]);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Information</CardTitle>
        <CardDescription>View and update your information</CardDescription>
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
                    <Input {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This is primary email address.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "updating ..." : "Update"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
