import React, { useRef, useState, useMemo, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "./ui/table";
import { Eye } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Input } from "./ui/input";
const BASE_URL = import.meta.env.VITE_BASE_URL_API;

type Student = {
  id: number;
  university?: { name: string };
  user?: { id: number; name: string; role: string };
};

type AcademicResponse = Student[];

async function fetchStudents({ pageParam = 1 }): Promise<AcademicResponse> {
  const res = await axios.get(`${BASE_URL}/academic`, {
    params: { page: pageParam, limit: 20 },
  });
  if (Array.isArray(res.data)) {
    return res.data;
  }
  if (Array.isArray(res.data?.data)) {
    return res.data.data;
  }
  throw new Error("Unexpected API response");
}

// Optimized debounce hook with immediate update for empty string
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  React.useEffect(() => {
    // If value is empty, update immediately for instant clear
    if (!value.trim()) {
      setDebouncedValue(value);
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function StudentTable() {
  const [inputValue, setInputValue] = useState("");

  // Debounce search with shorter delay (150ms instead of 300ms)
  const debouncedSearchTerm = useDebounce(inputValue, 150);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["students"],
    queryFn: ({ pageParam }) => fetchStudents({ pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const loader = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // Memoize all students data to prevent re-flattening
  const allStudents = useMemo(() => {
    return data?.pages?.flat() ?? [];
  }, [data]);

  // Optimized filter with early returns and better performance
  const filteredStudents = useMemo(() => {
    // Early return for empty search - no filtering needed
    if (!debouncedSearchTerm.trim()) {
      return allStudents;
    }

    const searchLower = debouncedSearchTerm.toLowerCase();

    // Use filter with optimized string matching
    return allStudents.filter((student) => {
      if (!student) return false;

      // Get values once and reuse
      const name = student.user?.name?.toLowerCase();
      const university = student.university?.name?.toLowerCase();
      const role = student.user?.role?.toLowerCase();

      // Use includes which is optimized in modern browsers
      return (
        (name && name.includes(searchLower)) ||
        (university && university.includes(searchLower)) ||
        (role && role.includes(searchLower))
      );
    });
  }, [allStudents, debouncedSearchTerm]);

  // Infinite scroll observer - memoized to prevent recreating
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    const currentLoader = loader.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Optimized input handler - no extra operations
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    []
  );

  // Memoize navigation handler to prevent recreation
  const handleStudentClick = useCallback(
    (studentUserId: number) => {
      navigate({
        to: "/admin/student/$studentId",
        params: { studentId: String(studentUserId) },
      });
    },
    [navigate]
  );

  return (
    <div className="my-10 px-2">
      <Input
        className="p-2 border border-slate-600 rounded-lg mb-6"
        placeholder="search by name, university, or role..."
        value={inputValue}
        onChange={handleInputChange}
      />
      <div className="overflow-x-auto w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">No</TableHead>
              <TableHead className="w-48">Name</TableHead>
              <TableHead className="w-48">University</TableHead>
              <TableHead className="w-32">Role</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {status === "pending" && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {status === "error" && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-4 text-red-500"
                >
                  {(error as Error).message}
                </TableCell>
              </TableRow>
            )}
            {status === "success" &&
              filteredStudents.map((student, idx) => {
                if (!student?.user?.id) return null;

                return (
                  <TableRow key={student.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      <button
                        type="button"
                        className="text-blue-600 hover:underline cursor-pointer bg-transparent border-none p-0"
                        title="Lihat Detail"
                        onClick={() =>
                          student.user?.id &&
                          handleStudentClick(student.user.id)
                        }
                      >
                        {student.user?.name ?? "-"}
                      </button>
                    </TableCell>
                    <TableCell>{student.university?.name ?? "-"}</TableCell>
                    <TableCell>{student.user?.role ?? "-"}</TableCell>
                    <TableCell>
                      <button
                        type="button"
                        className="p-2 rounded cursor-pointer"
                        title="Lihat Detail"
                        onClick={() =>
                          student.user?.id &&
                          handleStudentClick(student.user.id)
                        }
                      >
                        <Eye className="w-5 h-5 text-slate-500" />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            {status === "success" &&
              filteredStudents.length === 0 &&
              !debouncedSearchTerm && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No students found
                  </TableCell>
                </TableRow>
              )}
            {status === "success" &&
              filteredStudents.length === 0 &&
              debouncedSearchTerm && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No students match your search "{debouncedSearchTerm}"
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
        <div ref={loader} className="h-8 flex items-center justify-center">
          {isFetchingNextPage && (
            <span className="text-gray-400">Loading more...</span>
          )}
          {!hasNextPage && status === "success" && (
            <span className="text-gray-400">No more data</span>
          )}
        </div>
      </div>
    </div>
  );
}
