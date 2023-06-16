import { Suspense, useState } from "react";
import ActivitySearch from "./ActivitySearch";
import FetchActivities from "./FetchActivities";
import { SignedIn } from "@clerk/clerk-react";

/**
 * A wrapper component for all Activity components.
 */
function ActivityWrapper() {
  // const [sort, setSort] = useState("dateadded");

  // function sortData(a: any, b: any) {
  //   if (sort === "dateadded") {
  //     return b.dateAdded - a.dateAdded;
  //   }
  //   if (sort === "distance") {
  //     return b.distance - a.distance;
  //   }
  //   if (sort === "duration") {
  //     return b.duration - a.duration;
  //   }
  //   if (sort === "elevation") {
  //     return b.elevation - a.elevation;
  //   }
  // }

  return (
    <div className="mt-24 ml-6 mr-6">
      <SignedIn>
        <div className="flex flex-row justify-between">
          <h1 className="font-bold text-2xl">All Activities</h1>
          <div className="w-30">
            <select
              id="sorting"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option selected>Sort By</option>
              <option value="dateadded">Date Added</option>
              <option value="distance">Distance</option>
              <option value="duration">Duration</option>
              <option value="elevation">Elevation</option>
            </select>
          </div>
        </div>
        <div>
          <p className="text-sm mt-2">
            Activities uploaded from your phone will show here
          </p>
        </div>
        <ActivitySearch />
        <FetchActivities />
      </SignedIn>
    </div>
  );
}
export default ActivityWrapper;
