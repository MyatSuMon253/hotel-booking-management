import { Promotion } from "../../models/promotion";

export const promotionResolvers = {
  Query: {
    getAllPromotions: async () => {
      return await Promotion.find().sort({ createdAt: -1 });
    },
    getPromotionById: async (
      _: any,
      { promotionId }: { promotionId: string },
    ) => {
      const promotion = await Promotion.findById(promotionId);
      if (!promotion) {
        throw new Error("Promotion not found");
      }
      return promotion;
    },
  },
  Mutation: {
    createPromotion: async (
      _: any,
      { promotionInput }: { promotionInput: any },
    ) => {
      const code = promotionInput.code.trim().toUpperCase();
      const existing = await Promotion.findOne({ code });

      if (existing) {
        throw new Error("Promotion code already exists.");
      }

      await Promotion.create({
        ...promotionInput,
        code,
        active: promotionInput.active ?? true,
        usedCount: 0,
        validFrom: new Date(promotionInput.validFrom),
        validTo: new Date(promotionInput.validTo),
      });

      return true;
    },
    updatePromotion: async (
      _: any,
      {
        promotionId,
        promotionInput,
      }: { promotionId: string; promotionInput: any },
    ) => {
      const promotion = await Promotion.findById(promotionId);
      if (!promotion) {
        throw new Error("Promotion not found");
      }

      if (promotionInput.code) {
        promotionInput.code = promotionInput.code.trim().toUpperCase();
      }

      if (promotionInput.validFrom) {
        promotionInput.validFrom = new Date(promotionInput.validFrom);
      }
      if (promotionInput.validTo) {
        promotionInput.validTo = new Date(promotionInput.validTo);
      }

      promotion.set(promotionInput);
      await promotion.save();

      return true;
    },
    deletePromotion: async (
      _: any,
      { promotionId }: { promotionId: string },
    ) => {
      const promotion = await Promotion.findByIdAndDelete(promotionId);
      if (!promotion) {
        throw new Error("Promotion not found");
      }
      return true;
    },
  },
};
