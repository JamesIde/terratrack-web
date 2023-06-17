import { Activity } from "../../@types/activity";
import { useActivityStore } from "../../stores/activityStore";
import { processDistance } from "../../utils/processDistance";
import { formatElevation } from "../../utils/processElevation";
import { formatShortFormTime } from "../../utils/processTime";
import { HiArrowRight } from "react-icons/hi";
function ActivityItem({ activity }: { activity: Activity }) {
  const setStoreActivity = useActivityStore((state) => state.setStoreActivity);
  return (
    <div
      className="mb-5 border-[1px] border-gray-300 rounded-md hover:cursor-pointer hover:border-gray-400 duration-500 pl-2 pr-2 pt-2"
      onClick={() => setStoreActivity(activity)}
    >
      <div className="flex flex-row gap-2">
        <div
          style={{
            marginTop: 5,
            padding: 8,
            marginLeft: 5,
            marginRight: 5,
            backgroundColor: activity.metadata.color,
            borderRadius: 500,
            width: 10,
            height: 10,
          }}
        />
        <div className="w-full flex items-center justify-between">
          <h3 className="font-semibold text-md">{activity.description}</h3>
          <HiArrowRight />
        </div>
      </div>
      <section>
        <div className="flex flex-row justify-between mt-2 mb-2">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-gray-700">DISTANCE</p>
            <p className="text-xs text-center">
              {processDistance(activity.distance)}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-gray-700">DURATION</p>
            <p className="text-xs text-center">
              {formatShortFormTime(activity.duration)}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-gray-700">GAIN</p>
            <p className="text-xs text-center">
              {formatElevation(activity.elevation.elevationGain ?? 0)}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-gray-700">LOSS</p>
            <p className="text-xs text-center">
              {formatElevation(activity.elevation.minElevation ?? 0)}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
export default ActivityItem;
