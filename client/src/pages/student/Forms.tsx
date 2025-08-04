import * as React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAcademicRecord,
  updateAcademicRecord,
  getAcademicRecordsByStudentId,
} from "@/services/academic";
import type {
  AcademicRequest,
  AcademicUpdateRequest,
  AcademicRecord,
  AcademicFormState,
} from "@/types/academic";
import {
  getCookie,
  decodeJwtPayload,
  getUniversityFromAccessTokenCookie,
} from "@/lib/JwtDecode";
import {
  validateGPA,
  validateAttendance,
  validateMidterm,
  validateCoreCourse,
  validateFinalExamScore,
} from "./FormValidators";
import {
  formatAttendanceForForm,
  parseAttendanceForSubmit,
} from "@/utils/attendanceFormat";

function useDebouncedEffect(
  effect: () => void,
  deps: React.DependencyList,
  delay: number
) {
  const callback = React.useRef(effect);
  React.useEffect(() => {
    callback.current = effect;
  }, [effect]);
  React.useEffect(() => {
    if (delay === null) return;
    const handler = setTimeout(() => callback.current(), delay);
    return () => clearTimeout(handler);
  }, [...deps, delay]);
}

type AcademicFormProps = {
  studentId?: string;
  universityId?: string | number; // Add this prop to accept university ID from parent
};

