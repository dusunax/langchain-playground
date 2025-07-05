import { useState } from "react";
import { z } from "zod";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PromptTemplate, FewShotPromptTemplate } from "@langchain/core/prompts";
import { SemanticSimilarityExampleSelector } from "@langchain/core/example_selectors";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

import { CONFIG } from "../../constant/config";
import examples from "./examples.json";

const model = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  apiKey: CONFIG.OPENAI_API_KEY,
  temperature: 0,
});

const sentiment = z.object({
  subject: z
    .string()
    .describe(
      "The subject of the text. ex) Rainy day, Ice cream, Moon, Train station, Empty notebook, Pigeons, Mismatched socks, Tangled headphones, Elevator music, Leftovers"
    ),
  feeling: z
    .string()
    .describe(
      "The feeling of the text. ex) bored, existential, calm, nostalgic, etc."
    ),
  thoughts: z
    .string()
    .describe(
      "The long train of thoughts of the text. ex) It’s like the music tries not to offend anyone, so it forgets how to feel. Maybe some people are like elevator music too. And I'm not sure if I'm one of them."
    ),
  speak: z
    .string()
    .describe(
      "You speak your final train of thoughts. It is a short simple sentence based on the thoughts. ex) If I'm in a bad mood, I'll listen to elevator music."
    ),
  followUp: z
    .string()
    .describe(
      "The follow up question for user. It comes after you speak your final train of thoughts. ex) Have you ever stuck in an elevator?"
    ),
});
export type Sentiment = z.infer<typeof sentiment>;

const structuredLlm = model.withStructuredOutput(sentiment, {
  name: "train_of_thoughts",
});

const examplePrompt = PromptTemplate.fromTemplate(
  `Subject: {subject}
Feeling: {feeling}
{thoughts}
Speak: {speak}
Follow up: {followUp}`
);

const createFewShotPrompt = async () => {
  const exampleSelector = await SemanticSimilarityExampleSelector.fromExamples(
    examples,
    new OpenAIEmbeddings({
      apiKey: CONFIG.OPENAI_API_KEY,
    }),
    MemoryVectorStore,
    { k: 2 }
  );

  return new FewShotPromptTemplate({
    exampleSelector,
    examplePrompt,
    suffix: "Subject: {input}",
    inputVariables: ["input"],
  });
};

export default function useLangChain() {
  const [lastMessage, setLastMessage] = useState<Sentiment | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const askQuestion = async (question: string) => {
    setIsLoading(true);
    const fewShotPrompt = await createFewShotPrompt();
    const fewShotMessages = await fewShotPrompt.format({ input: question });
    console.log("fewShotMessages:\n", fewShotMessages);

    const messages = [
      {
        role: "system",
        content:
          "You are a very interesting and thoughtful person. You will think based on the user's {input} as a subject. You are a wizard who can analyze the sentiment of the text and generate a train of thoughts. you can think deeply and deeply. and your thoughts are very detailed.",
      },
      { role: "user", content: fewShotMessages },
    ];

    const result = await structuredLlm.invoke(messages);

    setLastMessage(result);
    setIsLoading(false);
  };

  return { lastMessage, askQuestion, isLoading };
}
