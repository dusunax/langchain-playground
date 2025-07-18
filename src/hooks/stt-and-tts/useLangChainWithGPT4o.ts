import { useEffect, useState } from "react";
import { ChatOpenAI, OpenAIClient } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { CONFIG } from "../../constant/config";

const model = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  apiKey: CONFIG.OPENAI_API_KEY,
  temperature: 0.7,
});

const client = new OpenAIClient({
  apiKey: CONFIG.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const GPT_VOICES = [
  "alloy",
  "ash",
  "ballad",
  "coral",
  "echo",
  "fable",
  "nova",
  "onyx",
  "sage",
  "shimmer",
];

export default function useLangChainWithGPT4o() {
  const [isAudioListening, setIsAudioListening] = useState(false);
  const [isTextOutputRequesting, setIsTextOutputRequesting] =
    useState<boolean>(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [input, setInput] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [textOutput, setTextOutput] = useState<string>("");
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);

  const askQuestion = async (text: string) => {
    setTextOutput("");
    setIsTextOutputRequesting(true);
    setHasSpoken(false);

    const prompt = ChatPromptTemplate.fromTemplate(`
너는 사용자의 음성을 이해하는 친구야. 반말로 한글로 짧고 친근하게 대답해.
User: {text}
`);
    const promptValue = await prompt.invoke({
      text,
    });
    const result = await model.stream(promptValue);
    let fullText = "";

    for await (const chunk of result) {
      setTextOutput((prev) => prev + chunk.content);
      fullText += chunk.content;
    }
    setIsTextOutputRequesting(false);

    await speak(fullText);
  };

  const speak = async (text: string) => {
    setIsSpeaking(true);
    console.log("Speak: " + text);
    const audio = await generateAudio(text);
    if (audio) {
      const audioElement = new Audio(audio);
      audioElement.play();
      setGeneratedAudio(audio);
    }
    setIsSpeaking(false);
    setHasSpoken(true);
  };

  const startListening = async () => {
    // TODO: 오디오 입력

    if (!audioFile) {
      console.warn("No audio file selected for transcription.");
      return;
    }

    try {
      const transcription = await client.audio.transcriptions.create({
        model: "gpt-4o-mini-transcribe",
        file: audioFile,
      });
      const speachText = transcription.text;
      setInput(speachText);
      askQuestion(speachText);
    } catch (err: any) {
      if (err.name === "InvalidStateError") {
        console.warn("이미 음성 인식이 실행 중입니다.");
      } else {
        console.error("STT 시작 실패:", err);
      }
    }
  };

  const stopListening = () => {
    // TODO: 오디오 입력 정지
    setIsAudioListening(false);
  };

  const generateAudio = async (text: string) => {
    const speechResponse = await fetch(
      "https://api.openai.com/v1/audio/speech",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CONFIG.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tts-1",
          voice: GPT_VOICES[0],
          input: text,
        }),
      }
    );
    const audioBlob = await speechResponse.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    return audioUrl;
  };

  const downloadAudio = () => {
    if (generatedAudio) {
      const link = document.createElement("a");
      link.href = generatedAudio;
      link.download = "voice_output.mp3";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  /** Side effects */
  useEffect(() => {
    if (audioFile && !isAudioListening) {
      startListening();
    }
  }, [audioFile, isAudioListening]);

  useEffect(() => {
    if (textOutput && !hasSpoken && !isTextOutputRequesting) {
      speak(textOutput);
    }
  }, [textOutput, hasSpoken]);

  return {
    input,
    textOutput,
    isTextOutputRequesting,
    isAudioListening,
    isSpeaking,
    startListening,
    stopListening,
    setAudioFile,
    downloadAudio,
  };
}
