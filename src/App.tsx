import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import SentimentAnalysis from "./pages/SentimentAnalysis";
import Translator from "./pages/Translator";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Translator />} />
          <Route path="/sentiment-analysis" element={<SentimentAnalysis />} />
          <Route path="/translator" element={<Translator />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
