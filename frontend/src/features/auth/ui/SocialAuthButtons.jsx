// src/features/auth/ui/SocialAuthButtons.jsx
import { IconButton, Tooltip } from "@mui/material";
import GoogleLogo from "./icons/GoogleLogo";
import MicrosoftLogo from "./icons/MicrosoftLogo";

export default function SocialAuthButtons({ onGoogle, onMicrosoft }) {
  return (
    <>
      <Tooltip title="Continuar con Google">
        <IconButton
          aria-label="Continuar con Google"
          onClick={onGoogle}
          sx={{
            width: 56, height: 56, borderRadius: "50%",
            border: "1px solid", borderColor: "divider",
            backgroundColor: "background.paper",
            "&:hover": { backgroundColor: "grey.50" },
          }}
        >
          <GoogleLogo />
        </IconButton>
      </Tooltip>

      <Tooltip title="Continuar con Microsoft">
        <IconButton
          aria-label="Continuar con Microsoft"
          onClick={onMicrosoft}
          sx={{
            width: 56, height: 56, borderRadius: "50%",
            border: "1px solid", borderColor: "divider",
            backgroundColor: "background.paper",
            "&:hover": { backgroundColor: "grey.50" },
          }}
        >
          <MicrosoftLogo />
        </IconButton>
      </Tooltip>
    </>
  );
}
