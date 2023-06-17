import { SignedOut, SignInButton } from "@clerk/clerk-react";

function AuthButtons() {
  return (
    <SignedOut>
      <div className="flex justify-center mt-24">
        <SignInButton mode="modal" redirectUrl="/">
          <button className="p-2 bg-forest-50 rounded-xl hover:bg-forest-100">
            <p className="pl-8 pr-8 text-forest-dark font-bold">Login</p>
          </button>
        </SignInButton>
      </div>
    </SignedOut>
  );
}
export default AuthButtons;
