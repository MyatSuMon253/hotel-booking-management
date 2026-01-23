import AvatarUpload from "../profile/AvatarUpload";
import UserInfo from "../profile/UserInfo";

const ProfilePage = () => {
  return (
    <main className="layout space-y-4 mb-4">
      <AvatarUpload />
      <UserInfo />
    </main>
  );
};

export default ProfilePage;
