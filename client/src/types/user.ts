export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role?: string[];
  avatar: {
    url: string;
    public_id: string;
  };
  resetPasswordExpire: Date | undefined;
  createdAt: string;
  updatedAt: string;
}
