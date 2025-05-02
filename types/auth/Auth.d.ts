export type SignIn = {
  [key: string]: string;
  email: string;
  password: string;
};

export type SignUp = {
  [key: string]: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default SignIn;
export default SignUp;
