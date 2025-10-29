import RegisterForm from "@/features/auth/ui/RegisterForm";
import { useRegisterModel } from "@/features/auth/model/useRegister";

export default function RegisterPage() {
  const {
    state: { form, errors, submitting, showPw, showPw2, passwordStrength },
    actions: { setShowPw, setShowPw2, onChange, onSubmit, googleLogin, microsoftLogin },
  } = useRegisterModel();

  return (
    <RegisterForm
      form={form}
      errors={errors}
      submitting={submitting}
      showPw={showPw}
      showPw2={showPw2}
      passwordStrength={passwordStrength}
      onChange={onChange}
      setShowPw={setShowPw}
      setShowPw2={setShowPw2}
      onSubmit={onSubmit}
      onGoogle={() => googleLogin()}
      onMicrosoft={microsoftLogin}
    />
  );
}
