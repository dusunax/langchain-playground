import { useCallback } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const { pathname } = useLocation();
  const linkStyle = useCallback(
    (isCurrent: boolean) => ({
      textDecoration: "none",
      color: "black",
      backgroundColor: isCurrent ? "lightgray" : "transparent",
      fontWeight: "bold",
      borderBottom: "2px solid transparent",
      fontSize: "12px",
      margin: "0",
      padding: "0.25rem 0.5rem",
      borderRadius: "0.5rem",
    }),
    [pathname]
  );

  return (
    <header
      style={{
        width: "100%",
        padding: "4rem 0 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <h2 style={{ margin: "0" }}>LangChain</h2>
      <ul
        style={{
          listStyle: "none",
          padding: "0",
          margin: "0",
          display: "flex",
          gap: "1rem",
        }}
      >
        <Link
          to="/translator"
          style={linkStyle(pathname === "/translator" || pathname === "/")}
          title="LLM Translator"
        >
          Translator
        </Link>
        <Link
          to="/sentiment-analysis"
          style={linkStyle(pathname === "/sentiment-analysis")}
          title="😂"
        >
          Sentiment Analysis
        </Link>
      </ul>
    </header>
  );
};

export default Header;
