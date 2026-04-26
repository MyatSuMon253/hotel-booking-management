import AvatarUpload from "../profile/AvatarUpload";
import ForgetPassword from "../profile/ForgetPassword";
import UpdatePassword from "../profile/UpdatePassword";
import UserInfo from "../profile/UserInfo";

const ProfilePage = () => {
  return (
    <main className="mb-4 space-y-4">
      <AvatarUpload />
      <UserInfo />
      <UpdatePassword />
      <ForgetPassword />
    </main>
  );
};

export default ProfilePage;
