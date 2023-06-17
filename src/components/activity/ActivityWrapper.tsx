import { useEffect, useState } from "react";
import { SignedIn, useAuth } from "@clerk/clerk-react";
import { Activity } from "../../@types/activity";
import { supabase } from "../../lib/supabase";
import { processSupabaseActivities } from "../../utils/processActivities";
import ActivitySearch from "./ActivitySearch";
import Activities from "./Activities";
import Spinner from "../general/Spinner";

function ActivityWrapper() {
  const { isLoaded, userId } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [sort, setSort] = useState("dateadded");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date>();
  useEffect(() => {
    setIsLoading(true);
    if (isLoaded) {
      fetch();
    }
  }, [isLoaded]);

  const fetch = async () => {
    const { data } = await supabase
      .from("activities")
      .select("*")
      .eq("userId", userId);

    setActivities(processSupabaseActivities(data));
    setDate(new Date());
    setIsLoading(false);
  };

  function processActivitySorting() {
    // We could make this a lot more sophisticated, but for now, this will do.
    if (search && search.length > 0) {
      return activities.filter((activity) => {
        return activity.description
          .toLowerCase()
          .includes(search.toLowerCase());
      });
    }

    if (sort === "date") {
      return activities.sort(
        (a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );
    } else if (sort === "distance") {
      return activities.sort((a, b) => b.distance - a.distance);
    } else if (sort === "duration") {
      return activities.sort((a, b) => b.duration - a.duration);
    } else if (sort === "elevationGain") {
      return activities.sort(
        (a, b) => b.elevation.elevationGain - a.elevation.elevationGain
      );
    } else {
      return activities;
    }
  }

  return (
    <div className="mt-20">
      <SignedIn>
        <div className="flex flex-row justify-between sticky top-0 bg-blur p-4">
          <h1 className="font-bold text-2xl">All Activities</h1>
          <div className="w-30">
            <select
              id="sorting"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
          <Activities activities={processActivitySorting()} />
        )}
      </SignedIn>
    </div>
  );
}

export default ActivityWrapper;
