export interface TouristAttraction {
  readonly id: string;
  readonly rank: number;
  readonly name: string;
  readonly imageUrl: string;
  readonly category: string;
  readonly location: string;
  readonly distanceFromDowntown: string;
  readonly rating?: number;
  readonly reviewCount?: number;
  readonly isFreeEntry?: boolean;
  readonly openingNote?: string;
  readonly highlights: readonly string[];
  readonly tripUrl: string;
}
