import ActivityWrapper from "../activity/ActivityWrapper";
import AuthButtons from "../general/AuthButtons";
import Header from "../general/Header";
import Title from "../general/Title";

function Sidebar() {
  return (
    <aside className="w-[500px] h-screen overflow-y-auto">
      <Header />
      <Title />
      <AuthButtons />
      <ActivityWrapper />
    </aside>
  );
}
export default Sidebar;
