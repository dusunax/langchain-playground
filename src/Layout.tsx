export default function Layout({ children }: { children: React.ReactNode }) {
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
      <header style={{ padding: "4rem 0 2rem" }}>
        <h2 style={{ margin: "0" }}>LangChain Translator</h2>
      </header>

      {children}
    </div>
  );
}
