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
        <p className="text">Track & view your outdoor activities</p>
      </div>
      <div className="text-center text-sm mt-2 mb-2 sticky flex justify-center gap-1">
        <p>A project by </p>{" "}
        <a
          className="font-bold text-forest-dark"
          href="https://www.jamesaide.com"
          target="_#"
        >
          James Ide
        </a>
      </div>
    </div>
    // </Link>
  );
}
export default Title;
