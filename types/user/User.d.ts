export type User = {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  role_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export default User;
