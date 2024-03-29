import {BrowserRouter, Route, Routes} from "react-router-dom";
import register from "./pages/register.tsx";
import home from "./pages/home.tsx";
import groupHome from "./pages/groupHome.tsx";
import NavBar from "./components/NavBar.tsx";
import login from "./pages/login.tsx";
import { useState} from "react";
import expense from "./components/expense.tsx";
import GroupUsers from "./contexts/groupUsers.ts";
import Group from "./contexts/group.tsx";
import {groupUserAPI} from "./services/groupUserAPI.ts";
import AuthProvider from "./contexts/auth.tsx";
import {groupAPI} from "./services/groupAPI.tsx";
import profile from "./pages/profile.tsx";
import index from "./pages/index.tsx";

export default function AppNav() {
  const [groupUsers, setGroupUsers] = useState(groupUserAPI);
  const [group, setGroup] = useState(groupAPI);

  return (
      <AuthProvider>
        <GroupUsers.Provider value={{groupUsers, setGroupUsers}}>
          <Group.Provider value={{group, setGroup}}>
            <BrowserRouter>
              <NavBar/>
              <Routes>
                <Route path="/home" Component={home}/>
                <Route path="/" Component={index}/>
                <Route path="/groupHome/:id" Component={groupHome}>
                  <Route path="expense/:id" Component={expense}/>
                </Route>
                <Route path="/register" Component={register}/>
                <Route path="/profile" Component={profile}/>
                <Route path="/login" Component={login}/>
              </Routes>
            </BrowserRouter>
          </Group.Provider>
        </GroupUsers.Provider>
      </AuthProvider>
  )

}




