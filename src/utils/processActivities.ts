import {
  Activity,
  ActivityMetadata,
  ElevationMetadata,
  Position,
} from "../@types/activity";
import { HCoord, haversineDistance } from "./haversineDistance";
export function processSupabaseActivities(data: any) {
  let activities: Activity[] = [];

  if (data.length === 0) {
    return activities;
  }

  data?.map((activity: any) => {
    activities.push({
      id: activity.id,
      userId: activity.userId!,
      coordinates: JSON.parse(activity.coordinates as string) as number[][],
      metadata: JSON.parse(activity.metadata as string) as ActivityMetadata,
      elevation: JSON.parse(activity.elevation as string) as ElevationMetadata,
      description: activity.description!,
      distance: activity.distance!,
      distancePoints: calculateDistancePoints(
        JSON.parse(activity.coordinates as string) as number[][]
      ),
      duration: activity.duration!,
      startTime: new Date(activity.startTime!),
      endTime: new Date(activity.endTime!),
      type: activity.type!,
      slug: activity.slug!,
    });
  });
  return activities;
}

/**
 * Returns an array of distances which represent the accumulated distance at that index
 * E.g. The 20th elevation point has a current total distance of 1.2km, 30th, 1.3km.
 */
export function calculateDistancePoints(coords: Position[]) {
  //    LNG            LAT
  // [138.7087741, -35.0358758]
  let distArr = Array<number>();
  let currDist = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    const coord1: HCoord = {
      lng: coords[i][0],
      lat: coords[i][1],
    };

    const coord2: HCoord = {
      lng: coords[i + 1][0],
      lat: coords[i + 1][1],
    };
    currDist += haversineDistance(coord1, coord2);
    distArr.push(currDist);
  }

  return distArr;
}
