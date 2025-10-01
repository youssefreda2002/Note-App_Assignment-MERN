import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";

const SignupSchema = z.object({
  name: z.string().min(2, "Name required"),
  dob: z.string().min(1, "Date of birth required"),
  email: z.string().email("Valid email required"),
});
const SigninSchema = z.object({
  email: z.string().email("Valid email required"),
});

type SignupForm = z.infer<typeof SignupSchema>;
type SigninForm = z.infer<typeof SigninSchema>;

export default function AuthPage() {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [stage, setStage] = useState<"form" | "otp">("form");
  const [formData, setFormData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(SignupSchema),
  });
  const signinForm = useForm<SigninForm>({
    resolver: zodResolver(SigninSchema),
  });
  const otpForm = useForm<{ otp: string }>();

  // Request OTP
  async function handleSignup(data: SignupForm) {
    try {
      await api.post("/auth/request-otp", { email: data.email });
      setFormData({ ...data, type: "signup" });
      setStage("otp");
      setInfoMsg("OTP sent to your email");
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || "Failed to send OTP");
    }
  }
  async function handleSignin(data: SigninForm) {
    try {
      await api.post("/auth/request-otp", { email: data.email });
      setFormData({ ...data, type: "signin" });
      setStage("otp");
      setInfoMsg("OTP sent to your email");
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || "Failed to send OTP");
    }
  }

  async function handleVerify({ otp }: { otp: string }) {
    try {
      const resp = await api.post("/auth/verify-otp", { ...formData, otp });
      localStorage.setItem("token", resp.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || "Invalid OTP");
    }
  }

  function onGoogle() {
    const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const redirect = window.location.origin + "/oauth-redirect";
    window.location.href = `${BACKEND}/auth/google?redirect=${encodeURIComponent(
      redirect
    )}`;
  }

  return (
    <div className="min-h-screen grid grid-cols-1 gap-3 md:grid-cols-2 px-1 py-1">
      {/* Left panel */}
      <div className="flex md:w-[60%] flex-col justify-center md:ml-26 px-8 py-12">
        <div className="mb-10">
          <img src="/logo.png" alt="HD logo" className="h-8" />
        </div>

        <h2 className="text-3xl font-bold mb-2">
          Sign {mode === "signup" ? "up" : "in"}
        </h2>
        <p className="text-gray-500 mb-8">
          {mode === "signup"
            ? "Sign up to enjoy the feature of HD"
            : "Sign in to continue using HD"}
        </p>

        {errorMsg && <div className="text-red-600 mb-3">{errorMsg}</div>}
        {infoMsg && <div className="text-green-600 mb-3">{infoMsg}</div>}

        {/* Stage: form */}
        {stage === "form" && (
          <>
            {mode === "signup" ? (
              <form
                onSubmit={signupForm.handleSubmit(handleSignup)}
                className="space-y-4"
              >
                <InputField
                  label="Your Name"
                  name="name"
                  register={signupForm.register}
                />
                <InputField
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  register={signupForm.register}
                />
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  register={signupForm.register}
                />

                <button className="w-full bg-blue-600 text-white py-3 rounded">
                  Get OTP
                </button>
              </form>
            ) : (
              <form
                onSubmit={signinForm.handleSubmit(handleSignin)}
                className="space-y-4"
              >
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  register={signinForm.register}
                />

                <button className="w-full bg-blue-600 text-white py-3 rounded">
                  Get OTP
                </button>
              </form>
            )}
          </>
        )}

        {/* Stage: OTP */}
        {stage === "otp" && (
          <form
            onSubmit={otpForm.handleSubmit(handleVerify)}
            className="space-y-4"
          >
            <InputField label="OTP" name="otp" register={otpForm.register} />

            <button className="w-full bg-blue-600 text-white py-3 rounded">
              {mode === "signup" ? "Sign up" : "Sign in"}
            </button>
          </form>
        )}

        <button
          onClick={onGoogle}
          className="mt-4 w-full border py-2 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50"
        >
          <img src="/google.png" alt="google" className="h-5" />
          Continue with Google
        </button>

        {/* Toggle link */}
        <p className="mt-6 text-sm text-gray-500 text-center">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setStage("form");
                }}
                className="text-blue-600 hover:underline"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setStage("form");
                }}
                className="text-blue-600 hover:underline"
              >
                Sign up
              </button>
            </>
          )}
        </p>
      </div>

      {/* Right panel */}
      <div className=" hidden md:block -ml-14 h-full">
        <img
          src="auth-bg.jpg"
          alt="Background"
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>
    </div>
  );
}
