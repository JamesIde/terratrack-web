import { Activity } from "../../@types/activity";
import { useActivityStore } from "../../stores/activityStore";
import { SlArrowLeft } from "react-icons/sl";
import { processDistance } from "../../utils/processDistance";
import { formatShortFormTime } from "../../utils/processTime";
import { formatElevation } from "../../utils/processElevation";
import ElevationChart from "./ElevationChart";
import useMobile from "../../hooks/useMobile";
import MapboxMobile from "../core/MapboxMobile";
function SelectedActivityWrapper({ activity }: { activity: Activity }) {
  const setStoreActivity = useActivityStore((state) => state.setStoreActivity);
  const isMobile = useMobile();
  return (
    <>
      <div className="flex justify-between p-4 border-b-[1px] border-b-gray-300">
        <button
          className="p-2 bg-forest-50 rounded-xl hover:bg-forest-100
        text-forest-dark font-bold"
          onClick={() => setStoreActivity(null)}
        >
          <SlArrowLeft className="inline-block mr-2 text-xs mb-1" />
          Go Back
        </button>
      </div>
      <div>
        <header>
          <h1 className="font-bold text-black text-2xl text-center mt-4 mb-1">
            {activity.description}
          </h1>
          <hr
            style={{
              backgroundColor: activity.metadata.color,
              height: 4,
              width: "60%",
              margin: "auto",
              borderRadius: 10,
            }}
          />
        </header>
        <p>
          <p className="mt-2 font-semibold text-gray-700 text-center">
            {new Date(activity.startTime).toLocaleDateString("en-au", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </p>
        <section>
          <div className="ml-4 mr-4 border-[1px] rounded-lg border-gray-300 mt-2 mb-5">
            {isMobile && <MapboxMobile activity={activity} />}
          </div>
        </section>
        <section>
          <ElevationChart activity={activity} />
        </section>
        <section>
          <div className="pl-4 pr-4">
            <div className="flex flex-row justify-evenly mt-2 mb-5 gap-5">
              <div className="p-2 border-[1px] rounded-lg border-gray-300 w-full">
                <p className="text-md font-semibold text-gray-700 text-center">
                  DISTANCE
                </p>
                <p className="text-md text-center">
                  {" "}
                  {processDistance(activity.distance)}
                </p>
              </div>
              <div className="p-2 border-[1px] rounded-lg border-gray-300 w-full">
                <p className="text-md font-semibold text-gray-700 text-center">
                  DURATION
                </p>
                <p className="text-md text-center">
                  {" "}
                  {formatShortFormTime(activity.duration)}
                </p>
              </div>
            </div>
            <div className="flex flex-row justify-evenly mt-2 mb-2 gap-5">
              <div className="p-2 border-[1px] rounded-lg border-gray-300 w-full">
                <p className="text-md font-semibold text-gray-700 text-center">
                  CATEGORY
                </p>
                <p className="text-md text-center"> {activity.type}</p>
              </div>
              <div className="p-2 border-[1px] rounded-lg border-gray-300 w-full">
                <p className="text-md font-semibold text-gray-700 text-center">
                  ELEVATION GAIN
                </p>
                <p className="text-md text-center">
                  {" "}
                  {formatElevation(activity.elevation.elevationGain)}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
export default SelectedActivityWrapper;
