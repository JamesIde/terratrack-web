import { SignedIn, UserButton } from "@clerk/clerk-react";
function Header() {
  return (
    <div className="flex flex-row justify-between mt-5 mx-5">
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
        <button className="p-2 rounded-xl bg-forest-50 hover:bg-forest-100 font-bold text-forest-dark">
          Add Route
        </button>
      </SignedIn>
    </div>
  );
}
export default Header;