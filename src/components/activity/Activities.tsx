import { Activity } from "../../@types/activity";
import ActivityItem from "./ActivityItem";

function Activities({ activities }: { activities: Activity[] }) {
  return (
    <div className="pl-4 pr-4">
      {activities.length > 0 ? (
        activities?.map((activity) => (
          <ActivityItem activity={activity} key={activity.id} />
        ))
      ) : (
        <div>
          <p>No activities found</p>
        </div>
      )}
    </div>
  );
}
export default Activities;
