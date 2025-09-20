import type { LeaderboardPagination } from "./LeaderboardPagination";

export interface LeaderboardResponse {
  status: string;
  message: string;
  data: LeaderboardPagination;
}