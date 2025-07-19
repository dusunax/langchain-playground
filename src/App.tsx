import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";

import Translator from "./pages/Translator";
const STTAndTTS = lazy(() => import("./pages/STTAndTTS"));
const STTAndTTS2 = lazy(() => import("./pages/STTAndTTS2"));
const SentimentAnalysis = lazy(() => import("./pages/SentimentAnalysis"));
const FewShots = lazy(() => import("./pages/FewShots"));
const Retriver = lazy(() => import("./pages/Retriver"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Translator />} />
          <Route path="/sentiment-analysis" element={<SentimentAnalysis />} />
          <Route path="/translator" element={<Translator />} />
          <Route path="/few-shots" element={<FewShots />} />
          <Route path="/retriver" element={<Retriver />} />
          <Route path="/stt-and-tts" element={<STTAndTTS />} />
          <Route path="/stt-and-tts-v2" element={<STTAndTTS2 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
