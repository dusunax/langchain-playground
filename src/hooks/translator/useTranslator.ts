import { useState } from "react";

import { useChatOpenAI } from "./useChatOpenAI";
import { Language } from "../../types/translator";

export const useTranslator = () => {
  const [input, setInput] = useState<string>("");
  const [lastHumanMessage, setLastHumanMessage] = useState<string>("");
  const [language, setLanguage] = useState<Language>(Language.en);
  const { fetchTranslatedStream, stream } = useChatOpenAI({ language });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLastHumanMessage(input);
    setInput("");

    fetchTranslatedStream(input);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as unknown as Language);
  };

  return {
    input,
    lastHumanMessage,
    stream,
    language,
    handleSubmit,
    handleInputChange,
    handleLanguageChange,
  };
};
