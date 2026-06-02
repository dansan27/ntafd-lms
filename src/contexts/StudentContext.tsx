import React, { createContext, useContext } from "react";
import { useAuth } from "@clerk/react";
import { trpc } from "@/lib/trpc";
import type { Student } from "../../server/db/schema";

type StudentContextType = {
  student: Student | null;
  token: string | null;
  loading: boolean;
  logout: () => void;
};

const StudentContext = createContext<StudentContextType>({
  student: null,
  token: null,
  loading: true,
  logout: () => {},
});

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const { userId, isLoaded, signOut } = useAuth();

  const { data: student, isLoading } = trpc.student.me.useQuery(undefined, {
    enabled: !!userId && isLoaded,
    retry: false,
  });

  const loading = !isLoaded || (!!userId && isLoading);

  return (
    <StudentContext.Provider
      value={{
        student: student ?? null,
        token: userId ?? null,
        loading,
        logout: () => signOut(),
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  return useContext(StudentContext);
}
