import { useState } from "react";
import "./App.css";
import finalBackground from "./assets/final.jpg";
import { createClient } from "@supabase/supabase-js";

// ⚙️ Supabase setup
const supabaseUrl = "https://zeitrxtxqjocgkfysugd.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplaXRyeHR4cWpvY2drZnlzdWdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MzUxMDQsImV4cCI6MjA3ODIxMTEwNH0.gj1xwmEj9GY9Bjn3CV0TBySyZD1dbxbaCKSyn76g7nw";
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const submitToSupabase = async () => {
    if (!name.trim()) {
      alert("Veuillez entrer votre nom pour confirmer votre présence.");
      return;
    }

    try {
      setIsSubmitting(true);
      const { data, error } = await supabase
        .from("responses")
        .insert([{ name }]);

      if (error) throw error;
      console.log("✅ Data saved:", data);
      setConfirmed(true);
    } catch (error) {
      console.error("❌ Supabase error:", error);
      alert("Erreur lors de l'enregistrement. Réessayez plus tard.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="quiz-container"
      style={{
        backgroundImage: `url(${finalBackground})`,
      }}
    >
      <div className="final-screen">
        {!confirmed ? (
          <>
            <h1>GUEST LIST</h1>
            <p>
              Tu es invité à la <strong>Release Party Laneau de Saijo !</strong>
            </p>
            <p>
              Rendez-vous le <strong>21 novembre à 19h00</strong> dans les studios de Tarmac (RTBF).
            </p>
            <p>
              👉 Inscris-toi (nom + prénom) pour figurer sur la guest list.
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
              {isSubmitting ? "Enregistrement..." : "Je viens"}
            </button>

            <p>
              N’hésites pas à partager le lien autour de toi!
            </p>
          </>
        ) : (
          <h2>✅ Merci {name} ! On se voit à la Release Party 🎊</h2>
        )}
      </div>
    </div>
  );
}

export default App;