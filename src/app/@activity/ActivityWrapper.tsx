import { Suspense } from "react";
import ActivityHeader from "./ActivityHeader";
import ActivitySearch from "./ActivitySearch";
import FetchActivities from "./FetchActivities";

/**
 * A wrapper component for all Activity components.
 */
function ActivityWrapper() {
  return (
    <div className="mt-24 ml-6 mr-6">
      <ActivityHeader />
      <ActivitySearch />
      <Suspense fallback={<p>loading...</p>}>
        <FetchActivities />
      </Suspense>
    </div>
  );
}
export default ActivityWrapper;
