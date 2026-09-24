import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { Wheat, Shield, BarChart3, Phone, KeyRound, ChevronRight, Loader2, CheckCircle2, User, Lock } from "lucide-react";

const ROLES = [
  { id: "FARMER", label: "Farmer / Kisan", sub: "Smart slot booking & live queue tracking", icon: Wheat, phone: "9876543210" },
  { id: "OFFICER", label: "Procurement Officer", sub: "Counter management & quality inspection", icon: Shield, email: "officer@agriflow.gov.in" },
  { id: "CENTRE_ADMIN", label: "Centre Admin", sub: "Digital twin & slot optimization", icon: Shield, email: "admin@agriflow.gov.in" },
  { id: "DISTRICT_ADMIN", label: "District Authority", sub: "Analytics, anomaly alerts & mandi oversight", icon: BarChart3, email: "district@agriflow.gov.in" },
];

const DEST = { FARMER: "/", OFFICER: "/officer", CENTRE_ADMIN: "/admin", DISTRICT_ADMIN: "/analytics" };

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState("role");
  const [role, setRole] = useState(null);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [resetState, setResetState] = useState("idle");
  const [farmerName, setFarmerName] = useState("Ramesh Patil");
  const [village, setVillage] = useState("Khed Shivapur");
  const [district, setDistrict] = useState("Pune");
  const [stateName, setStateName] = useState("Maharashtra");

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
  };

  const selectRole = (r) => { 
    setRole(r); 
    setErr("");
    if (r.id === "FARMER") {
      setPhone(r.phone); 
      setStep("otp"); 
    } else {
      setEmail(r.email);
      setPassword("123456"); // Pre-filled for demo
      setStep("password");
    }
  };

  const sendOtp = async () => {
    if (phone.length !== 10) { setErr("Enter a valid 10-digit mobile number"); return; }
    setLoading(true); setErr("");
    try {
      await api.sendOtp(phone);
      setSent(true); 
    } catch (error) {
      setErr("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
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
  };

  const loginOfficial = async () => {
    if (!email || !password) { setErr("Email and password required"); return; }
    setLoading(true); setErr("");
    try {
      const res = await api.officialLogin(email, password, role.id);
      if (res.success) {
        login(res.user, res.token);
        setStep("success");
        setTimeout(() => navigate(DEST[role.id]), 1400);
      } else {
        setErr(res.error || "Login failed");
      }
    } catch (error) {
      setErr(error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-agri-950 via-agri-900 to-doca-900 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="p-3 bg-agri-500/20 rounded-2xl border border-agri-500/30">
            <Wheat className="w-10 h-10 text-agri-400" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold text-white tracking-tight">AgriFlow</h1>
            <p className="text-agri-400 text-sm font-medium">Smart Procurement Queue Platform</p>
          </div>
        </div>
        <p className="text-white/40 text-xs mt-1">DoCA · Ministry of Consumer Affairs · SIH 2026</p>
      </div>

      <div className="w-full max-w-md">
        {step === "role" && (
          <div>
            <p className="text-white/60 text-center text-sm mb-5">Select your role to continue</p>
            <div className="space-y-3">
              {ROLES.map(r => {
                const Icon = r.icon;
                return (
                  <button key={r.id} onClick={() => selectRole(r)}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-agri-500/40 rounded-2xl p-4 text-left transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-agri-500/10 group-hover:bg-agri-500/20 rounded-xl transition-colors">
                        <Icon className="w-5 h-5 text-agri-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white text-sm">{r.label}</div>
                        <div className="text-white/40 text-xs mt-0.5 truncate">{r.sub}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-agri-400 transition-colors" />
                    </div>
                  </button>
                );
              })}
            </div>
                        <div className="text-center mt-6">
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
            </div>
          </div>
        )}

        {step === "otp" && role && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <button onClick={() => { setStep("role"); setSent(false); setOtp(""); setErr(""); }}
              className="text-white/30 hover:text-white text-sm mb-4 flex items-center gap-1 transition-colors">
              ← Back
            </button>
            <h2 className="text-white font-semibold text-lg mb-1">Login as {role.label}</h2>
            <p className="text-white/40 text-sm mb-5">Enter your details to login</p>
            <div className="space-y-4">
              <div>
                <label className="text-white/50 text-xs font-medium mb-1.5 block">Farmer Name</label>
                <input type="text" value={farmerName}
                  onChange={e => setFarmerName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-agri-500/50"
                  placeholder="Enter farmer name" />
              </div>
              <div>
                <label className="text-white/50 text-xs font-medium mb-1.5 block">Mobile Number</label>
                <div className="flex gap-2">
                  <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white/50 text-sm">+91</div>
                  <input type="tel" maxLength={10} value={phone}
                    onChange={e => { setPhone(e.target.value.replace(/\D/g, "")); setSent(false); setOtp(""); }}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-agri-500/50"
                    placeholder="9876543210" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/50 text-xs font-medium mb-1.5 block">Village</label>
                  <input type="text" value={village}
                    onChange={e => setVillage(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-agri-500/50"
                    placeholder="Enter village" />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-medium mb-1.5 block">District</label>
                  <input type="text" value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-agri-500/50"
                    placeholder="Enter district" />
                </div>
              </div>
              <div>
                <label className="text-white/50 text-xs font-medium mb-1.5 block">State</label>
                <input type="text" value={stateName}
                  onChange={e => setStateName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-agri-500/50"
                  placeholder="Enter state" />
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
                      onChange={e => { setOtp(e.target.value.replace(/\D/g, "")); setErr(""); }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-xl font-mono tracking-[0.5em] placeholder-white/20 focus:outline-none focus:border-agri-500/50 text-center"
                      placeholder="······" />
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
        )}

        {step === "password" && role && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <button onClick={() => { setStep("role"); setErr(""); }}
              className="text-white/30 hover:text-white text-sm mb-4 flex items-center gap-1 transition-colors">
              ← Back
            </button>
            <h2 className="text-white font-semibold text-lg mb-1">Login as {role.label}</h2>
            <p className="text-white/40 text-sm mb-5">Enter your official credentials</p>
            <div className="space-y-4">
              <div>
                <label className="text-white/50 text-xs font-medium mb-1.5 block">Official Email</label>
                <div className="flex gap-2">
                  <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white/50 text-sm flex items-center"><User className="w-4 h-4" /></div>
                  <input type="email" value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-agri-500/50"
                    placeholder="email@agriflow.gov.in" />
                </div>
              </div>
              
              <div>
                <label className="text-white/50 text-xs font-medium mb-1.5 block">Password</label>
                <div className="flex gap-2">
                  <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white/50 text-sm flex items-center"><Lock className="w-4 h-4" /></div>
                  <input type="password" value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-agri-500/50"
                    placeholder="••••••" />
                </div>
              </div>

              <button onClick={loginOfficial} disabled={loading}
                className="w-full bg-agri-600 hover:bg-agri-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm mt-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                {loading ? "Authenticating..." : "Login to Portal"}
              </button>
              {err && <p className="text-red-400 text-xs text-center">{err}</p>}
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="bg-white/5 border border-agri-500/20 rounded-2xl p-10 text-center">
            <CheckCircle2 className="w-16 h-16 text-agri-400 mx-auto mb-4" />
            <h2 className="text-white font-bold text-xl mb-2">Welcome!</h2>
            <p className="text-white/50 text-sm">Redirecting to your dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
}