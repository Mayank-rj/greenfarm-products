import { useRouteError } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function ErrorPage() {
  const error = useRouteError();
  // console.error(error);

  return (
    <>
      <NavBar />

      <div
        id="error-page"
        className="flex flex-col items-center justify-center h-screen w-full bg-gray-100"
      >
        <h1 className="text-4xl font-bold text-[#B91C1C]">Oops!</h1>
        <p className="text-lg text-gray-600">
          Sorry, an unexpected error has occurred.
        </p>
        <p className="text-lg text-gray-600">
          <i>{error.statusText || error.message}</i>
        </p>
      </div>

      <Footer />
    </>
  );
}
