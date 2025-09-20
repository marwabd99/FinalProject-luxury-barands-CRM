import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../slices/authSlice";
import { Box, TextField, Button, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, currentUser } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(login(form)).unwrap();
      toast.success("התחברת בהצלחה!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 10 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        התחברות למערכת CRM
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="אימייל"
          name="email"
          value={form.email}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          fullWidth
          label="סיסמה"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          התחבר
        </Button>
      </form>
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
