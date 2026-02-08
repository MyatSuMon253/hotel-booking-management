import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { useMutation, useReactiveVar } from "@apollo/client";
import { FORGET_PASSWORD_MUTATION } from "@/graphql/mutations/user";
import { toast } from "sonner";
import { userInfoVar } from "@/apollo/apollo-vars";
import { useEffect } from "react";

const ForgetPassword = () => {
  const user = useReactiveVar(userInfoVar);

  const [forgetPassword, { loading, error }] = useMutation(
    FORGET_PASSWORD_MUTATION,
    {
      onCompleted: () => {
        toast.success("Password reset mail sent");
      },
    },
  );

  const forgetPasswordHandler = async () => {
    await forgetPassword({ variables: { email: user?.email } });
  };

  useEffect(() => {
    toast.error(error?.message);
  }, [error]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password Recovery</CardTitle>
        <CardDescription>
          You must access your registered email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={forgetPasswordHandler} disabled={loading}>
          Forget Password
        </Button>
      </CardContent>
    </Card>
  );
};

export default ForgetPassword;
