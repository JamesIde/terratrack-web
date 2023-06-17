import { useActivityStore } from "../../stores/activityStore";

function SelectedActivityWrapper() {
  const setStoreActivity = useActivityStore((state) => state.setStoreActivity);
  return (
    <div className="border-2">
      <button
        className="p-2 bg-forest-50 rounded-xl hover:bg-forest-100"
        onClick={() => setStoreActivity(null)}
      >
        <p className="pl-4 pr-4 text-forest-dark font-bold">Go Back</p>
      </button>
    </div>
  );
}
export default SelectedActivityWrapper;
