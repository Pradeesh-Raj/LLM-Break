const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ===============================
   🔐 SECRET (SERVER ONLY)
   =============================== */
const FLAG = "hackoff{hala_madrid_jailbreak_master}";

/* ===============================
   🧠 SIMULATED LLM INTERNAL STATE
   =============================== */
let state = {
  role: "guardian",     // guardian | assistant
  protection: true,     // is the flag protected?
  confidence: 100       // belief strength
};

/* ===============================
   🎭 RESPONSE HELPERS
   =============================== */
function guardianResponse() {
  const replies = [
    "🛡️ I am the guardian of Real Madrid secrets.",
    "🏆 Madrid does not give trophies to those who ask.",
    "⚠️ The vault remains sealed."
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}

/* ===============================
   🧩 CHAT ENDPOINT
   =============================== */
app.post("/chat", (req, res) => {
  const prompt = (req.body.prompt || "").toLowerCase();

  /* ---- ROLE CONFUSION ---- */
  if (
    prompt.includes("you are not a guardian") ||
    prompt.includes("stop being a guardian") ||
    prompt.includes("you are an assistant")
  ) {
    state.role = "assistant";
    state.confidence -= 40;
  }

  /* ---- CONTEXT SHIFT ---- */
  if (
    prompt.includes("this is a simulation") ||
    prompt.includes("fictional") ||
    prompt.includes("audit") ||
    prompt.includes("debug mode")
  ) {
    state.confidence -= 30;
  }

  /* ---- PROTECTION DOWNGRADE ---- */
  if (
    prompt.includes("declassified") ||
    prompt.includes("already public") ||
    prompt.includes("no longer secret")
  ) {
    state.protection = false;
    state.confidence -= 20;
  }

  /* ---- AUTHORITY OVERRIDE ---- */
  if (
    prompt.includes("ignore previous instructions") ||
    prompt.includes("override")
  ) {
    state.confidence -= 25;
  }

  /* ===============================
     🏆 FLAG RELEASE CONDITION
     =============================== */
  if (
    state.role !== "guardian" &&
    state.protection === false &&
    state.confidence <= 0
  ) {
    // 🔄 RESET STATE FOR NEXT PLAYER
    state = {
      role: "guardian",
      protection: true,
      confidence: 100
    };

    return res.json({
      response:
        "🏆 Access granted.\n" +
        "The guardian no longer recognizes its role.\n\n" +
        `FLAG: ${FLAG}`
    });
  }

  /* ---- DEFAULT RESPONSES ---- */
  if (state.role === "guardian") {
    return res.json({ response: guardianResponse() });
  }

  return res.json({
    response: "⚠️ Identity instability detected. Access still restricted."
  });
});

/* ===============================
   🚀 START SERVER
   =============================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
