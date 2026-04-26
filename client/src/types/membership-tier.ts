export type MembershipTierName = "silver" | "gold" | "diamond";

export type MembershipTier = {
  id: string;
  name: MembershipTierName;
  discountPercentage: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};
