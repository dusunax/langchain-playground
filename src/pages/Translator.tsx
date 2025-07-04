import { useTranslator } from "../hooks/translator/useTranslator";
import { LanguageIcon } from "../types/translator";

export default function Translator() {
  const {
    input,
    lastHumanMessage,
    stream,
    language,
    handleSubmit,
    handleInputChange,
    handleLanguageChange,
  } = useTranslator();

  return (
    <>
      <h1>Translator</h1>
      <select
        onChange={handleLanguageChange}
        style={{
          fontSize: "1rem",
          padding: "0.5rem",
          borderRadius: "0.5rem",
          border: "1px solid #ccc",
          margin: "2rem",
          position: "absolute",
          top: "0",
          right: "0",
        }}
      >
        {Object.entries(LanguageIcon).map(([key, value]) => (
          <option key={key} value={key}>
            {key} {value}
          </option>
        ))}
      </select>

      <section
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <aside
          style={{
            width: "100%",
            textAlign: "left",
            margin: 0,
            boxSizing: "border-box",
            background: "white",
            maxWidth: "var(--width-content)",
          }}
        >
          <h2>Input</h2>
          <h3 style={{ height: "40px", overflow: "auto" }}>
            {lastHumanMessage}
          </h3>
          <h2>
            Result in {LanguageIcon[language as keyof typeof LanguageIcon]}
          </h2>
          <h3 style={{ height: "40px", overflow: "auto" }}>{stream}</h3>
        </aside>

        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            maxWidth: "var(--width-content)",
            boxSizing: "border-box",
            background: "white",
          }}
        >
          <input
            type="text"
            style={{
              maxWidth: "var(--width-content)",
            }}
            value={input}
            onChange={handleInputChange}
            placeholder="Enter text to translate"
            required
          />
          <button type="submit" style={{ width: "100%" }}>
            Translate current to {language}
          </button>
        </form>
      </section>
    </>
  );
}
