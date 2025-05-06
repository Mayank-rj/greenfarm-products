import React from "react";
import { useNavigate } from "react-router";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const goToHomePage = () => {
    navigate("/"); // Navigate to the home page ("/" is the root path)
  };

  return (
    <div
      style={{
        height: "90vh",
        width: "94vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      id="error-page"
    >
      <h1 style={{ color: "rgb(25, 118, 210)" }}>404 - Page Not Found!</h1>
      <p style={{ color: "#4B5563", marginTop: "1rem" }}>
        The page you are looking for does not exist
      </p>
      <button
        onClick={goToHomePage}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          color: "#fff",
          backgroundColor: "rgb(25, 118, 210)",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Go to Home Page
      </button>
    </div>
  );
};

export default NotFoundPage;
// import React from "react";

// const NotFoundPage = () => {
//   return (
//     <div
//       style={{
//         height: "90vh",
//         width: "94vw",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//       id="error-page"
//     >
//       <h1 style={{ color: "rgb(25, 118, 210)" }}>404 - Page Not Found!</h1>
//       <p style={{ color: "#4B5563", marginTop: "1rem" }}>
//         The page you are looking for does not exist
//       </p>
//       {/* <p style={{ color: "#4B5563", marginTop: "0.5rem" }}>
//         <i>The page you are looking for does not exist</i>
//       </p> */}
//     </div>
//   );
// };

// export default NotFoundPage;
