import { Activity } from "../../@types/activity";
import { useActivityStore } from "../../stores/activityStore";
import { SlArrowLeft } from "react-icons/sl";
import { HiDownload } from "react-icons/hi";
import { processDistance } from "../../utils/processDistance";
import { formatShortFormTime } from "../../utils/processTime";
import {
  formatElevation,
  processElevation,
} from "../../utils/processElevation";
function SelectedActivityWrapper({ activity }: { activity: Activity }) {
  console.log(activity);
  const setStoreActivity = useActivityStore((state) => state.setStoreActivity);
  return (
    <>
      <div className="flex justify-between p-4 border-b-[1px] border-b-gray-400">
        <button className="font-bold" onClick={() => setStoreActivity(null)}>
          <SlArrowLeft className="inline-block mr-2 text-xs mb-1" />
          Activities
        </button>
        <button
          className="p-2 bg-forest-50 rounded-xl hover:bg-forest-100
        text-forest-dark font-bold"
        >
          <HiDownload className="inline-block mr-2 text-md mb-1" />
          Download GPX
        </button>
      </div>
      <div>
        <header>
          <h1 className="font-bold text-black text-2xl text-center mt-4">
            {activity.description}
          </h1>
          <hr
            style={{
              backgroundColor: activity.metadata.color,
              height: 4,
              width: "60%",
              margin: "auto",
            }}
          />
        </header>
        <section>
          <p className="mt-2 font-semibold text-gray-700 text-center">
            {new Date(activity.startTime).toLocaleDateString("en-au", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <div className="pl-4 pr-4 mt-2">
            <div className="flex flex-row justify-evenly mt-2 mb-5 gap-5">
              <div className="p-2 border-[1px] rounded-lg border-gray-400 w-full">
                <p className="text-md font-semibold text-gray-700 text-center">
                  DISTANCE
                </p>
                <p className="text-md text-center">
                  {" "}
                  {processDistance(activity.distance)}
                </p>
              </div>
              <div className="p-2 border-[1px] rounded-lg border-gray-400 w-full">
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
              <div className="p-2 border-[1px] rounded-lg border-gray-400 w-full">
                <p className="text-md font-semibold text-gray-700 text-center">
                  CATEGORY
                </p>
                <p className="text-md text-center"> {activity.type}</p>
              </div>
              <div className="p-2 border-[1px] rounded-lg border-gray-400 w-full">
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
