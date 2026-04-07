import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import type { Student } from "../../server/db/schema";

type StudentContextType = {
  student: Student | null;
  token: string | null;
  loading: boolean;
  login: (fullName: string, studentCode: string) => Promise<void>;
  logout: () => void;
};

const StudentContext = createContext<StudentContextType>({
  student: null,
  token: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("ntafd_student_token")
  );
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  const loginMutation = trpc.student.login.useMutation();

  const { data: meData, isLoading: meLoading } = trpc.student.me.useQuery(
    { token: token ?? "" },
    { enabled: !!token, retry: false }
  );

  useEffect(() => {
    if (!token) {
      setStudent(null);
      setLoading(false);
      return;
    }
    if (!meLoading) {
      if (meData) {
        setStudent(meData as Student);
      } else {
        localStorage.removeItem("ntafd_student_token");
        setToken(null);
        setStudent(null);
      }
      setLoading(false);
    }
  }, [meData, meLoading, token]);

  const login = useCallback(async (fullName: string, studentCode: string) => {
    const result = await loginMutation.mutateAsync({ fullName, studentCode });
    if (result?.sessionToken) {
      localStorage.setItem("ntafd_student_token", result.sessionToken);
      setToken(result.sessionToken);
      setStudent(result as Student);
    }
  }, [loginMutation]);

  const logout = useCallback(() => {
    localStorage.removeItem("ntafd_student_token");
    setToken(null);
    setStudent(null);
  }, []);

  return (
    <StudentContext.Provider value={{ student, token, loading, login, logout }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  return useContext(StudentContext);
}
