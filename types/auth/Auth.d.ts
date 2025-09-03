export type SignIn = {
  [key: string]: string;
  email: string;
  password: string;
};

export type SignUp = {
  [key: string]: string | File | null;
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  photo: File | null;
  avatar: string;
};

export default SignIn;
