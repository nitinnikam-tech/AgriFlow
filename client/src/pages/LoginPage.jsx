import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Wheat, Shield, BarChart3, Phone, KeyRound, ChevronRight, Loader2, CheckCircle2 } from "lucide-react";

const ROLES = [
  { id: "FARMER", label: "Farmer / Kisan", sub: "Smart slot booking & live queue tracking", icon: Wheat, phone: "9876543210" },
  { id: "OFFICIAL", label: "Procurement Officer", sub: "Counter management & quality inspection", icon: Shield, phone: "9000000001" },
  { id: "ADMIN", label: "Centre Admin", sub: "Digital twin & slot optimization", icon: Shield, phone: "9000000002" },
  { id: "DISTRICT_ADMIN", label: "District Authority", sub: "Analytics, anomaly alerts & mandi oversight", icon: BarChart3, phone: "9000000003" },
];

const DEMO_DATA = {
  FARMER: { id: "FMR-1002", name: "Ramesh Patil", village: "Shirur, Pune", token: "A-127" },
  OFFICIAL: { id: "OFF-001", name: "Sanjay Kumar", centre: "Pune APMC", badge: "OFF-2134" },
  ADMIN: { id: "ADM-001", name: "Priya Deshmukh", centre: "Pune APMC", badge: "ADM-0021" },
  DISTRICT_ADMIN: { id: "DST-001", name: "Collector R. Sharma", district: "Pune", badge: "IAS-2019" },
};

const DEST = { FARMER: "/", OFFICIAL: "/officer", ADMIN: "/admin", DISTRICT_ADMIN: "/analytics" };

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState("role");
  const [role, setRole] = useState(null);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  const selectRole = (r) => { setRole(r); setPhone(r.phone); setStep("otp"); setErr(""); };

  const sendOtp = async () => {
    if (phone.length !== 10) { setErr("Enter a valid 10-digit mobile number"); return; }
    setLoading(true); setErr("");
    await new Promise(r => setTimeout(r, 1000));
    setSent(true); setLoading(false);
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) { setErr("Enter the 6-digit OTP"); return; }
    setLoading(true); setErr("");
    await new Promise(r => setTimeout(r, 900));
    if (otp !== "123456") { setLoading(false); setErr("Invalid OTP. Use 123456 for SIH demo."); return; }
    const userData = { ...DEMO_DATA[role.id], role: role.id, phone, loginAt: new Date().toISOString() };
    login(userData);
    setStep("success"); setLoading(false);
    setTimeout(() => navigate(DEST[role.id]), 1400);
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
            <p className="text-center text-white/25 text-xs mt-6">SIH 2026 Demo · PS 26032 · All data is simulated</p>
          </div>
        )}

        {step === "otp" && role && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <button onClick={() => { setStep("role"); setSent(false); setOtp(""); setErr(""); }}
              className="text-white/30 hover:text-white text-sm mb-4 flex items-center gap-1 transition-colors">
              ← Back
            </button>
            <h2 className="text-white font-semibold text-lg mb-1">Login as {role.label}</h2>
            <p className="text-white/40 text-sm mb-5">Enter your registered mobile number</p>
            <div className="space-y-4">
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