// src/features/auth/model/useLogin.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function useLoginModel() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [state, setState] = useState({
    email: "",
    password: "",
    showPw: false,
    loading: false,
    message: "",
    isSuccess: false,
  });

  const setEmail = (email) => setState((s) => ({ ...s, email }));
  const setPassword = (password) => setState((s) => ({ ...s, password }));
  const setShowPw = (showPw) => setState((s) => ({ ...s, showPw }));

  // src/features/auth/model/useLogin.js
const handleLogin = async (e) => {
  e?.preventDefault?.();
  setState((s) => ({ ...s, loading: true, message: "", isSuccess: false }));
  const res = await login(state.email, state.password);

  if (res?.success) {
    setState((s) => ({ 
      ...s, 
      loading: false, 
      isSuccess: true, 
      message: "Inicio de sesión exitoso" 
    }));
    
    // ✅ Retorna el resultado en lugar de navegar
    return {
      success: true,
      role: res?.user?.role,
      user: res?.user
    };
  }

  setState((s) => ({
    ...s,
    loading: false,
    isSuccess: false,
    message: res?.error || "No se pudo iniciar sesión",
  }));

  // ✅ Retorna también cuando falla
  return {
    success: false,
    error: res?.error || "No se pudo iniciar sesión"
  };
};

  const googleLogin = async () => {
    const res = await loginWithGoogle();
    if (res?.success) {
      const role = String(res?.user?.role || "").toLowerCase();
      navigate(role === "admin" ? "/admin" : "/dashboard");
    }
  };

  const microsoftLogin = () => {
    window.location.href = "https://login.microsoftonline.com/";
  };

  return {
    state,
    actions: {
      setEmail,
      setPassword,
      setShowPw,
      handleLogin,
      googleLogin,
      microsoftLogin,
    },
  };
}
