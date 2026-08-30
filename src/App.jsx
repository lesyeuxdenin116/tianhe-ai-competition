import React, { useState } from 'react';
import WelcomePage from './components/WelcomePage.jsx';
import Survey from './components/Survey.jsx';
import Results from './components/Results.jsx';
import { evaluate } from './engine/ruleEngine.js';

const PAGES = {
  WELCOME: 'welcome',
  SURVEY: 'survey',
  RESULTS: 'results',
};

export default function App() {
  const [page, setPage] = useState(PAGES.WELCOME);
  const [answers, setAnswers] = useState(null);
  const [result, setResult] = useState(null);

  function handleStart() {
    setPage(PAGES.SURVEY);
  }

  function handleSurveyComplete(completedAnswers) {
    const evalResult = evaluate(completedAnswers);
    setAnswers(completedAnswers);
    setResult(evalResult);
    setPage(PAGES.RESULTS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleRestart() {
    setAnswers(null);
    setResult(null);
    setPage(PAGES.WELCOME);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  if (page === PAGES.WELCOME) return <WelcomePage onStart={handleStart} />;
  if (page === PAGES.SURVEY) return <Survey onComplete={handleSurveyComplete} />;
  if (page === PAGES.RESULTS && answers && result) {
    return <Results answers={answers} result={result} onRestart={handleRestart} />;
  }

  return <WelcomePage onStart={handleStart} />;
}
