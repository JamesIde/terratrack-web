import { ClerkProvider } from "@clerk/clerk-react";
import "./App.css";
import Mapbox from "./components/core/Mapbox";
import Sidebar from "./components/core/Sidebar";
const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;
function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Wrapper />
    </ClerkProvider>
  );
}

function Wrapper() {
  return (
    <div className="flex bg-[#f2f7fc]">
      <Sidebar />
      <div className="w-full">
        <Mapbox />
      </div>
    </div>
  );
}

export default App;
