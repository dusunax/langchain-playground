import { useState } from "react";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

import { CONFIG } from "../../constant/config";
import type { Language } from "../../types/translator";

const model = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  apiKey: CONFIG.OPENAI_API_KEY,
  temperature: 0.7,
});

const SYSTEM_MSG =
  "Translate the following from question into {language} and put some emojis";
const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", SYSTEM_MSG],
  ["human", "{text}"],
]);

export const useChatOpenAI = ({ language }: { language: Language }) => {
  const [stream, setStream] = useState<string>("");

  const fetchSingleMessage = async (humanMessage: string) => {
    const messages = [
      new SystemMessage(SYSTEM_MSG),
      new HumanMessage(humanMessage),
    ];
    const chatPromptValue = await model.invoke(messages);
    return chatPromptValue;
  };

  const fetchTranslatedStream = async (humanMessage: string) => {
    setStream("");
    const chatPromptValue = await promptTemplate.invoke({
      language,
      text: humanMessage,
    });
    const stream = await model.stream(chatPromptValue);

    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
      setStream((prev) => prev + (chunk.content as string));
    }
  };

  return {
    model,
    stream,
    fetchTranslatedStream,
    fetchSingleMessage,
  };
};
