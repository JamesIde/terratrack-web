function Title() {
  return (
    // <Link href={"/"}>
    <div className="mb-2">
      <div className="flex flex-row justify-center mt-16 gap-3">
        <div>
          <img src="/icon.png" alt="Terratrack logo" width={40} height={40} />
        </div>
        <div>
          <h1 className="font-bold text-4xl">TERRATRACK</h1>
        </div>
      </div>
      <div className="justify-center flex mt-2">
        <p className="text-sm">Track & view your outdoor activities</p>
      </div>
    </div>
    // </Link>
  );
}
export default Title;
