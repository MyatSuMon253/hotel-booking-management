import {
  MembershipTier,
  MEMBERSHIP_TIER_NAMES,
  ensureDefaultMembershipTiers,
} from "../../models/membershipTier";
import {
  MembershipTierInput,
  MembershipTierName,
  UpdateMembershipTierInput,
} from "../../types/membershipTier";

const normalizeTierName = (name: string) => name.trim().toLowerCase();

const assertValidTierName = (name: string) => {
  if (!MEMBERSHIP_TIER_NAMES.includes(name as MembershipTierName)) {
    throw new Error("Membership tier must be silver, gold, or diamond.");
  }
};

export const membershipTierResolvers = {
  Query: {
    getAllMembershipTiers: async () => {
      await ensureDefaultMembershipTiers();
      return await MembershipTier.find().sort({ discountPercentage: 1 });
    },
    getMembershipTierById: async (
      _: unknown,
      { membershipTierId }: { membershipTierId: string },
    ) => {
      const membershipTier = await MembershipTier.findById(membershipTierId);
      if (!membershipTier) {
        throw new Error("Membership tier not found");
      }
      return membershipTier;
    },
  },
  Mutation: {
    createMembershipTier: async (
      _: unknown,
      { membershipTierInput }: { membershipTierInput: MembershipTierInput },
    ) => {
      const name = normalizeTierName(membershipTierInput.name);
      assertValidTierName(name);

      const existing = await MembershipTier.findOne({ name });
      if (existing) {
        throw new Error("Membership tier already exists.");
      }

      await MembershipTier.create({
        ...membershipTierInput,
        name,
        active: membershipTierInput.active ?? true,
      });

      return true;
    },
    updateMembershipTier: async (
      _: unknown,
      {
        membershipTierId,
        membershipTierInput,
      }: {
        membershipTierId: string;
        membershipTierInput: UpdateMembershipTierInput;
      },
    ) => {
      const membershipTier = await MembershipTier.findById(membershipTierId);
      if (!membershipTier) {
        throw new Error("Membership tier not found");
      }

      if (membershipTierInput.name) {
        const name = normalizeTierName(membershipTierInput.name);
        assertValidTierName(name);
        membershipTierInput.name = name as UpdateMembershipTierInput["name"];
      }

      membershipTier.set(membershipTierInput);
      await membershipTier.save();

      return true;
    },
    deleteMembershipTier: async (
      _: unknown,
      { membershipTierId }: { membershipTierId: string },
    ) => {
      const membershipTier = await MembershipTier.findByIdAndDelete(
        membershipTierId,
      );
      if (!membershipTier) {
        throw new Error("Membership tier not found");
      }
      return true;
    },
  },
};
