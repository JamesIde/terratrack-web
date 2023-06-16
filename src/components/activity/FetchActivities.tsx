import { useAuth } from "@clerk/clerk-react";
import { supabase } from "../../lib/supabase";
import { processSupabaseActivities } from "../../utils/processActivities";
import ActivityItem from "./ActivityItem";
import { useEffect, useState } from "react";
import { Activity } from "../../@types/activity";

function FetchActivities() {
  const user = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("activities")
        .select("*")
        .eq("userId", user.userId);

      setActivities(processSupabaseActivities(data));
    };
    fetch();
  }, []);

  return (
    <>
      {activities && activities.length > 0 ? (
        activities?.map((activity) => <ActivityItem activity={activity} />)
      ) : (
        <div>
          <p>No activities found</p>
        </div>
      )}
    </>
  );
}
export default FetchActivities;
