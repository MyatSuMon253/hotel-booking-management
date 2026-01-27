import AvatarUpload from "../profile/AvatarUpload";
import UpdatePassword from "../profile/UpdatePassword";
import UserInfo from "../profile/UserInfo";

const ProfilePage = () => {
  return (
    <main className="layout space-y-4 mb-4">
      <AvatarUpload />
      <UserInfo />
      <UpdatePassword />
    </main>
  );
};

export default ProfilePage;
