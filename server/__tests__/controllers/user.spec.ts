import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../models/user";
import {
  deleteUserById,
  forgetPassword,
  getAllUsers,
  getUserById,
  login,
  register,
  resetPassword,
  updateUserPassword,
  updateUserProfile,
  uploadAvatar,
  validateReferralCode,
} from "../../controllers/user";
import { deleteImage, uploadSingleImage } from "../../utils/cloudinary";
import { sendEmail } from "../../utils/sendEmail";
import { createMockQuery } from "../../test/helpers/mock-queries";
import { createUser } from "../../test/helpers/factories";

jest.mock("../../models/user", () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

jest.mock("../../utils/cloudinary", () => ({
  uploadSingleImage: jest.fn(),
  deleteImage: jest.fn(),
}));

jest.mock("../../utils/sendEmail", () => ({
  sendEmail: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("user controller", () => {
  test("register creates a new user", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    const created = createUser();
    (User.create as jest.Mock).mockResolvedValue(created);

    const result = await register({
      name: "Alice",
      email: "alice@example.com",
      password: "password123",
    } as any);

    expect(User.create).toHaveBeenCalledWith({
      name: "Alice",
      email: "alice@example.com",
      password: "password123",
    });
    expect(result).toBe(created);
  });

  test("register rejects duplicate user", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(createUser());

    await expect(
      register({ email: "alice@example.com" } as any),
    ).rejects.toThrow("User already exists");
  });

  test("login sets auth cookie on success", async () => {
    const user = createUser();
    const query = createMockQuery(user);
    (User.findOne as jest.Mock).mockReturnValue(query);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("signed-token");
    const res = { cookie: jest.fn() } as any;

    const result = await login("alice@example.com", "password123", res);

    expect(query.select).toHaveBeenCalledWith("+password");
    expect(res.cookie).toHaveBeenCalledWith(
      "token",
      "signed-token",
      expect.objectContaining({ httpOnly: true }),
    );
    expect(result).toBe(user);
  });

  test("login rejects invalid password", async () => {
    const user = createUser();
    (User.findOne as jest.Mock).mockReturnValue(createMockQuery(user));
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      login("alice@example.com", "bad-password", { cookie: jest.fn() } as any),
    ).rejects.toThrow("Invaild Email or Password.");
  });

  test("uploadAvatar replaces existing avatar", async () => {
    const user = createUser({ avatar: { public_id: "old-id" } });
    (User.findById as jest.Mock).mockResolvedValue(user);
    (uploadSingleImage as jest.Mock).mockResolvedValue({
      img_url: "https://example.com/avatar.jpg",
      public_id: "new-id",
    });
    (deleteImage as jest.Mock).mockResolvedValue(true);

    const result = await uploadAvatar("base64-image", "user-1");

    expect(uploadSingleImage).toHaveBeenCalledWith(
      "base64-image",
      "baganhotel/avatar",
    );
    expect(deleteImage).toHaveBeenCalledWith("old-id");
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith("user-1", {
      avatar: {
        url: "https://example.com/avatar.jpg",
        public_id: "new-id",
      },
    });
    expect(result).toBe(true);
  });

  test("updateUserProfile saves the user", async () => {
    const user = createUser();
    (User.findById as jest.Mock).mockResolvedValue(user);

    const result = await updateUserProfile({ name: "Updated" }, "user-1");

    expect(user.set).toHaveBeenCalledWith({ name: "Updated" });
    expect(user.save).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  test("getAllUsers ensures member referral codes", async () => {
    const memberWithoutCode = createUser({
      membershipTier: "silver",
      referralCode: undefined,
    });
    const query = createMockQuery([createUser()]);
    (User.find as jest.Mock)
      .mockResolvedValueOnce([memberWithoutCode])
      .mockReturnValueOnce(query);

    const result = await getAllUsers();

    expect(memberWithoutCode.save).toHaveBeenCalled();
    expect(query.sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(result).toEqual([expect.any(Object)]);
  });

  test("getUserById saves member without referral code", async () => {
    const user = createUser({ membershipTier: "gold", referralCode: undefined });
    (User.findById as jest.Mock).mockResolvedValue(user);

    const result = await getUserById("user-1");

    expect(user.save).toHaveBeenCalled();
    expect(result).toBe(user);
  });

  test("validateReferralCode returns owner details", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(createUser({ name: "Bob" }));

    const result = await validateReferralCode("  abcd12 ");

    expect(User.findOne).toHaveBeenCalledWith(
      expect.objectContaining({ referralCode: "ABCD12" }),
    );
    expect(result).toEqual({ isValid: true, ownerName: "Bob" });
  });

  test("updateUserPassword verifies old password and saves", async () => {
    const user = createUser();
    const query = createMockQuery(user);
    (User.findById as jest.Mock).mockReturnValue(query);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await updateUserPassword("old-pass", "new-pass", "user-1");

    expect(query.select).toHaveBeenCalledWith("+password");
    expect(user.password).toBe("new-pass");
    expect(user.save).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  test("forgetPassword sends reset email", async () => {
    const user = createUser();
    (User.findOne as jest.Mock).mockResolvedValue(user);
    (sendEmail as jest.Mock).mockResolvedValue(true);

    const result = await forgetPassword("alice@example.com");

    expect(user.generatePasswordResetToken).toHaveBeenCalled();
    expect(user.save).toHaveBeenCalled();
    expect(sendEmail).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  test("resetPassword updates password for valid token", async () => {
    const user = createUser();
    (User.findOne as jest.Mock).mockResolvedValue(user);

    const result = await resetPassword("raw-token", "new-pass", "new-pass");

    expect(user.password).toBe("new-pass");
    expect((user as any).resetPasswordToken).toBeUndefined();
    expect((user as any).resetPasswordExpire).toBeUndefined();
    expect(user.save).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  test("deleteUserById returns true when record exists", async () => {
    (User.findByIdAndDelete as jest.Mock).mockResolvedValue(createUser());

    await expect(deleteUserById("user-1")).resolves.toBe(true);
  });
});
