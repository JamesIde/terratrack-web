import { useEffect, useState } from "react";
import { SignedIn, useAuth } from "@clerk/clerk-react";
import { Activity } from "../../@types/activity";
import { supabase } from "../../lib/supabase";
import { processSupabaseActivities } from "../../utils/processActivities";
import ActivitySearch from "./ActivitySearch";
import Activities from "./Activities";
import Spinner from "../general/Spinner";
import { processActivitySorting } from "../../utils/processSorting";
import { useActivityStore } from "../../stores/activityStore";
import SelectedActivityWrapper from "../selectedActivity/SelectedActivityWrapper";

function ActivityWrapper() {
  const { isLoaded, userId } = useAuth();

  const storeActivity = useActivityStore((state) => state.storeActivity);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [sort, setSort] = useState("dateadded");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    if (isLoaded) {
      fetch();
    }
  }, [isLoaded]);

  const fetch = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("activities")
      .select("*")
      .eq("userId", userId);

    setActivities(processSupabaseActivities(data));
    setDate(new Date());
    setIsLoading(false);
  };

  return (
    <div className="mt-12">
      <SignedIn>
        {!storeActivity ? (
          <div>
            <div className="flex flex-row justify-between sticky top-0 bg-blur p-4">
              <h1 className="font-bold text-2xl">All Activities</h1>
              <div className="w-30">
                <select
                  id="sorting"
                  className=" text-gray-900 text-sm rounded-md block w-full p-1.5 border-[1px] border-forest-50 "
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="date">Date Added</option>
                  <option value="distance">Distance</option>
                  <option value="duration">Duration</option>
                  <option value="elevationGain">Elevation</option>
                </select>
              </div>
            </div>
            <div>
              <p className="text-sm mt-2 pl-4 pr-4">
                Synced activities from your device will show here
              </p>
              <p className="text-xs pl-4 pr-4 italic">
                Last Refreshed: {date?.toLocaleTimeString("en-AU")}.{" "}
                <span
                  className="font-bold text-blue-500 hover:cursor-pointer"
                  onClick={() => fetch()}
                >
                  Refresh
                </span>
              </p>
            </div>
            <ActivitySearch onChange={setSearch} />
            {isLoading ? (
              <Spinner />
            ) : (
              <Activities
                activities={processActivitySorting(activities, sort, search)}
              />
            )}
          </div>
        ) : (
          <SelectedActivityWrapper activity={storeActivity} />
        )}
      </SignedIn>
    </div>
  );
}

export default ActivityWrapper;
