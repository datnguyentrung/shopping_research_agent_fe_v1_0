import type { PropsWithChildren } from "react";

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div style={{ maxWidth: "1024px", margin: "0 auto", padding: "24px" }}>
      <header style={{ marginBottom: "16px" }}>
        <h1>Shopping Agent FE</h1>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
