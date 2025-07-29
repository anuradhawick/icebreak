import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage.tsx";
import CountDownPage from "./pages/CountDownPage.tsx";
import StartCountDownPage from "./pages/StartCountDownPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import "./index.css";
import AboutIcon from "./components/About.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="fixed bottom-6 right-6 z-50">
          <AboutIcon />
        </div>
        <Routes>
          <Route path="/" element={<HomePage title="IceBreak Count Down" />} />
          <Route path="/start" element={<StartCountDownPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/:id" element={<CountDownPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>
);
