// How to return structured data from a model
// https://js.langchain.com/docs/how_to/structured_output/

import { useState } from "react";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

import { CONFIG } from "../../constant/config";

const model = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  apiKey: CONFIG.OPENAI_API_KEY,
});

const sentiment = z.object({
  sentiment_keyword: z
    .string()
    .describe(
      'Keyword that indicates the sentiment of the text. ex): "happy", "sad"'
    ),
  level: z
    .number()
    .describe(
      "Sentiment level of the text (-5~5). If the text is inappropriate, it will be -100"
    ),
  emoji: z.string().describe("Emoji that represents the sentiment"),
});

const structuredLlm = model.withStructuredOutput(sentiment, {
  // includeRaw: true, // <= Can include the raw output from the model, LLM's aren't always perferctly structured.
  name: "sentiment_analysis", // Name of the structured output, useful for debugging! (so says the docs)
});

const useChatOpenAI = () => {
  const [sentimentAnalysis, setSentimentAnalysis] = useState<z.infer<
    typeof sentiment
  > | null>(null);

  const fetchSentimentAnalysis = async (text: string) => {
    const result = await structuredLlm.invoke(text);
    console.log("chatPromptValue", result);
    setSentimentAnalysis(result);
  };

  return { sentimentAnalysis, fetchSentimentAnalysis };
};

export default useChatOpenAI;
