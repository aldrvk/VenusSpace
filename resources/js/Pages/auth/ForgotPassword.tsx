import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

// ── Logika kekuatan kata sandi ───────────────────────────────────────────────
type StrengthLevel = "empty" | "weak" | "strong" | "very-strong";

interface StrengthResult {
    level: StrengthLevel;
    score: number;
    checks: {
        length: boolean;
        uppercase: boolean;
        lowercase: boolean;
        number: boolean;
        symbol: boolean;
    };
}

function checkStrength(pwd: string): StrengthResult {
    const checks = {
        length: pwd.length >= 8,
        uppercase: /[A-Z]/.test(pwd),
        lowercase: /[a-z]/.test(pwd),
        number: /[0-9]/.test(pwd),
        symbol: /[^A-Za-z0-9]/.test(pwd),
    };
    const score = Object.values(checks).filter(Boolean).length;
    let level: StrengthLevel = "empty";
    if (pwd.length === 0) level = "empty";
    else if (score <= 2) level = "weak";
    else if (score <= 3) level = "strong";
    else level = "very-strong";
    return { level, score, checks };
}

const strengthConfig = {
    empty: { label: "", bars: 0, color: "bg-gray-200", text: "" },
    weak: {
        label: "Lemah",
        bars: 1,
        color: "bg-red-500",
        text: "text-red-500",
    },
    strong: {
        label: "Kuat",
        bars: 2,
        color: "bg-yellow-400",
        text: "text-yellow-500",
    },
    "very-strong": {
        label: "Sangat Kuat",
        bars: 3,
        color: "bg-[#3cdbc0]",
        text: "text-[#2ba898]",
    },
};

// ── Komponen FloatingInput ───────────────────────────────────────────────────
interface FloatingInputProps {
    id: string;
    label: string;
    type: string;
    value: string;
    onChange: (v: string) => void;
    eye?: boolean;
    onToggleEye?: () => void;
    maxLength?: number;
    placeholder?: string;
}

const FloatingInput = ({
    id,
    label,
    type,
    value,
    onChange,
    eye,
    onToggleEye,
    maxLength,
    placeholder = " ",
}: FloatingInputProps) => (
    <div className="relative">
        <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className="block px-5 pb-3 pt-6 w-full text-bodyM font-sans text-gray-900 bg-white/50 rounded-xl border border-white/60 appearance-none focus:outline-none focus:ring-2 focus:ring-[#3cdbc0] focus:bg-white peer transition-all duration-300 shadow-sm"
        />
        <label
            htmlFor={id}
            className="absolute text-labelSm font-sans text-[#065F51] duration-300 transform -translate-y-3 scale-85 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-3 peer-focus:text-[#3cdbc0]"
        >
            {label}
        </label>
        {eye && (
            <button
                type="button"
                onClick={onToggleEye}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3cdbc0] focus:outline-none transition-colors"
            >
                {type === "text" ? (
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                    </svg>
                ) : (
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                    </svg>
                )}
            </button>
        )}
    </div>
);

interface AuthModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    onSwitch?: (modal: "login" | "register" | "forgot-password") => void;
}

