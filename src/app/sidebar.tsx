import { SignedOut, SignInButton, auth, SignUpButton } from "@clerk/nextjs";
import Header from "./components/Header";
import Title from "./components/Title";
import AuthButtons from "./components/AuthButtons";
import Activity from "./@activity/Activity";

function Sidebar() {
  const user = auth();
  return (
    <aside className="w-[500px] h-screen">
      <Header />
      <Title />
      <AuthButtons />
      <Activity />
    </aside>
  );
}
export default Sidebar;
