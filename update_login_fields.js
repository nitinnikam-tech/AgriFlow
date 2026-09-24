const fs = require('fs');
let content = fs.readFileSync('client/src/pages/LoginPage.jsx', 'utf8');

// Add state variables
const stateVarsCode = `  const [resetState, setResetState] = useState("idle");
  const [farmerName, setFarmerName] = useState("Ramesh Patil");
  const [village, setVillage] = useState("Khed Shivapur");
  const [district, setDistrict] = useState("Pune");
  const [stateName, setStateName] = useState("Maharashtra");`;

content = content.replace(/  const \[resetState, setResetState\] = useState\("idle"\);/, stateVarsCode);

// Update verifyOtp
const verifyOtpReplacement = `  const verifyOtp = async () => {
    if (otp.length !== 6) { setErr("Enter the 6-digit OTP"); return; }
    setLoading(true); setErr("");
    try {
      const res = await api.verifyOtp(phone, otp, farmerName, village, district, stateName);
      if (res.success) {
        login(res.user, res.token);
        setStep("success");
        setTimeout(() => navigate(DEST[role.id]), 1400);
      } else {
        setErr(res.error || "Invalid OTP");
      }
    } catch (error) {
      setErr(error.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };`;
content = content.replace(/  const verifyOtp = async \(\) => {[\s\S]*?setLoading\(false\);\n    }\n  };/, verifyOtpReplacement);

// Update OTP step rendering
const otpRenderCode = `        {step === "otp" && role && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <button onClick={() => { setStep("role"); setSent(false); setOtp(""); setErr(""); }}
              className="text-white/30 hover:text-white text-sm mb-4 flex items-center gap-1 transition-colors">
              ← Back
            </button>
            <h2 className="text-white font-semibold text-lg mb-1">Login as {role.label}</h2>
            <p className="text-white/40 text-sm mb-5">Enter your details and mobile number</p>
            <div className="space-y-4">
              
              <div>
                <label className="text-white/50 text-xs font-medium mb-1.5 block">Farmer Name</label>
                <input type="text" value={farmerName}
                  onChange={e => setFarmerName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-agri-500/50"
                  placeholder="Ramesh Patil" />
              </div>

              <div>
                <label className="text-white/50 text-xs font-medium mb-1.5 block">Mobile Number</label>
                <div className="flex gap-2">
                  <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white/50 text-sm">+91</div>
                  <input type="tel" maxLength={10} value={phone}
                    onChange={e => { setPhone(e.target.value.replace(/\\D/g, "")); setSent(false); setOtp(""); }}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-agri-500/50"
                    placeholder="9876543210" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-white/50 text-xs font-medium mb-1.5 block">Village</label>
                  <input type="text" value={village}
                    onChange={e => setVillage(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-agri-500/50"
                    placeholder="Khed Shivapur" />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-medium mb-1.5 block">District</label>
                  <input type="text" value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-agri-500/50"
                    placeholder="Pune" />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-medium mb-1.5 block">State</label>
                  <input type="text" value={stateName}
                    onChange={e => setStateName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-agri-500/50"
                    placeholder="Maharashtra" />
                </div>
              </div>

              {!sent ? (
                <button onClick={sendOtp} disabled={loading}
                  className="w-full bg-agri-600 hover:bg-agri-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
                  {loading ? "Sending OTP..." : "Send OTP via SMS"}
                </button>
              ) : (
                <>
                  <div className="bg-agri-900/50 border border-agri-700/30 rounded-xl p-3 text-center">
                    <p className="text-agri-300 text-xs">OTP sent to +91 {phone}</p>
                    <p className="text-white/40 text-xs mt-0.5">Use <span className="font-mono font-bold text-white">123456</span> for SIH demo</p>
                  </div>
                  <div>
                    <label className="text-white/50 text-xs font-medium mb-1.5 block">6-digit OTP</label>
                    <input type="tel" maxLength={6} value={otp}
                      onChange={e => { setOtp(e.target.value.replace(/\\D/g, "")); setErr(""); }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-xl font-mono tracking-[0.5em] placeholder-white/20 focus:outline-none focus:border-agri-500/50 text-center"
                      placeholder="••••••" />
                  </div>
                  <button onClick={verifyOtp} disabled={loading}
                    className="w-full bg-agri-600 hover:bg-agri-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                    {loading ? "Verifying..." : "Verify & Enter"}
                  </button>
                </>
              )}
              {err && <p className="text-red-400 text-xs text-center">{err}</p>}
            </div>
          </div>
        )}`;

content = content.replace(/{step === "otp" && role && \([\s\S]*?\n          \)\}/, otpRenderCode);

fs.writeFileSync('client/src/pages/LoginPage.jsx', content);
console.log('Fixed LoginPage.jsx');
