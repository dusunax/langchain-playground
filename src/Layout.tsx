import { Outlet } from "react-router-dom";
import Header from "./components/partials/Header";

export default function Layout() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        padding: "0 2rem",
        margin: "0",
        boxSizing: "border-box",
        background: "#f5f5f5",
      }}
    >
      <Header />
      <Outlet />
    </div>
  );
}
