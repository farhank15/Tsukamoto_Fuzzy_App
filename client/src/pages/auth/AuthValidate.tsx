import { z } from "zod/v4";

const usernameSchema = z
  .string()
  .nonempty("Username is required.")
  .min(3, "Username must be at least 3 characters.");

const passwordSchema = z
  .string()
  .nonempty("Password is required.")
  .min(6, "Password must be at least 6 characters.");

const nameSchema = z
  .string()
  .nonempty("Full name is required.")
  .min(2, "Full name must be at least 2 characters.");

const universityIdSchema = z
  .string()
  .nonempty("Please select a university.");

const universityNameSchema = z
  .string()
  .nonempty("University name is required.")
  .min(2, "University name must be at least 2 characters.");

const universityAddressSchema = z
  .string()
  .nonempty("University address is required.")
  .min(5, "University address must be at least 5 characters.");

export const registerSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  name: nameSchema,
  role: z.literal("student"),
  university_id: z.string().optional(),
  university_name: z.string().optional(),
  university_address: z.string().optional(),
}).refine(
  (data) => {
    // If mode is "select", university_id is required
    // If mode is "create", university_name and university_address are required
    return (data.university_id && data.university_id.length > 0) || 
           (data.university_name && data.university_name.length > 0 && 
            data.university_address && data.university_address.length > 0);
  },
  {
    message: "Please either select a university or provide university details",
    path: ["university"],
  }
);

export function validateUsername(value: string): true | string {
  const result = usernameSchema.safeParse(value);
  return result.success ? true : result.error.issues[0].message;
}

export function validatePassword(value: string): true | string {
  const result = passwordSchema.safeParse(value);
  return result.success ? true : result.error.issues[0].message;
}

export function validateName(value: string): true | string {
  const result = nameSchema.safeParse(value);
  return result.success ? true : result.error.issues[0].message;
}

export function validateUniversityId(value: string): true | string {
  const result = universityIdSchema.safeParse(value);
  return result.success ? true : result.error.issues[0].message;
}

export function validateUniversityName(value: string): true | string {
  const result = universityNameSchema.safeParse(value);
  return result.success ? true : result.error.issues[0].message;
}

export function validateUniversityAddress(value: string): true | string {
  const result = universityAddressSchema.safeParse(value);
  return result.success ? true : result.error.issues[0].message;
}

export function validateRegisterForm(data: any, mode: "select" | "create"): { success: boolean; errors: Record<string, string> } {
  const validationData = {
    ...data,
    university_id: mode === "select" ? data.university_id : undefined,
    university_name: mode === "create" ? data.university_name : undefined,
    university_address: mode === "create" ? data.university_address : undefined,
  };

  const result = registerSchema.safeParse(validationData);
  
  if (result.success) {
    return { success: true, errors: {} };
  }

  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    errors[path] = issue.message;
  });

  return { success: false, errors };
}