import { SignedOut, SignInButton, auth, SignUpButton } from "@clerk/nextjs";
import Header from "./components/Header";
import Title from "./components/Title";
import AuthButtons from "./components/AuthButtons";
import ActivityWrapper from "./@activity/ActivityWrapper";

function Sidebar() {
  return (
    <aside className="w-[500px] h-screen">
      <Header />
      <Title />
      <AuthButtons />
      <ActivityWrapper />
    </aside>
  );
}
export default Sidebar;
