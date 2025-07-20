import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { LockIcon, UserIcon } from "lucide-react";
import { loginUser } from "@/services/auth";
import type { LoginRequest, LoginResponse } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { setCookie } from "@/utils/cookies";
import { Link, useNavigate } from "@tanstack/react-router";

// API Response wrapper type
interface ApiResponse<T> {
  data: T;
  errors?: Array<{ field?: string; message: string }>;
}

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation<ApiResponse<LoginResponse>, Error, LoginRequest>({
    mutationFn: loginUser,
    onSuccess: (response) => {
      console.log("Login successful, full response:", response);
      
      // Extract token from the data property
      const token = response.data.token;
      if (!token) {
        console.error("No token found in response");
        return;
      }

      console.log("Login successful, setting token cookie");
      setCookie("access_token", token);

      // Decode JWT token
      const payload = parseJwt(token);
      console.log("JWT payload:", payload);

      if (!payload) {
        console.error("Failed to parse JWT token");
        return;
      }

      // Navigate based on role
      if (payload.role === "admin") {
        navigate({ to: "/admin/dashboard" });
      } else if (payload.role === "student") {
        navigate({ to: "/student/dashboard" });
      } else {
        console.error("Unknown role:", payload.role);
      }
    },
    onError: (error) => {
      console.error("Login mutation error:", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with:", { username });
    loginMutation.mutate({ username, password });
  };

  // Get error message from API response or mutation error
  const getErrorMessage = () => {
    if (loginMutation.error) {
      // Try to parse API error response
      try {
        const errorResponse = JSON.parse(loginMutation.error.message);
        if (errorResponse.errors && errorResponse.errors.length > 0) {
          return errorResponse.errors[0].message;
        }
      } catch (e) {
        // If parsing fails, return the original error message
        return loginMutation.error.message;
      }
    }
    return null;
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {getErrorMessage() && (
              <div className="text-sm text-destructive text-center">
                {getErrorMessage()}
              </div>
            )}
            <div className="relative">
              <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Username"
                className="pl-10"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <LockIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className="text-center text-sm text-muted-foreground mt-4">
            Don't have an account?{" "}
            <Link
              to="/gate/register"
              className="text-primary hover:underline font-medium"
            >
              Register now
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    console.error("Error parsing JWT token:", e);
    return null;
  }
}