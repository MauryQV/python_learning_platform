// src/features/auth/model/useRegister.js
import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { registerUser } from "@/api/auth";          
import { useAuth } from "@/context/AuthContext";

const emailValid = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const pwValid = (p) => /.{8,}/.test(p) && /[A-Z]/.test(p) && /[a-z]/.test(p) && /[0-9]/.test(p);

export function useRegisterModel() {
  const nav = useNavigate();
  const { loginWithGoogle } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accepted: false,
  });
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const onChange = useCallback((k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
  }, []);

  const validate = useCallback(() => {
    const err = {};
    if (!form.firstName.trim()) err.firstName = "Obligatorio";
    if (!form.lastName.trim()) err.lastName = "Obligatorio";
    if (!emailValid(form.email)) err.email = "Email no válido";
    if (!pwValid(form.password)) err.password = "Min 8, mayúscula, minúscula, número";
    if (form.password !== form.confirmPassword) err.confirmPassword = "Las contraseñas no coinciden";
    if (!form.accepted) err.accepted = "Debes aceptar los Términos y Condiciones";
    setErrors(err);
    return Object.keys(err).length === 0;
  }, [form]);

  const onSubmit = useCallback(async (e) => {
    e?.preventDefault?.();
    if (!validate()) return;

    try {
      setSubmitting(true);
      setErrors((prev) => ({ ...prev, submit: undefined }));

      
      const res = await registerUser(
        form.firstName,
        form.lastName,
        form.email,
        form.password,
        form.confirmPassword
      );

      if (!res?.success) {
        setErrors((prev) => ({ ...prev, submit: res?.message || "No se pudo registrar" }));
        return;
      }

      
      localStorage.setItem("pendingEmail", form.email);
      nav("/verify-email");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "No se pudo crear la cuenta. Intenta de nuevo.";
      setErrors((prev) => ({ ...prev, submit: msg }));
    } finally {
      setSubmitting(false);
    }
  }, [form, nav, validate]);

  
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const idToken = tokenResponse?.credential || tokenResponse?.access_token;
      if (!idToken) return;
      const res = await loginWithGoogle(idToken);
      if (res?.success) nav("/dashboard");
    },
    onError: () => {
      setErrors((prev) => ({ ...prev, submit: "Error con Google Login. Intenta de nuevo." }));
    },
    flow: "implicit",
  });

  const microsoftLogin = () => {
    
    window.location.href = "https://login.microsoftonline.com/";
  };

  const passwordStrength = useMemo(() => form.password, [form.password]);

  return {
    state: {
      form,
      showPw,
      showPw2,
      errors,
      submitting,
      passwordStrength,
    },
    actions: {
      setShowPw,
      setShowPw2,
      onChange,
      onSubmit,
      googleLogin,
      microsoftLogin,
    },
  };
}
