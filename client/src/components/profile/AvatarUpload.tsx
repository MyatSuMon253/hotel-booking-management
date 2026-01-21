import { AvatarImage } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useEffect, useState, type ChangeEvent } from "react";
import { useMutation, useReactiveVar } from "@apollo/client";
import { userInfoVar } from "@/apollo/apollo-vars";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AVATAR_UPLOAD_MUTATION } from "@/graphql/mutations/user";
import { toast } from "sonner";
import { CURRENT_USER } from "@/graphql/queries/user";

const AvatarUpload = () => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const user = useReactiveVar(userInfoVar);

  const [avatarUpload, { loading, error }] = useMutation(
    AVATAR_UPLOAD_MUTATION,
    {
      onCompleted: () => {
        toast.success("Avatar uploaded successfully");
      },
      refetchQueries: [CURRENT_USER],
    },
  );

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result as string);
      }
    };

    reader.readAsDataURL(e.target.files![0]);
  };

  const onSubmitHandler = async () => {
    console.log("onsubmit");
    await avatarUpload({
      variables: { image: avatar },
    });
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
    console.log(error);
  }, [error]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Avatar</CardTitle>
        <CardDescription>upload your profile photo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <Avatar className="w-16 h-16">
              <AvatarImage src={avatar ? avatar : user?.avatar.url} />
              <AvatarFallback className="bg-black text-white font-bold">
                {user?.name.substring(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <Input
              id="avatar"
              type="file"
              accept="images/*"
              onChange={onChangeHandler}
              className="mt-2"
            />
          </div>
          <Button
            type="submit"
            disabled={loading || !avatar}
            onClick={onSubmitHandler}
          >
            {loading ? "Loading..." : "Upload"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvatarUpload;
