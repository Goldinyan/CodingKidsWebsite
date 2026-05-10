import { useMemo } from "react";
import type { Filter, UserData } from "@/BackEnd/type";

export function useFilteredUsers(
  users: UserData[],
  searchBar: string,
  filters: Filter,
  seeAll: boolean,
) {
  return useMemo(() => {
    let filusers: Array<UserData> = [...users];

    if (searchBar !== "" && searchBar.trim() !== "") {
      const search = searchBar.toLowerCase();
      filusers = filusers.filter(
        (u) =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          u.birthdate?.toLowerCase().includes(search),
      );
    }

    if (filters.role !== "All") {
      const roleMap: Record<string, string> = {
        Admin: "admin",
        Member: "member",
        User: "notmember",
        Mentor: "mentor",
      };
      const role = roleMap[filters.role];
      if (role) {
        filusers = filusers.filter((u) => u.role === role);
      }
    }

    if (filters.birthYear !== "false") {
      filusers = [...filusers].sort((a, b) =>
        filters.birthYear === "ascending"
          ? new Date(a.birthdate).getTime() - new Date(b.birthdate).getTime()
          : new Date(b.birthdate).getTime() - new Date(a.birthdate).getTime(),
      );
    }

    if (filters.name !== "false") {
      filusers = [...filusers].sort((a, b) =>
        filters.name === "ascending"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name),
      );
    }

    if (!seeAll) {
      filusers = filusers.slice(0, 10);
    }

    return filusers;
  }, [users, searchBar, filters, seeAll]);
}

