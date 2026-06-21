import { useMemo } from "react";
import type { Filter, UserData, UserRole } from "@/BackEnd/type";
import { toJsDate } from "@/BackEnd/utils";

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
      const roleMap: Record<string, UserRole> = {
        Admin: "admin",
        Member: "member",
        User: "user",
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
          ? toJsDate(a.birthdate).getTime() - toJsDate(b.birthdate).getTime()
          : toJsDate(b.birthdate).getTime() - toJsDate(a.birthdate).getTime(),
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
