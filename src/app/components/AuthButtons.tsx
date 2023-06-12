import { SignedOut, SignInButton } from "@clerk/nextjs";

function AuthButtons() {
  return (
    <SignedOut>
      <div className="flex justify-center mt-24">
        <SignInButton mode="modal" redirectUrl="/">
          <button className="p-2 bg-green-500 rounded-xl hover:bg-green-600">
            <p className="pl-8 pr-8 text-white font-bold">Login</p>
          </button>
        </SignInButton>
      </div>
    </SignedOut>
  );
}
export default AuthButtons;
