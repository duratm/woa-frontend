import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../contexts/auth.tsx";

export default function Login() {
  const [message, setMessage] = useState("");
  const {setUser, user} = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isAuth) {
      navigate("/home");
    }
  }, [])
  const handleLogin = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    axios.post(
      import.meta.env.VITE_API_ENDPOINT + '/login',
      target,
      {withCredentials: true}
    ).then((response) => {
      console.log(response)
      setUser({
        username: response.data.username,
        avatarUrl: response.data.avatar_url,
        id: response.data.id,
        email: response.data.email,
        isAuth: true
      });
      navigate("/home");
    }).catch((error) => {
      setMessage(error.response?.data?.error);
    });
  };

  return (
    <>
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
          <form className="space-y-6" onSubmit={handleLogin} method="post">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
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

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link to="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
      <p>{message}</p>
    </>
  )
}
