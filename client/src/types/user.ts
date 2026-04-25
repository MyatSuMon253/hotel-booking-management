export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  password: string;
  role?: string[];
  isActive: boolean;
  membershipTier?: "silver" | "gold" | "diamond";
  avatar: {
    url: string;
    public_id: string;
  };
  resetPasswordExpire: Date | undefined;
  createdAt: string;
  updatedAt: string;
}
