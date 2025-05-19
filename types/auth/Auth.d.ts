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
  photo: glocalThis.File | null;
};

export default SignIn;
export default SignUp;
