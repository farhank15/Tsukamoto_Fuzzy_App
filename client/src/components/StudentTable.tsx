import React, { useRef } from "react";
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
const BASE_URL = import.meta.env.VITE_BASE_URL_API;

type Student = {
  id: number;
  university?: { name: string };
  user?: { id: number; name: string; role: string }; // tambahkan id di sini
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

export function StudentTable() {
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

  // Infinite scroll observer
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Log data to debug
  React.useEffect(() => {
    if (data) {
      console.log("Fetched Data:", data.pages.flat());
    }
  }, [data]);

  return (
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
              <TableCell colSpan={5} className="text-center py-4 text-red-500">
                {(error as Error).message}
              </TableCell>
            </TableRow>
          )}
          {status === "success" &&
            data?.pages.flat().map((student, idx) =>
              student ? (
                <TableRow key={student.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>
                    <button
                      type="button"
                      className="text-blue-600 hover:underline cursor-pointer bg-transparent border-none p-0"
                      title="Lihat Detail"
                      onClick={() =>
                        navigate({
                          to: "/admin/student/$studentId",
                          params: { studentId: String(student.user?.id) }, // GUNAKAN user.id
                        })
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
                        navigate({
                          to: "/admin/student/$studentId",
                          params: { studentId: String(student.user?.id) }, // GUNAKAN user.id
                        })
                      }
                    >
                      <Eye className="w-5 h-5 text-slate-500" />
                    </button>
                  </TableCell>
                </TableRow>
              ) : null
            )}
          {status === "success" && data?.pages.flat().length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No students found
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
  );
}
