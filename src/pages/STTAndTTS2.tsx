import ContentsArea from "../components/ContentsArea";
import useLangChain2 from "../hooks/stt-and-tts/useLangChain2";

export default function STTAndTTS() {
  const {
    textOutput,
    isTextOutputRequesting,
    input,
    isAudioListening,
    startListening,
    stopListening,
    setAudioFile,
    downloadAudio,
  } = useLangChain2();

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
          onClick={isAudioListening ? stopListening : startListening}
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
              background: isAudioListening ? "red" : "grey",
              borderRadius: "50%",
              animation: isAudioListening ? "ping 1s infinite" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              fontSize: "10px",
            }}
          ></div>
          {isAudioListening ? (
            <span
              style={{
                animation: isAudioListening ? "pulse 1s infinite" : "none",
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
          <h3 style={{ height: "40px", overflow: "auto" }}>{input}</h3>
          <h2>Answer</h2>
          <h3 style={{ minHeight: "100px" }}>
            {textOutput}
            {isTextOutputRequesting && (
              <p style={{ color: "grey" }}>Loading...</p>
            )}
          </h3>
        </aside>
      </section>

      <section className="testing-audio-upload">
        <h2>테스트용 오디오 파일 업로드</h2>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
        />
        <button onClick={downloadAudio}>다운로드</button>
      </section>
    </ContentsArea>
  );
}
