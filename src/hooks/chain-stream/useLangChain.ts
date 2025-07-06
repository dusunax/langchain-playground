import { useCallback, useState } from "react";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

import { CONFIG } from "../../constant/config";
import { documents } from "./documents";
import type { DocumentInterface } from "@langchain/core/documents";

const model = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  apiKey: CONFIG.OPENAI_API_KEY,
  temperature: 0,
});
const vectorstore = await MemoryVectorStore.fromDocuments(
  documents,
  new OpenAIEmbeddings({
    apiKey: CONFIG.OPENAI_API_KEY,
  })
);

interface RetrievedDocument extends DocumentInterface {
  score: number;
}

export default function useLangChain() {
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [retrievedDocuments, setRetrievedDocuments] = useState<
    RetrievedDocument[]
  >([]);
  const k = 5;
  const threshold = 0.8;

  const template = `Answer the question based only on the following context:
  {context}

  Question: {question}

  Behavior:
  - Only answer based on the given context.
  - And if you don't know the answer, just say "I'm sorry, I cannot provide information about the question based on the given context.".
  - If there are multiple meanings, explain each one briefly.
  `;

  const isAnswerValid = useCallback(
    (answer: string) => !answer.includes("I'm sorry"),
    []
  );

  const askQuestion = async (question: string) => {
    setAnswer("");
    setLoading(true);
    setRetrievedDocuments([]);

    // 1. retriever만 단독으로 사용하는 경우 (Score없이)
    // const retriever = vectorstore.asRetriever({ k });
    // const retrievedDocuments = await retriever.invoke(question);

    // 2. 문서와 유사도 점수를 함께 반환하는 경우
    const retrievedDocumentsWithScore: [DocumentInterface, number][] =
      await vectorstore.similaritySearchWithScore(question, k);
    const retrievedDocuments: RetrievedDocument[] = retrievedDocumentsWithScore
      .filter(([_, score]) => score >= threshold)
      .map(([doc, score]) => ({
        ...doc,
        score,
      }));
    setRetrievedDocuments(retrievedDocuments);
    console.log("📌 retrieved documents:\n", retrievedDocuments);

    const context = retrievedDocuments.map((doc) => doc.pageContent).join("\n");
    const prompt = ChatPromptTemplate.fromTemplate(template);
    const promptValue = await prompt.invoke({
      context,
      question,
    });
    const result = await model.stream(promptValue);
    for await (const chunk of result) {
      setAnswer((prev) => prev + chunk.content);
    }
    setLoading(false);
  };

  return { answer, loading, retrievedDocuments, askQuestion, isAnswerValid };
}
