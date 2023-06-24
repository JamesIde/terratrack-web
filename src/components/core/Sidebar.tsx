import { useActivityStore } from "../../stores/activityStore";
import ActivityWrapper from "../activity/ActivityWrapper";
import AuthButtons from "../general/AuthButtons";
import Header from "../general/Header";
import Title from "../general/Title";

function Sidebar() {
  const storeActivity = useActivityStore((state) => state.storeActivity);

  return (
    <aside className="">
      <Header />
      {!storeActivity && (
        <>
          <Title />
          <AuthButtons />
        </>
      )}
      <ActivityWrapper />
    </aside>
  );
}
export default Sidebar;
