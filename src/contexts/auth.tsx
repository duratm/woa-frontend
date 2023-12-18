import {createContext, PropsWithChildren, useEffect, useState} from "react";
import {hasAuthenticated} from "../services/authApi.ts";
export const AuthContext = createContext({
  user: {
    username: "",
    email: "",
    avatar_url: "",
    id: 0,
    isAuth: false,
  },
  setUser: (_user: any) => {
  },
})

export const defaultUser = {username: "", email: "", avatar_url: "", id: 0, isAuth: false}

export default function AuthProvider({children}: PropsWithChildren<{}>) {
  const [user, setUser] = useState(defaultUser)
  useEffect(() => {
    async function getUser() {
      const user = await hasAuthenticated()
      console.log(user)
      setUser(user)
      if (user.email !== "") {
        setUser({...user, isAuth: true})
      }
    }
    getUser()
  }, [])

  return <AuthContext.Provider value={{user, setUser}}>{children}</AuthContext.Provider>;
}