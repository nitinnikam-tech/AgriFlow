const fs = require('fs');
let content = fs.readFileSync('client/src/pages/LoginPage.jsx', 'utf8');

const resetStateCode = `  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [resetState, setResetState] = useState("idle");

  const handleResetDemo = async () => {
    setResetState("resetting");
    try {
      await api.resetDemo();
      setResetState("ready");
      setTimeout(() => setResetState("idle"), 3000);
    } catch (error) {
      console.error(error);
      setResetState("error");
      setTimeout(() => setResetState("idle"), 3000);
    }
  };`;

content = content.replace(/  const \[sent, setSent\] = useState\(false\);\n  const \[err, setErr\] = useState\(""\);/, resetStateCode);

const newText = `            <div className="text-center mt-6">
              <button 
                onClick={handleResetDemo}
                disabled={resetState === "resetting"}
                className="text-white/25 hover:text-white text-xs cursor-pointer focus:outline-none transition-colors"
              >
                {resetState === "idle" && "SIH 2026 Demo | PS 26032 (Initialize Fresh Demo)"}
                {resetState === "resetting" && "Initializing Demo State..."}
                {resetState === "ready" && "✅ Demo Ready!"}
                {resetState === "error" && "❌ Failed to initialize demo"}
              </button>
            </div>`;

content = content.replace(/<p className="text-center text-white\/25 text-xs mt-6">.*?<\/p>/, newText);

fs.writeFileSync('client/src/pages/LoginPage.jsx', content);
console.log('Fixed LoginPage.jsx');
