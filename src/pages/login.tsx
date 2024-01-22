import {useContext, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../contexts/auth.tsx";
import {SubmitHandler, useForm} from "react-hook-form";

type FormValues = {
  email: string;
  password: string;
};

const isValidEmail = (email: string) =>
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
export default function Login() {
  const [message, setMessage] = useState("");
  const {setUser} = useContext(AuthContext);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    axios.get(
      `${import.meta.env.VITE_API_ENDPOINT}/auth?email=${data.email}&password=${data.password}`,
      { withCredentials: true }
    ).then((response) => {
      setUser({
        username: response.data.username,
        avatar_url: response.data.avatar_url,
        id: response.data.id,
        email: response.data.email,
        isAuth: true
      });
      navigate("/home");
    }).catch((error) => {
      setMessage(error.response?.data?.error);
    });
  };

  const handleEmailValidation = (email: string) => {
    return isValidEmail(email);
  };

  return (
    <div className="flex h-screen flex-1 flex-col justify-center from-primary to-tertiary bg-gradient-to-bl">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md bg-primary rounded-xl p-10">
        <h2 className="mt-10 m-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Welcome to
        </h2>
        <img
          className="mx-auto h-10 w-auto"
          src="/logo.svg"
          alt="Your Company"
        />
        <h2 className="mt-10 m-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} method="post">
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email", { required: true, validate: handleEmailValidation })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.email && <span className="text-red-500">Wrong email format</span>}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password", { required: true })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.password && <span className="text-red-500">Password is required</span>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>
        <p className="text-center">{message}</p>
        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{' '}
          <Link to="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  )
}
