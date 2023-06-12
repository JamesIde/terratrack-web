import { auth } from "@clerk/nextjs";
import { supabase } from "../../../lib/supabase";
import ActivityItem from "./ActivityItem";
import {
  Activity,
  ActivityMetadata,
  ElevationMetadata,
} from "../../../@types/activity";

async function FetchActivities() {
  const user = auth();

  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("userId", user.userId);

  let activities: Activity[] = [];

  data?.map((activity) => {
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
    });
  });

  return (
    <>
      {activities.length === 0 ? (
        <div>
          <p>No activities found</p>
        </div>
      ) : (
        activities?.map((activity) => <ActivityItem activity={activity} />)
      )}
    </>
  );
}
export default FetchActivities;
