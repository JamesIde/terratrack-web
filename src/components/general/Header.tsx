import { SignedIn, UserButton } from "@clerk/clerk-react";
import { CONFIG } from "../../config/config";
function Header() {
  return (
    <>
      <div className="flex justify-between pl-5 pr-5 pt-3">
        <a
          className="text-sm font-semibold text-gray-600 hover:text-forest-dark duration-500 cursor-pointer"
          onClick={() => {
            if (document) {
              (
                document.getElementById("my_modal_1") as HTMLFormElement
              ).showModal();
            }
          }}
          target="_#"
        >
          APP
        </a>
        <a
          className="text-sm font-semibold text-gray-600 hover:text-forest-dark duration-500 cursor-pointer"
          href={CONFIG.PRIVACY.URL}
          target="_#"
        >
          PRIVACY
        </a>

        <a
          className="text-sm font-semibold text-gray-600 hover:text-forest-dark duration-500"
          href="mailto:james.ide775@gmail.com"
          target="_#"
        >
          CONTACT
        </a>
      </div>
      <div className="flex flex-row justify-between mt-5 mx-5">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
          <button
            className="pl-3 pr-3 pt-2 pb-1 rounded-xl bg-forest-50 hover:bg-forest-100 font-bold text-forest-dark"
            onClick={() => {
              if (document) {
                (
                  document.getElementById("my_modal_1") as HTMLFormElement
                ).showModal();
              }
            }}
          >
            Add Route
          </button>
        </SignedIn>
      </div>
      <dialog id="my_modal_1" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg text-center">Terratrack App</h3>
          <p className="py-4">
            Terratrack app is coming soon for Android. Stay tuned.
          </p>
          <div className="modal-action">
            <button className="btn">Close</button>
          </div>
        </form>
      </dialog>
    </>
  );
}
export default Header;
