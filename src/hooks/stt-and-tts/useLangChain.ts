import { useEffect, useState } from "react";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { CONFIG } from "../../constant/config";

const model = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  apiKey: CONFIG.OPENAI_API_KEY,
  temperature: 0.7,
});

export default function useLangChain() {
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useState(() => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    return new SpeechRecognition();
  })[0];

  const askQuestion = async (text: string) => {
    setAnswer("");
    setLoading(true);

    const prompt = ChatPromptTemplate.fromTemplate(`
너는 사용자의 음성을 이해하는 친구야. 반말로 한글로 짧고 친근하게 대답해.
User: {text}
`);
    const promptValue = await prompt.invoke({
      text,
    });
    const result = await model.stream(promptValue);
    for await (const chunk of result) {
      setAnswer((prev) => prev + chunk.content);
    }
    setLoading(false);
    startListening();
  };

  const speak = async (text: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    synth.cancel();
    synth.speak(utterance);
  };

  const startListening = () => {
    try {
      recognitionRef.start();
      setListening(true);
    } catch (err: any) {
      if (err.name === "InvalidStateError") {
        console.warn("이미 음성 인식이 실행 중입니다.");
      } else {
        console.error("STT 시작 실패:", err);
      }
    }
  };

  const stopListening = () => {
    recognitionRef.stop();
    setListening(false);
  };

  useEffect(() => {
    startListening();
  }, []);

  useEffect(() => {
    if (answer) {
      speak(answer);
    }
  }, [answer]);

  useEffect(() => {
    recognitionRef.lang = "ko-KR";
    recognitionRef.interimResults = false;

    recognitionRef.onresult = (e: any) => {
      const textResult = e.results[0][0].transcript;
      setText(textResult);
      setListening(false);
      askQuestion(textResult);
    };

    recognitionRef.onerror = (e: any) => {
      console.error("STT Error", e);
      setListening(false);
    };

    recognitionRef.onend = () => setListening(false);
  }, [recognitionRef]);

  return {
    text,
    answer,
    loading,
    listening,
    startListening,
    stopListening,
  };
}
