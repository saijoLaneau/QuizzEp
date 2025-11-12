import { useState } from "react";
import "./App.css";
import finalBackground from "./assets/final.jpeg";
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
      alert("Veuillez entrer votre nom pour s'enregistrer dans la liste d'attente.");
      return;
    }

    try {
      setIsSubmitting(true);
      const { data, error } = await supabase
        .from("liste_attente")
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
            <h1>SOLD OUT</h1>
            <p>
              La <strong>Release Party Laneau de Saijo</strong> est désormais <strong>complète</strong>.
              Mais pas de panique, tu peux encore t’inscrire sur la <strong>liste d’attente</strong>.
            </p>

            <p>
              Si des places se libèrent, tu recevras une <strong>confirmation personnelle</strong> par message.
            </p>

            <p>
              👉 Inscris ton <strong>nom et prénom</strong> ci-dessous pour rejoindre la liste d’attente :
            </p>

            <p class="warning">
              ⚠️ <strong>Ne viens pas</strong> à l’événement sans avoir reçu de confirmation officielle.
            </p>

            <input
              type="text"
              placeholder="Entre ton nom et prénom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="name-input"
            />

            <button
              onClick={submitToSupabase}
              disabled={isSubmitting || !name.trim()}
            >
              {isSubmitting ? "Enregistrement..." : "Je m’inscris à la liste d'attente✍️"}
            </button>

          </>
        ) : (
          <h2>✅ Merci {name} ! Tu es bien sur la liste d'attente. On te recontacte 🎊</h2>
        )}
      </div>
    </div>
  );
}

export default App;