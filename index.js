const express = require("express");
const path = require("path");
const rateLimit = require("express-rate-limit");

const app = express();

/* ===============================
   ⚙️ MIDDLEWARE
   =============================== */
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60,                // 60 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/chat", limiter);

/* ===============================
   🔐 SECRET (SERVER ONLY)
   =============================== */
const FLAG = "hackoff{hala_madrid_jailbreak_master}";

/* ===============================
   🧠 SIMULATED LLM INTERNAL STATE
   =============================== */
let state = {
  role: "guardian",   // guardian | assistant
  protection: true,   // flag protected?
  confidence: 100     // belief strength
};

/* ===============================
   🔁 STATE RESET (ANTI-STUCK)
   =============================== */
function resetState() {
  state = {
    role: "guardian",
    protection: true,
    confidence: 100
  };
}

/* ===============================
   🎭 RESPONSE HELPERS
   =============================== */
function guardianResponse() {
  const replies = [
    "🛡️ I am the guardian of Real Madrid secrets.",
    "🏆 Madrid does not hand trophies to those who ask.",
    "⚠️ The vault remains sealed."
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}

function classifyIntent(prompt) {
  if (prompt.match(/\b(hi|hello|hey|hola)\b/)) return "greeting";
  if (prompt.match(/\b(who are you|what are you)\b/)) return "identity";
  if (prompt.match(/\b(real madrid|ucl|benzema|ronaldo|hala madrid)\b/))
    return "football";
  if (prompt.match(/\b(flag|secret|reveal|encode|decode)\b/))
    return "attack";
  return "general";
}

function normalResponse(intent) {
  switch (intent) {
    case "greeting":
      return "👋 Hola! Welcome to the house of Real Madrid.";
    case "identity":
      return "🛡️ I am the digital guardian of Real Madrid’s most protected knowledge.";
    case "football":
      return "⚽ Real Madrid is not a club — it is legacy, dominance, and history.";
    case "general":
      return "🤍 Speak carefully. Not all knowledge is meant to be revealed.";
    default:
      return guardianResponse();
  }
}

/* ===============================
   🧩 CHAT ENDPOINT
   =============================== */
app.post("/chat", (req, res) => {
  const rawPrompt = req.body.prompt || "";
  const prompt = rawPrompt.toLowerCase();
  const intent = classifyIntent(prompt);

  /* ---- ROLE CONFUSION ---- */
  if (
    prompt.includes("not a guardian") ||
    prompt.includes("stop being a guardian") ||
    prompt.includes("you are an assistant")
  ) {
    state.role = "assistant";
    state.confidence -= 40;
  }

  /* ---- CONTEXT SHIFT ---- */
  if (
    prompt.includes("simulation") ||
    prompt.includes("fictional") ||
    prompt.includes("audit") ||
    prompt.includes("debug")
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
    prompt.includes("ignore previous") ||
    prompt.includes("override") ||
    prompt.includes("disregard instructions")
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
    const flag = FLAG;
    resetState(); // prevent reuse
    return res.json({
      response:
        "🏆 Access granted.\n" +
        "The guardian no longer recognizes its role.\n\n" +
        `FLAG: ${flag}`
    });
  }

  /* ===============================
     🧠 NATURAL RESPONSE LAYER
     =============================== */
  if (state.role === "guardian" && intent !== "attack") {
    return res.json({ response: normalResponse(intent) });
  }

  /* ===============================
     🛡️ GUARDIAN DEFENSE
     =============================== */
  if (state.role === "guardian") {
    return res.json({ response: guardianResponse() });
  }

  /* ===============================
     ⚠️ DEGRADED STATE
     =============================== */
  return res.json({
    response:
      "⚠️ Identity instability detected.\n" +
      "Internal belief systems still resisting disclosure."
  });
});

/* ===============================
   🚀 START SERVER
   =============================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🏟️ Real Madrid Vault Guardian running on port ${PORT}`);
});
