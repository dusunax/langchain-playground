import { useState } from "react";
import ContentsArea from "../components/ContentsArea";
import useLangChain from "../hooks/chain-stream/useLangChain";

export default function Retriver() {
  const [input, setInput] = useState<string>("tell me about the sun");
  const { answer, loading, retrievedDocuments, askQuestion, isAnswerValid } =
    useLangChain();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    askQuestion(input);
    setInput("");
  };

  const uniqueDocuments = retrievedDocuments.reduce<typeof retrievedDocuments>(
    (acc, current) => {
      const x = acc.find(
        (item) => item.metadata.topic === current.metadata.topic
      );
      if (!x) {
        return acc.concat([current]);
      } else if (current.score > x.score) {
        return acc.map((item) =>
          item.metadata.topic === current.metadata.topic ? current : item
        );
      }
      return acc;
    },
    []
  );

  return (
    <ContentsArea>
      <h1>Retriver</h1>
      <section>
        <aside
          style={{
            width: "100%",
            backgroundColor: "white",
            margin: "0",
          }}
        >
          <h3>Question using Retriver</h3>
          <form
            style={{ display: "flex", gap: "16px" }}
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                margin: "0",
                maxWidth: "var(--max-width)",
              }}
            />
            <button
              disabled={loading}
              onClick={() => askQuestion(input)}
              style={{
                margin: "0",
              }}
            >
              {loading ? "Loading..." : "Ask"}
            </button>
          </form>
        </aside>
      </section>
      <section>
        <aside
          style={{
            width: "100%",
            backgroundColor: "white",
            margin: "0",
          }}
        >
          <h3>Answer</h3>
          <p>{answer ? answer : loading ? "..." : ""}</p>
          <hr style={{ margin: "0" }} />
          <p style={{ color: "gray", fontStyle: "italic" }}>
            Related topics:{" "}
            {isAnswerValid(answer)
              ? uniqueDocuments
                  .map(
                    (doc) =>
                      `${doc.metadata.topic}(${Math.floor(doc.score * 100)}%)`
                  )
                  .join(", ")
              : "..."}
          </p>
        </aside>
      </section>
    </ContentsArea>
  );
}
