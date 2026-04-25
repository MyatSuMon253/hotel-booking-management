export type PromotionType = "percentage" | "fixed";

export interface IPromotion {
  id: string;
  code: string;
  description?: string;
  discountType: PromotionType;
  discountValue: number;
  validFrom: Date;
  validTo: Date;
  active: boolean;
  maxUses?: number;
  usedCount: number;
  applicableRooms?: string[];
  createdAt: string;
  updatedAt: string;
}

export type PromotionInput = {
  code: string;
  description?: string;
  discountType: PromotionType;
  discountValue: number;
  validFrom: Date;
  validTo: Date;
  active?: boolean;
  maxUses?: number;
  applicableRooms?: string[];
};

export type UpdatePromotionInput = Partial<PromotionInput>;