export default function AcademicForm({
  studentId,
  universityId: propUniversityId,
}: AcademicFormProps) {
  const token = getCookie("access_token");
  const payload = token
    ? decodeJwtPayload<{ user_id?: number; university_id?: number }>(token)
    : null;
  const student_id = studentId ? Number(studentId) : payload?.user_id;

  // Use prop universityId first, then fallback to token-based logic
  const university_id = propUniversityId
    ? Number(propUniversityId)
    : getUniversityFromAccessTokenCookie() != null
      ? Number(getUniversityFromAccessTokenCookie())
      : payload?.university_id;

  React.useEffect(() => {
    console.log({
      token,
      payload,
      student_id,
      university_id,
      propUniversityId,
      message: "JWT and ID values at component mount",
    });
  }, [token, payload, student_id, university_id, propUniversityId]);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<AcademicRecord[]>({
    queryKey: ["academic", student_id],
    queryFn: () => getAcademicRecordsByStudentId(student_id!),
    enabled: !!student_id,
    retry: (failureCount, err: any) => {
      if (err.response?.status === 404) return false;
      return failureCount < 3;
    },
  });

  const existing = data && data.length > 0 ? data[0] : null;

  const [form, setForm] = React.useState<AcademicFormState | null>(null);
  const [editMode, setEditMode] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isLoading) return;

    console.log({
      isLoading,
      existing,
      student_id,
      university_id,
      data,
      error,
      message: "Form initialization check",
    });

    if (existing) {
      setForm({
        student_id: existing.student_id,
        university_id: existing.university_id,
        core_course_average: existing.core_course_average.toString(),
        attendance_rate: formatAttendanceForForm(existing.attendance_rate),
        final_exam_score: existing.final_exam_score.toString(),
        gpa: existing.gpa.toString(),
        midterm_exam_score: existing.midterm_exam_score.toString(),
      });
      setEditMode(true);
    } else if (student_id != null && university_id != null) {
      setForm({
        student_id,
        university_id,
        core_course_average: "0",
        attendance_rate: "0",
        final_exam_score: "0",
        gpa: "0",
        midterm_exam_score: "0",
      });
      setEditMode(false);
    }
  }, [existing, student_id, university_id, isLoading, data, error]);

  const updateMutation = useMutation({
    mutationFn: (payload: { id: number; data: AcademicUpdateRequest }) => {
      console.log("Sending data to updateAcademicRecord:", payload);
      return updateAcademicRecord(payload.id, payload.data);
    },
    onMutate: () => setSaving(true),
    onSuccess: () => {
      setSaving(false);
      setErrorMessage(null);
      queryClient.invalidateQueries({ queryKey: ["academic", student_id] });
    },
    onError: (err: any) => {
      setSaving(false);
      setErrorMessage(err.response?.data?.message || "Failed to update");
      console.error("Update mutation error:", err);
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: AcademicRequest) => {
      console.log("Sending data to createAcademicRecord:", data);
      return createAcademicRecord(data);
    },
    onMutate: () => setSaving(true),
    onSuccess: () => {
      setSaving(false);
      setErrorMessage(null);
      setEditMode(true);
      queryClient.invalidateQueries({ queryKey: ["academic", student_id] });
    },
    onError: (err: any) => {
      setSaving(false);
      setErrorMessage(err.response?.data?.message || "Failed to create");
      console.error("Create mutation error:", err);
    },
  });

  const convertFormToNumbers = (formData: AcademicFormState) => {
    return {
      student_id: formData.student_id,
      university_id: formData.university_id,
      core_course_average: parseFloat(
        Number(formData.core_course_average || 0).toFixed(2)
      ),
      attendance_rate: parseFloat(
        parseAttendanceForSubmit(
          String(formData.attendance_rate || "0")
        ).toFixed(2)
      ),
      final_exam_score: parseFloat(
        Number(formData.final_exam_score || 0).toFixed(2)
      ),
      gpa: parseFloat(Number(formData.gpa || 0).toFixed(2)),
      midterm_exam_score: parseFloat(
        Number(formData.midterm_exam_score || 0).toFixed(2)
      ),
    };
  };

  useDebouncedEffect(
    () => {
      if (!form || student_id == null || university_id == null) return;

      const formattedData = convertFormToNumbers(form);

      const validators = [
        validateGPA(String(form.gpa || 0)),
        validateAttendance(String(form.attendance_rate || 0)),
        validateMidterm(String(form.midterm_exam_score || 0)),
        validateCoreCourse(String(form.core_course_average || 0)),
        validateFinalExamScore(String(form.final_exam_score || 0)),
      ];

      if (validators.some((v) => v !== true)) {
        setErrorMessage("Please fix invalid fields before saving.");
        return;
      }

      console.log("Formatted data to be sent:", formattedData);

      if (editMode && existing) {
        const changed =
          formattedData.core_course_average !==
            parseFloat(Number(existing.core_course_average).toFixed(2)) ||
          formattedData.attendance_rate !==
            parseFloat(Number(existing.attendance_rate).toFixed(2)) ||
          formattedData.final_exam_score !==
            parseFloat(Number(existing.final_exam_score).toFixed(2)) ||
          formattedData.gpa !== parseFloat(Number(existing.gpa).toFixed(2)) ||
          formattedData.midterm_exam_score !==
            parseFloat(Number(existing.midterm_exam_score).toFixed(2));

        if (changed) {
          console.log("Sending update to backend:", formattedData);
          updateMutation.mutate({
            id: existing.id,
            data: {
              core_course_average: formattedData.core_course_average,
              attendance_rate: formattedData.attendance_rate,
              final_exam_score: formattedData.final_exam_score,
              gpa: formattedData.gpa,
              midterm_exam_score: formattedData.midterm_exam_score,
            },
          });
        }
      } else if (!editMode) {
        console.log("Sending create to backend:", formattedData);
        createMutation.mutate(formattedData);
      }
    },
    [form, editMode, existing, student_id, university_id],
    5000
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof AcademicRequest
  ) {
    let value = e.target.value;

    if (value !== "" && isNaN(Number(value))) {
      return;
    }

    setForm((prev) =>
      prev
        ? {
            ...prev,
            [key]: value,
          }
        : prev
    );
  }

  const validation = {
    gpa: form ? validateGPA(String(form.gpa || "")) : true,
    attendance_rate: form
      ? validateAttendance(String(form.attendance_rate || ""))
      : true,
    midterm_exam_score: form
      ? validateMidterm(String(form.midterm_exam_score || ""))
      : true,
    core_course_average: form
      ? validateCoreCourse(String(form.core_course_average || ""))
      : true,
    final_exam_score: form
      ? validateFinalExamScore(String(form.final_exam_score || ""))
      : true,
  };

  if (isLoading && !form) {
    return (
      <Card className="w-full mx-auto mt-4">
        <CardHeader>
          <CardTitle>Academic Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-8 w-full mb-4" />
        </CardContent>
      </Card>
    );
  }

  const isAxiosErrorWithResponse = (
    err: unknown
  ): err is { response: { status: number } } =>
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    typeof (err as any).response === "object" &&
    (err as any).response !== null &&
    "status" in (err as any).response;

  if (
    isError &&
    (!isAxiosErrorWithResponse(error) ||
      (isAxiosErrorWithResponse(error) && error.response.status !== 404))
  ) {
    return (
      <Card className="w-full mx-auto mt-4">
        <CardHeader>
          <CardTitle>Academic Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">
            Failed to load data:{" "}
            {error && "message" in error
              ? (error as any).message
              : "Unknown error"}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!form || student_id == null || university_id == null) {
    return (
      <Card className="w-full mx-auto mt-4">
        <CardHeader>
          <CardTitle>Academic Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">
            {student_id == null
              ? "User ID not found. Please ensure you are logged in."
              : university_id == null
                ? "University ID not found in token."
                : "Unable to initialize form due to missing data."}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (university_id === 0) {
    return (
      <Card className="w-full mx-auto mt-4">
        <CardHeader>
          <CardTitle>Academic Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">
            Your account is not associated with a valid university. Please
            contact support or select a university.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mx-auto mt-4">
      <CardHeader>
        <CardTitle>Academic Data</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">GPA</label>
            <Input
              type="number"
              step="0.01"
              min={0}
              max={4}
              value={String(form.gpa || "")}
              onChange={(e) => handleChange(e, "gpa")}
              aria-invalid={validation.gpa !== true}
              disabled={saving}
            />
            {validation.gpa !== true && (
              <div className="text-xs text-red-500">{validation.gpa}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Attendance Rate
            </label>
            <Input
              type="number"
              step="0.01"
              min={0}
              max={100}
              value={String(form.attendance_rate || "")}
              onChange={(e) => handleChange(e, "attendance_rate")}
              aria-invalid={validation.attendance_rate !== true}
              disabled={saving}
              placeholder="60"
            />
            {validation.attendance_rate !== true && (
              <div className="text-xs text-red-500">
                {validation.attendance_rate}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Core Course Average
            </label>
            <Input
              type="number"
              step="0.01"
              min={0}
              max={100}
              value={String(form.core_course_average || "")}
              onChange={(e) => handleChange(e, "core_course_average")}
              aria-invalid={validation.core_course_average !== true}
              disabled={saving}
            />
            {validation.core_course_average !== true && (
              <div className="text-xs text-red-500">
                {validation.core_course_average}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Midterm Exam Score
            </label>
            <Input
              type="number"
              step="0.01"
              min={0}
              max={100}
              value={String(form.midterm_exam_score || "")}
              onChange={(e) => handleChange(e, "midterm_exam_score")}
              aria-invalid={validation.midterm_exam_score !== true}
              disabled={saving}
            />
            {validation.midterm_exam_score !== true && (
              <div className="text-xs text-red-500">
                {validation.midterm_exam_score}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Final Exam Score
            </label>
            <Input
              type="number"
              step="0.01"
              min={0}
              max={100}
              value={String(form.final_exam_score || "")}
              onChange={(e) => handleChange(e, "final_exam_score")}
              aria-invalid={validation.final_exam_score !== true}
              disabled={saving}
            />
            {validation.final_exam_score !== true && (
              <div className="text-xs text-red-500">
                {validation.final_exam_score}
              </div>
            )}
          </div>
          {errorMessage && (
            <div className="text-xs text-red-500">{errorMessage}</div>
          )}
          {saving && <div className="text-xs text-blue-500">Saving...</div>}
          {!editMode && !saving && (
            <div className="text-xs text-gray-500">
              Data will be created automatically after you finish editing.
            </div>
          )}
          {editMode && !saving && (
            <div className="text-xs text-gray-500">
              Changes will be saved automatically after 5 seconds.
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
