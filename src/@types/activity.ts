export interface Activity {
  description: string;
  type: string;
  duration: number;
  startTime: Date;
  endTime: Date;
  distance: number;
  coordinates: Position[];
  id: string;
  userId?: string;
  metadata: ActivityMetadata;
  elevation: ElevationMetadata;
  slug: string;
}

export type Position = [number, number] | number[];

export interface ActivityMetadata {
  color: string;
}

export interface ElevationMetadata {
  maxElevation: number;
  minElevation: number;
  elevationGain: number;
  elevationPoints: number[];
}
