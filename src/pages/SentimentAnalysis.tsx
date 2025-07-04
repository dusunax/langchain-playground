import { useEffect, useRef, useState } from "react";
import useChatOpenAI from "../hooks/sentiment-analysis/useChatOpenAI";

const SentimentAnalysis = () => {
  const { sentimentAnalysis, fetchSentimentAnalysis } = useChatOpenAI();
  const [currrentScore, setCurrentScore] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    inputRef.current!.value = "";
    setIsLoading(true);
    await fetchSentimentAnalysis(inputRef.current?.value || "");
    setIsLoading(false);
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (sentimentAnalysis) {
      setCurrentScore((prev) => prev + sentimentAnalysis.level);
    }
  }, [sentimentAnalysis]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <h1>Sentiment Analysis</h1>
      <section>
        <div
          style={{
            maxWidth: "var(--width-content)",
            width: "100%",
            margin: "0",
            display: "flex",
            gap: "1rem",
          }}
        >
          <aside style={{ background: "white", margin: "0" }}>
            <h3>비난/칭찬 양파</h3>
            <p>양파의 기분: {currrentScore}</p>
          </aside>
          {sentimentAnalysis && (
            <aside style={{ background: "white", margin: "0" }}>
              <h3>Sentiment Analysis Result</h3>
              <p>
                Sentiment Keyword: {sentimentAnalysis.sentiment_keyword} <br />
                Level: {sentimentAnalysis.level} <br />
                Emoji: {sentimentAnalysis.emoji}
              </p>
            </aside>
          )}
        </div>
      </section>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          maxWidth: "var(--width-content)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <input
          type="text"
          style={{ height: "100%", display: "block", margin: 0, width: "100%" }}
          ref={inputRef}
          placeholder="Talk to the onion"
        />
        <button style={{ flexShrink: 0 }} disabled={isLoading}>
          말하기
        </button>
      </form>
    </div>
  );
};

export default SentimentAnalysis;
