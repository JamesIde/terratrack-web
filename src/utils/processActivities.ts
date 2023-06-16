import {
  Activity,
  ActivityMetadata,
  ElevationMetadata,
} from "../@types/activity";

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
      duration: activity.duration!,
      startTime: new Date(activity.startTime!),
      endTime: new Date(activity.endTime!),
      type: activity.type!,
      slug: activity.slug!,
    });
  });
  return activities;
}