export default function ForgotPassword({
    isOpen = true,
    onClose,
    onSwitch,
}: AuthModalProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [step, setStep] = useState(1);

    // Step 2 states
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [strength, setStrength] = useState<StrengthResult>(checkStrength(""));

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        identifier: "", // Email
        otp: "",
        password: "",
        password_confirmation: "",
    });

    // Menangkap pesan sukses flash dari backend (OTP)
    const { flash } = usePage<any>().props;

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setIsLoaded(true), 50);
        } else {
            setIsLoaded(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (flash?.success && step === 1) {
            toast.success(flash.success, { duration: 6000 });
            setStep(2);
        }
    }, [flash, step]);

    const handlePasswordChange = (val: string) => {
        setData("password", val);
        setStrength(checkStrength(val));
    };

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();

        if (!data.identifier) {
            toast.error("Email tidak boleh kosong!");
            return;
        }

        try {
            const response = await axios.post("/forgot-password/otp", {
                identifier: data.identifier,
            });

            if (response.data.success) {
                toast.success("Kode OTP telah berhasil dikirim!", { duration: 4000 });
                setTimeout(() => setStep(2), 500);
            }
        } catch (error: any) {
            const errorMsg =
                error.response?.data?.message || "Gagal mengirim OTP";
            toast.error(errorMsg);
        }
    };

    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();

        if (data.otp.length !== 6) {
            toast.error("Kode OTP harus terdiri dari 6 digit.");
            return;
        }

        if (data.password !== data.password_confirmation) {
            toast.error("Kata sandi dan konfirmasi tidak cocok!");
            return;
        }

        if (strength.level === "weak" || strength.level === "empty") {
            toast.error("Kata sandi terlalu lemah!");
            return;
        }

        post("/forgot-password/reset", {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                // Saat sukses (misal diarahkan ke login)
                if (onSwitch) onSwitch("login");
            },
            onError: (errs) => {
                const first = Object.values(errs)[0];
                if (first) toast.error(first as string);
            },
        });
    };

    const cfg = strengthConfig[strength.level];

    if (!isOpen) return null;

    return (
        <>
            <Head title="Lupa Kata Sandi" />
            <Toaster 
                position="top-center" 
                toastOptions={{
                    style: { borderRadius: '10px', background: '#333', color: '#fff' },
                    success: { iconTheme: { primary: '#3cdbc0', secondary: '#fff' } }
                }} 
            />

            {/* Modal Overlay */}
            <div
                className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black/20 backdrop-blur-3xl font-sans p-3 sm:p-6 lg:p-8 transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
                onClick={onClose}
            >
                {/* Dekorasi blob latar belakang */}
                <div
                    className={`absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#40dfc0] rounded-full mix-blend-multiply filter blur-[80px] sm:blur-[100px] opacity-40 transition-transform duration-[2000ms] ${isLoaded ? "translate-x-0 translate-y-0" : "translate-x-20 -translate-y-20"}`}
                />
                <div
                    className={`absolute bottom-0 left-0 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-[#0b5c5a] rounded-full mix-blend-multiply filter blur-[90px] sm:blur-[120px] opacity-30 transition-transform duration-[2000ms] ${isLoaded ? "translate-x-0 translate-y-0" : "-translate-x-20 translate-y-20"}`}
                />

                {/* Card Modal */}
                <div
                    onClick={(e) => e.stopPropagation()}
                    className={`relative flex flex-col w-full max-w-[480px] h-auto rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.1)] lg:shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-white/60 backdrop-blur-3xl transition-all duration-1000 ease-out transform ${isLoaded ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-16 scale-95"}`}
                    style={{
                        background:
                            "linear-gradient(135deg,rgba(255,255,255,.85) 0%,rgba(255,255,255,.4) 100%)",
                    }}
                >
                    {/* ── Banner Atas ── */}
                    <div className="relative overflow-hidden rounded-t-2xl sm:rounded-t-[2.5rem]">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#40dfc0] to-[#0b5c5a]" />
                        <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10 text-white">
                            <p className="text-labelSm text-white/80 uppercase font-heading mb-1">Venus</p>
                            <h1 className="text-h3 text-white font-heading">
                                Ayo pergi ke Venus!
                            </h1>
                            <p className="text-white/80 text-body font-sans mt-2">
                                Kami memiliki lima unit bisnis yang menarik.
                            </p>
                        </div>
                    </div>

                    {/* ── Form Bawah ── */}
                    <div className="w-full flex flex-col bg-white/40 overflow-y-auto">
                        <div className="flex-1 flex items-start justify-center p-6 sm:p-10">
                            <div className="w-full py-2">
                                <div className="mb-8">
                                    <h2
                                        className={`text-[#065F51] text-h3 font-heading mb-2 transition-all duration-700 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                                    >
                                        Lupa Kata Sandi?
                                    </h2>
                                    <p
                                        className={`text-gray-600 text-body font-sans transition-all duration-700 delay-400 ${isLoaded ? "opacity-100" : "opacity-0"}`}
                                    >
                                        {step === 1
                                            ? "Masukkan email yang terdaftar pada akun Anda untuk menerima kode reset (OTP)."
                                            : "Kode reset telah dikirim! Masukkan kode OTP dan buat kata sandi baru Anda."}
                                    </p>
                                </div>

                                {step === 1 ? (
                                    /* ── TAHAP 1: Minta OTP ── */
                                    <form
                                        onSubmit={handleRequestOtp}
                                        className="space-y-5"
                                    >
                                        <div
                                            className={`transition-all duration-700 delay-[500ms] ${isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
                                        >
                                            <FloatingInput
                                                id="identifier"
                                                label="ALAMAT EMAIL"
                                                type="email"
                                                value={data.identifier}
                                                onChange={(v) =>
                                                    setData("identifier", v)
                                                }
                                            />
                                            {errors.identifier && (
                                                <p className="text-red-500 text-body font-sans mt-1 ml-1">
                                                    {errors.identifier}
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className={`w-full bg-gradient-to-r from-[#3cdbc0] to-[#2ba898] hover:to-[#218c7e] text-white text-labelSm font-sans uppercase py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_10px_20px_-5px_rgba(60,219,192,0.5)] shadow-[0_4px_10px_-2px_rgba(60,219,192,0.3)] disabled:opacity-60 disabled:cursor-not-allowed delay-[600ms] ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                                        >
                                            {processing
                                                ? "Memproses..."
                                                : "Kirim Kode OTP"}
                                        </button>
                                    </form>
                                ) : (
                                    /* ── TAHAP 2: Input OTP & Reset Password ── */
                                    <form
                                        onSubmit={handleResetPassword}
                                        className="space-y-4"
                                    >
                                        <div
                                            className={`transition-all duration-700 delay-300 ${isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
                                        >
                                            <FloatingInput
                                                id="otp"
                                                label="KODE OTP (6 DIGIT)"
                                                type="text"
                                                value={data.otp}
                                                onChange={(v) =>
                                                    setData(
                                                        "otp",
                                                        v.replace(
                                                            /[^0-9]/g,
                                                            "",
                                                        ),
                                                    )
                                                }
                                                maxLength={6}
                                            />
                                            {errors.otp && (
                                                <p className="text-red-500 text-body font-sans mt-1 ml-1">
                                                    {errors.otp}
                                                </p>
                                            )}
                                        </div>

                                        <div
                                            className={`transition-all duration-700 delay-400 ${isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
                                        >
                                            <FloatingInput
                                                id="password"
                                                label="KATA SANDI BARU"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={data.password}
                                                onChange={handlePasswordChange}
                                                eye
                                                onToggleEye={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                            />
                                            {errors.password && (
                                                <p className="text-red-500 text-body font-sans mt-1 ml-1">
                                                    {errors.password}
                                                </p>
                                            )}

                                            {data.password.length > 0 && (
                                                <div className="mt-2 px-1">
                                                    <div className="flex gap-1.5 mb-1">
                                                        {[1, 2, 3].map(
                                                            (bar) => (
                                                                <div
                                                                    key={bar}
                                                                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${cfg.bars >= bar ? cfg.color : "bg-gray-200"}`}
                                                                />
                                                            ),
                                                        )}
                                                    </div>
                                                    <p
                                                        className={`text-labelSm font-sans ${cfg.text}`}
                                                    >
                                                        {cfg.label}
                                                    </p>
                                                    <ul className="mt-2 space-y-0.5">
                                                        {[
                                                            {
                                                                key: "length",
                                                                text: "Minimal 8 karakter",
                                                            },
                                                            {
                                                                key: "uppercase",
                                                                text: "Huruf besar (A-Z)",
                                                            },
                                                            {
                                                                key: "lowercase",
                                                                text: "Huruf kecil (a-z)",
                                                            },
                                                            {
                                                                key: "number",
                                                                text: "Angka (0-9)",
                                                            },
                                                            {
                                                                key: "symbol",
                                                                text: "Karakter khusus (!@#$...)",
                                                            },
                                                        ].map(
                                                            ({ key, text }) => {
                                                                const ok =
                                                                    strength
                                                                        .checks[
                                                                        key as keyof typeof strength.checks
                                                                    ];
                                                                return (
                                                                    <li
                                                                        key={
                                                                            key
                                                                        }
                                                                        className={`flex items-center gap-1.5 text-body font-sans transition-colors ${ok ? "text-[#2ba898]" : "text-gray-400"}`}
                                                                    >
                                                                        <svg
                                                                            className="w-3.5 h-3.5 flex-shrink-0"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            viewBox="0 0 24 24"
                                                                        >
                                                                            {ok ? (
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth="3"
                                                                                    d="M5 13l4 4L19 7"
                                                                                />
                                                                            ) : (
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth="2"
                                                                                    d="M6 18L18 6M6 6l12 12"
                                                                                />
                                                                            )}
                                                                        </svg>
                                                                        {text}
                                                                    </li>
                                                                );
                                                            },
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        <div
                                            className={`transition-all duration-700 delay-500 ${isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
                                        >
                                            <FloatingInput
                                                id="password_confirmation"
                                                label="KONFIRMASI KATA SANDI BARU"
                                                type={
                                                    showConfirm
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={
                                                    data.password_confirmation
                                                }
                                                onChange={(v) =>
                                                    setData(
                                                        "password_confirmation",
                                                        v,
                                                    )
                                                }
                                                eye
                                                onToggleEye={() =>
                                                    setShowConfirm(!showConfirm)
                                                }
                                            />
                                            {data.password_confirmation.length >
                                                0 && (
                                                <p
                                                    className={`text-labelSm font-sans mt-1 ml-1 transition-colors ${data.password === data.password_confirmation ? "text-[#2ba898]" : "text-red-500"}`}
                                                >
                                                    {data.password ===
                                                    data.password_confirmation
                                                        ? "✓ Kata sandi cocok"
                                                        : "✗ Kata sandi tidak cocok"}
                                                </p>
                                            )}
                                        </div>

                                        <div
                                            className={`pt-2 transition-all duration-700 delay-600 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                                        >
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className={`w-full bg-gradient-to-r from-[#3cdbc0] to-[#2ba898] hover:to-[#218c7e] text-white text-labelSm font-sans uppercase py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_10px_20px_-5px_rgba(60,219,192,0.5)] shadow-[0_4px_10px_-2px_rgba(60,219,192,0.3)] disabled:opacity-60 disabled:cursor-not-allowed`}
                                            >
                                                {processing
                                                    ? "Memproses..."
                                                    : "Ubah Kata Sandi"}
                                            </button>
                                        </div>
                                    </form>
                                )}

                                <div
                                    className={`mt-8 text-center text-body font-sans text-[#4b5563] transition-all duration-700 delay-[900ms] ${isLoaded ? "opacity-100" : "opacity-0"}`}
                                >
                                    {onSwitch ? (
                                        <button
                                            type="button"
                                            onClick={() => onSwitch("login")}
                                            className="text-[#2ba898] font-bold hover:text-[#1c786c] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#2ba898] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
                                        >
                                            Kembali ke halaman Masuk
                                        </button>
                                    ) : (
                                        <Link
                                            href="/login"
                                            className="text-[#2ba898] font-bold hover:text-[#1c786c] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#2ba898] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
                                        >
                                            Kembali ke halaman Masuk
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
