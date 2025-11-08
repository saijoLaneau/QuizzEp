import { useState } from "react";
import "./App.css";
import background from "./assets/background.jpg";
import finalBackground from "./assets/final.jpg";
import { createClient } from "@supabase/supabase-js";

// ⚙️ Supabase setup
const supabaseUrl = "https://zeitrxtxqjocgkfysugd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplaXRyeHR4cWpvY2drZnlzdWdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MzUxMDQsImV4cCI6MjA3ODIxMTEwNH0.gj1xwmEj9GY9Bjn3CV0TBySyZD1dbxbaCKSyn76g7nw";
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const questions = [
    {
      question: "Quelle est ta chanson préférée de Saijo?",
      answers: ["Patrick Bruel", "RIP Kobe", "Maman m’a dit", "C’est la base (freestyle)"],
    },
    {
      question: "Est ce que tu aimerais voir Saijo sur scène ?",
      answers: ["Oui", "Non", "Sans avis"],
    },
    {
      question: "Quelle est la date de sortie du premier EP Laneau ?",
      answers: ["15/11", "19/11", "25/11", "30/11"],
    },
  ];

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [finished, setFinished] = useState(false);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleAnswer = (index) => {
    const updatedAnswers = [...answers];
    updatedAnswers[step] = questions[step].answers[index];
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setFinished(true);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const submitToSupabase = async () => {
    if (!name.trim()) {
      alert("Please enter your name to confirm attendance.");
      return;
    }

    try {
      setIsSubmitting(true);
      const { data, error } = await supabase
        .from("responses")
        .insert([{ name, answers }]);

      if (error) throw error;
      console.log("✅ Data saved:", data);
      setConfirmed(true);
    } catch (error) {
      console.error("❌ Supabase error:", error);
      alert("There was an error saving your response. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="quiz-container"
      style={{
        backgroundImage: `url(${finished ? finalBackground : background})`,
      }}
    >
      {finished ? (
        <div className="final-screen">
          <h1>🎉 Félicitations !</h1>
          <p>
            Tu es invité à la <strong>Release Party Laneau de Saijo !</strong>
          </p>
          <p>
            On t’attend le <strong>21/11 à 19h</strong> (fermeture des portes à
            19h30) dans les locaux de la RTBF pour fêter la sortie ensemble{" "}
            <strong>ensemble !</strong>
          </p>
          <p>
            Au programme: un showcase exclusif de <strong>Saijo</strong>, à boire
            pour tout le monde et une ambiance unique.
          </p>
          <input
            type="text"
            placeholder="Entrer votre nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="name-input"
          />
          <button
            onClick={submitToSupabase}
            disabled={isSubmitting || !name.trim()}
          >
            {isSubmitting ? "Enregistrement..." : "Je viens 🎈"}
          </button>
        </div>
      ) : (
        <div className="quiz-card">
          <h2>
            Question {step + 1} of {questions.length}
          </h2>
          <p>{questions[step].question}</p>
          <div className="answers">
            {questions[step].answers.map((ans, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={answers[step] === ans ? "selected" : ""}
              >
                {ans}
              </button>
            ))}
          </div>

          <div className="nav-buttons">
            <button onClick={handlePrevious} disabled={step === 0}>
              ⬅ Previous
            </button>
            <button onClick={handleNext} disabled={answers[step] === null}>
              {step === questions.length - 1 ? "Finish" : "Next ➡"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
