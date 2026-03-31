import type { PropsWithChildren } from "react";
import "./MainLayout.scss";

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="main-layout">
      <header className="main-layout__header">
        <h1>Shopping Agent FE</h1>
      </header>
      <main className="main-layout__main">{children}</main>
    </div>
  );
};

export default MainLayout;
