import React, { useEffect } from "react";
import {
  Avatar,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { MdLockOutline } from "react-icons/md";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import { loginApi } from "../../api";
import { useAuth } from "../../utils/context/AuthContext";
import "./login.css";
import { validateLogin } from "../../schemas/LoginSchema";
const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initialValues = { email: "", password: "" };
  const [credentials, setCredentials] = useState(initialValues);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState(initialValues);
  const [isLoading, setIsLoading] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleOnChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateLogin(credentials, setErrors)) {
      setIsLoading(true);
      try {
        const loginPromise = loginApi({
          email: credentials.email,
          password: credentials.password,
        });
        toast.promise(loginPromise, {
          pending: "Logging in...",
          success: "Login Successful!",
          error: {
            render({ data }) {
              // Extract and return the error message
              return data?.response?.data?.message || "Login Failed!";
            },
          },
        });
        const data = await loginPromise;
        if (data.success) {
          login(data.authToken);
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(location.state?.from || "/retailcrm/admin/home", {
        replace: true,
      });
    }
  }, [isAuthenticated]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "#1976d2" }}>
          <MdLockOutline />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            name={"email"}
            label={"Email"}
            value={credentials.email}
            onChange={handleOnChange}
            error={!!errors.email}
            helperText={errors.email}
            required
            fullWidth
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            value={credentials.password}
            error={!!errors.password}
            helperText={errors.password}
            name="password"
            onChange={handleOnChange}
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  onClick={handleClickShowPassword}
                  sx={{ cursor: "pointer" }}
                >
                  {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
