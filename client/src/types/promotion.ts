export type Promotion = {
  id: string;
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  validFrom: string;
  validTo: string;
  active: boolean;
  maxUses?: number;
  usedCount: number;
  createdAt: string;
  updatedAt: string;
};
