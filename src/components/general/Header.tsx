import { SignedIn, UserButton } from "@clerk/clerk-react";
function Header() {
  return (
    <>
      <div className="flex justify-between pl-5 pr-5 pt-3">
        <a
          className="text-sm font-semibold text-gray-600 hover:text-forest-dark duration-500"
          href=""
          target="_#"
        >
          APP
        </a>
        <a
          className="text-sm font-semibold text-gray-600 hover:text-forest-dark duration-500"
          href=""
          target="_#"
        >
          PRIVACY
        </a>

        <a
          className="text-sm font-semibold text-gray-600 hover:text-forest-dark duration-500"
          href=""
          target="_#"
        >
          CONTACT
        </a>
      </div>
      <div className="flex flex-row justify-between mt-5 mx-5">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
          <button className="pl-3 pr-3 pt-2 pb-1 rounded-xl bg-forest-50 hover:bg-forest-100 font-bold text-forest-dark">
            Add Route
          </button>
        </SignedIn>
      </div>
    </>
  );
}
export default Header;
