import { SignedIn, UserButton } from "@clerk/clerk-react";
import { BiPlus } from "react-icons/bi";
function Header() {
  return (
    <div className="h-16 flex flex-row justify-between p-5">
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
        <button className="bg-red-400 rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-900 duration-500">
          <BiPlus className="text-white text-xl font-bold" />
        </button>
      </SignedIn>
    </div>
  );
}
export default Header;
