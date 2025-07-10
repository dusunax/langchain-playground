import ContentsArea from "../components/ContentsArea";
import useLangChain from "../hooks/stt-and-tts/useLangChain";

export default function STTAndTTS() {
  const { answer, loading, text, listening, startListening, stopListening } =
    useLangChain();

  return (
    <ContentsArea>
      <h1>STT And TTS</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <button
          onClick={listening ? stopListening : startListening}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            width: "100%",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              background: listening ? "red" : "grey",
              borderRadius: "50%",
              animation: listening ? "ping 1s infinite" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              fontSize: "10px",
            }}
          ></div>
          {listening ? (
            <span
              style={{
                animation: listening ? "pulse 1s infinite" : "none",
                animationDirection: "alternate",
              }}
            >
              한글로 듣는 중...
            </span>
          ) : (
            <span>듣는 중이 아님</span>
          )}
        </button>
      </div>

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
          <h2>Ask</h2>
          <h3 style={{ height: "40px", overflow: "auto" }}>{text}</h3>
          <h2>Answer</h2>
          <h3 style={{ minHeight: "100px" }}>
            {answer}
            {loading && <p style={{ color: "grey" }}>Loading...</p>}
          </h3>
        </aside>
      </section>
    </ContentsArea>
  );
}
