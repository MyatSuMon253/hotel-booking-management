export type MembershipTierName = "silver" | "gold" | "diamond";

export interface IMembershipTier {
  id: string;
  name: MembershipTierName;
  discountPercentage: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MembershipTierInput {
  name: MembershipTierName;
  discountPercentage: number;
  active?: boolean;
}

export type UpdateMembershipTierInput = Partial<MembershipTierInput>;
