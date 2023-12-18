import {BrowserRouter, Route, Routes} from "react-router-dom";
import register from "./pages/register.tsx";
import home from "./pages/home.tsx";
import groupHome from "./pages/groupHome.tsx";
import NavBar from "./components/NavBar.tsx";
import login from "./pages/login.tsx";
import { useState} from "react";
import expense from "./components/expense.tsx";
import GroupUsers from "./contexts/groupUsers.ts";
import {groupAPI} from "./services/groupAPI.ts";
import AuthProvider from "./contexts/auth.tsx";

export default function AppNav() {
  const [groupUsers, setGroupUsers] = useState(groupAPI);
  return (
    <AuthProvider>
      <GroupUsers.Provider value={{groupUsers,setGroupUsers}}>
        <BrowserRouter>
          <NavBar/>
          <Routes>
            <Route path="/" Component={home}/>
            <Route path="/groupHome/:id" Component={groupHome}>
              <Route path="expense/:expense" Component={expense}/>
            </Route>
            <Route path="/register" Component={register}/>
            <Route path="/login" Component={login}/>
          </Routes>
        </BrowserRouter>
      </GroupUsers.Provider>
    </AuthProvider>
  )

}




