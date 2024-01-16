import {ChangeEvent, SetStateAction, useContext, useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../contexts/auth.tsx";
import {SubmitHandler, useForm} from "react-hook-form";
import zxcvbn from 'zxcvbn'
import {ArrowLeftCircleIcon} from "@heroicons/react/24/outline";

type FormValues = {
  email: string;
  username: string;
  password: string;
  avatarUrl: FileList;
};
const isValidEmail = (email: string) =>
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );

function Register() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [avatarURL, setAvatarURL] = useState("")
  const {user, setUser} = useContext(AuthContext);
  const formvalues = {
    email: user.email,
    username: user.username,
    password: "",
    avatarUrl: undefined
  }
  const {register, handleSubmit, formState: {errors}} = useForm<FormValues>({defaultValues: formvalues});
  const [password, setPassword] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setAvatarURL(user.avatar_url)
  }, [""]);
  // Fonction pour mettre à jour les critères de force du mot de passe
  const checkPasswordStrength = (password: string) => {
    const result = zxcvbn(password);
    setScore(result.score);
    setFeedback(result.feedback.suggestions.join(" "));
  };

  // À chaque changement de mot de passe, mettez à jour les critères
  useEffect(() => {
    checkPasswordStrength(password);
  }, [password]);

  const handlePasswordChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setPassword(e.target.value);
  };

  const onAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    if ( event.target.files && validateImageFile(event.target.files)) {
      setAvatarURL(URL.createObjectURL(event.target.files[0]))
    }
  };
  const handleEmailValidation = (email: string) => {
    return isValidEmail(email) && !errors.email;
  };

  const isStrongEnoughOrUnchanged = () => {
    return score >= 3 || password === "";
  };


  const onSubmit :SubmitHandler<FormValues> = async (data) => {
    try {
      const formData = {username: data.username, password: data.password, email: data.email, avatarUrl: data.avatarUrl[0]}
      const response = await axios.patch(
        `${import.meta.env.VITE_API_ENDPOINT}/auth/me`,
        formData,
        { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setUser({
        username: response.data.username,
        avatarUrl: response.data.avatarUrl,
        email: response.data.email,
        isAuth: true
      });
      navigate(-1);
    } catch (error :any) {
      setMessage(error.response?.data?.error === "email" ? "Email already used" : "Username already used") ;
    }
  };
  const validateImageFile = (file: FileList) => {
    if (file === undefined) return true;
    if (!file[0]) return true;
    if (file.length > 1) return false;
    const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return acceptedImageTypes.includes(file[0].type); // Vérifie si le type du fichier est une image acceptée
  };

  return (
    <div className="flex h-screen flex-1 flex-col justify-center from-primary to-tertiary bg-gradient-to-bl">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md bg-primary rounded-xl p-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h1 className="sm:text-5xl text-2xl font-semibold w-fit mb-4 flex flex-row items-center"><Link
            to="/"><ArrowLeftCircleIcon className="h-20"/></Link>Profile</h1>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
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
                  {...register("email", {required: true, validate: handleEmailValidation})}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.email && <span
                  className="text-red-500">{errors.email.message ? errors.email.message : "Email on a good format is mandatory"}</span>}
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  type="username"
                  autoComplete="username"
                  {...register("username", {required: true})}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.username && <span
                  className="text-red-500">{errors.username.message ? errors.username.message : "Email is mandatory"}</span>}
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
                  {...register("password", {validate: isStrongEnoughOrUnchanged})}
                  onChange={handlePasswordChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.password && <span className="text-red-500">{"Password is not safe enough"}</span>}
                <div className="mt-2 text-sm text-gray-600">
                  <div className={`strength-indicator bg-gray-200 rounded-sm h-2 mb-1`}>
                    <div
                      className={score < 3 ? `strength-level bg-red-600 h-2 rounded-sm` : `strength-level bg-green-600 h-2 rounded-sm`}
                      style={{width: `${(score + 1) * 20}%`}}
                    ></div>
                  </div>
                  <div className="strength-feedback">
                    <p>{feedback}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                Avatar photo
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <img
                    className="inline-block h-16 w-16 rounded-full ring-2 ring-white"
                    src={avatarURL}
                    alt=""
                  />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="avatarUrl"
                      className="relative cursor-pointer rounded-md font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input id="avatarUrl" type="file" className="sr-only"
                             {...register("avatarUrl", {onChange: onAvatarChange, validate: validateImageFile})}/>
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              {errors.avatarUrl &&
                <span className="text-red-500">Le fichier doit être une image (jpeg, png, gif).</span>}
              {message !== "" && <span className="text-red-500">{message}</span>}
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register;