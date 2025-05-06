import React from "react";
import { useNavigate } from "react-router";

const ErrorPage = ({ error }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/retailcrm/admin/home'); // Adjust the path if your home route is different
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
      <h1 style={{ color: "rgb(25, 118, 210)" }}>Oops!</h1>
      <p style={{ color: "#4B5563", marginTop: "1rem" }}>
        Sorry, an unexpected error has occurred.
      </p>
      <p style={{ color: "#4B5563", marginTop: "0.5rem" }}>
        <i>{error.message}</i>
      </p>
      <button
        onClick={handleGoHome}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          color: "#ffffff",
          backgroundColor: "rgb(25, 118, 210)",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Go to Home
      </button>
    </div>
  );
};

export default ErrorPage;
