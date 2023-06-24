import { ClerkProvider } from "@clerk/clerk-react";
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
    <>
      <div className="flex bg-[#f2f7fc]">
        {/* When screen is smaller than sm, the side bar is the full width */}
        <div className="w-full sm:w-[400px] h-screen overflow-y-auto">
          <Sidebar />
        </div>
        <div className="hidden sm:block w-auto flex-grow">
          <Mapbox />
        </div>
      </div>
    </>
  );
}

export default App;
