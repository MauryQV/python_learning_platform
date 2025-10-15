import { Box, LinearProgress, Typography } from "@mui/material";

function scorePassword(pw) {
  if (!pw) return 0;
  let score = 0;
  const rules = [
    /.{8,}/,         // length ≥ 8
    /[A-Z]/,         // uppercase
    /[a-z]/,         // lowercase
    /[0-9]/,         // number
    /[^A-Za-z0-9]/,  // symbol
  ];
  rules.forEach(r => { if (r.test(pw)) score += 20; });
  if (pw.length >= 12) score += 10;         // bonus
  if (/(.)\1\1/.test(pw)) score -= 10;      // penalty: triples
  return Math.max(0, Math.min(100, score));
}

export default function PasswordStrengthBar({ password }) {
  const value = scorePassword(password);
  const label =
    value < 40 ? "Weak" : value < 70 ? "Medium" : "Strong";

  return (
    <Box sx={{ mt: 1 }}>
      <LinearProgress variant="determinate" value={value} />
      <Typography variant="caption" color="text.secondary">
        Strength: {label}
      </Typography>
    </Box>
  );
}
