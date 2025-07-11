import React from "react";
import Menu from "./Menu.jsx";
import "../styles/layout/layout.scss";

export default function Layout({ children }) {
  return (
    <div className="layout-container">
      <Menu />
      <div className="page-content-area">
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
