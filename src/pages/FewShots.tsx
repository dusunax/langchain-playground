import { useEffect, useRef, useState } from "react";
import ContentsArea from "../components/ContentsArea";
import useLangChain, { type Sentiment } from "../hooks/few-shots/useLangChain";

export default function FewShots() {
  const { lastMessage, askQuestion, isLoading } = useLangChain();
  const inputRef = useRef<HTMLInputElement>(null);
  const [history, setHistory] = useState<Sentiment[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const question = inputRef.current?.value;
    if (question) {
      askQuestion(question);
    }
  };

  useEffect(() => {
    if (lastMessage?.subject) {
      setHistory((prev) => [...prev, lastMessage]);
    }
  }, [lastMessage]);

  return (
    <ContentsArea>
      <h1>Few Shots: Just Thoughts</h1>
      <form
        style={{
          backgroundColor: "white",
          maxWidth: "var(--max-width)",
        }}
        onSubmit={handleSubmit}
      >
        <h3>Subject</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            ref={inputRef}
            placeholder="Enter a subject to think about..."
            required
            style={{ margin: 0, maxWidth: "var(--max-width)" }}
          />
          <button style={{ margin: 0 }} disabled={isLoading}>
            {isLoading ? "Thinking..." : "Thoughts"}
          </button>
        </div>
      </form>
      <section>
        <aside
          style={{
            width: "100%",
            backgroundColor: "white",
            margin: "0",
          }}
        >
          <h3>Reaction</h3>
          <p>{lastMessage?.speak}...</p>
          <p
            style={{
              fontStyle: "italic",
              color: "gray",
            }}
          >
            {lastMessage?.feeling ? `They look ${lastMessage?.feeling}.` : ""}
          </p>
          <p>...{lastMessage?.followUp}</p>
        </aside>
        {lastMessage?.thoughts ? (
          <aside
            style={{
              width: "100%",
              backgroundColor: "white",
              margin: "0",
            }}
          >
            <h3>Thoughts</h3>
            <p>{lastMessage?.thoughts}</p>
          </aside>
        ) : (
          ""
        )}
      </section>
      <section>
        <ul
          style={{
            width: "100%",
            listStyle: "none",
            padding: "0",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          {history.map((subject, index) => (
            <li
              key={subject.subject + index}
              style={{
                fontStyle: "italic",
                color: "gray",
                fontSize: "12px",
                padding: "5px 10px",
                border: "1px solid #ccc",
                borderRadius: "16px",
                backgroundColor: "white",
              }}
            >
              {subject.subject}/{subject.feeling}
            </li>
          ))}
        </ul>
      </section>
    </ContentsArea>
  );
}
