import { useState, useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/services/auth";
import { getAllUniversities } from "@/services/university";
import { toast } from "sonner";
import type { University } from "@/types/university";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  validateUsername,
  validatePassword,
  validateName,
  validateUniversityId,
  validateUniversityName,
  validateUniversityAddress,
  validateRegisterForm,
} from "./AuthValidate";

export function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"select" | "create">("select");
  const [universities, setUniversities] = useState<University[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    role: "student" as const,
    university_id: "",
    university_name: "",
    university_address: "",
  });

  useEffect(() => {
    async function fetchUniversities() {
      try {
        const data = await getAllUniversities();
        setUniversities(data);
      } catch (error) {
        console.error("Error fetching universities:", error);
        toast.error("Failed to load universities");
      }
    }

    fetchUniversities();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));

    // Real-time validation
    let validationResult: true | string = true;
    switch (name) {
      case "username":
        validationResult = validateUsername(value);
        break;
      case "password":
        validationResult = validatePassword(value);
        break;
      case "name":
        validationResult = validateName(value);
        break;
      case "university_name":
        validationResult = validateUniversityName(value);
        break;
      case "university_address":
        validationResult = validateUniversityAddress(value);
        break;
    }

    // Clear or set error
    setErrors((prev) => ({
      ...prev,
      [name]: validationResult === true ? "" : validationResult,
    }));
  }

  function handleSelectChange(value: string) {
    setForm((f) => ({ ...f, university_id: value }));
    
    // Validate university selection
    const validationResult = validateUniversityId(value);
    setErrors((prev) => ({
      ...prev,
      university_id: validationResult === true ? "" : validationResult,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Validate entire form
    const validation = validateRegisterForm(form, mode);
    
    if (!validation.success) {
      setErrors(validation.errors);
      toast.error("Please fix the validation errors");
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const registerData = {
        ...form,
        university_id: mode === "select" ? Number(form.university_id) : undefined,
        university_name: mode === "create" ? form.university_name : undefined,
        university_address: mode === "create" ? form.university_address : undefined,
      };

      await registerUser(registerData);
      toast.success("Registration successful!");
      navigate({ to: "/gate/login" });
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error instanceof Error ? error.message : "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs space-y-4 bg-card p-6 rounded-lg shadow"
      >
        <h2 className="text-xl font-semibold mb-2">Register</h2>
        
        <div className="space-y-1">
          <Input
            id="username"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            disabled={loading}
            className={errors.username ? "border-red-500" : ""}
          />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username}</p>
          )}
        </div>

        <div className="space-y-1">
          <Input
            id="name"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div className="space-y-1">
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
            minLength={6}
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        <div className="space-y-2 w-full">
          <label className="text-sm font-medium">University</label>
          <Select
            value={mode}
            onValueChange={(value: "select" | "create") => {
              setMode(value);
              setForm((f) => ({
                ...f,
                university_id: "",
                university_name: "",
                university_address: "",
              }));
              // Clear university-related errors
              setErrors((prev) => ({
                ...prev,
                university_id: "",
                university_name: "",
                university_address: "",
                university: "",
              }));
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose option" />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectItem value="select">Select Existing</SelectItem>
              <SelectItem value="create">Create New</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {mode === "select" ? (
          <div className="space-y-2 w-full">
            <label className="text-sm font-medium">Select University</label>
            <Select
              value={form.university_id}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger className={`w-full ${errors.university_id ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Choose university" />
              </SelectTrigger>
              <SelectContent>
                {universities.map((univ) => (
                  <SelectItem key={univ.id} value={String(univ.id)}>
                    {univ.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.university_id && (
              <p className="text-sm text-red-500">{errors.university_id}</p>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <Input
                id="university_name"
                name="university_name"
                placeholder="University Name"
                value={form.university_name}
                onChange={handleChange}
                required
                disabled={loading}
                className={errors.university_name ? "border-red-500" : ""}
              />
              {errors.university_name && (
                <p className="text-sm text-red-500">{errors.university_name}</p>
              )}
            </div>

            <div className="space-y-1">
              <Input
                id="university_address"
                name="university_address"
                placeholder="University Address"
                value={form.university_address}
                onChange={handleChange}
                required
                disabled={loading}
                className={errors.university_address ? "border-red-500" : ""}
              />
              {errors.university_address && (
                <p className="text-sm text-red-500">{errors.university_address}</p>
              )}
            </div>
          </>
        )}

        {errors.university && (
          <p className="text-sm text-red-500">{errors.university}</p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
        
        <div className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link to="/gate/login" className="text-primary hover:underline">
            Login here
          </Link>
        </div>
      </form>
    </div>
  );
}