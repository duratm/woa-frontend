import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import GroupUsers from "../contexts/groupUsers.ts";
import {AuthContext} from "../contexts/auth.tsx";
import RegisterGroup from "../components/registerGroup.tsx";
import * as sweetalert2 from "sweetalert2";
import {Cog6ToothIcon} from "@heroicons/react/24/outline";
import GroupSettings from "../components/groupSettings.tsx";

function Home() {
  const [openCreateGroup, setOpenCreateGroup] = useState(false);
  const [openGroupSettings, setOpenGroupSettings] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(-1);
  const [groups, setGroups] = useState([{id: 0, name: "", users: [{id: 0, username: "", avatar_url: ""}]}]);
  const {setGroupUsers} = useContext(GroupUsers)
  useEffect(() => {
    init()
  }, []);
  const navigate = useNavigate();
  const {user} = useContext(AuthContext);

  let init = () => {
    fetch(import.meta.env.VITE_API_ENDPOINT+'/api/groups', {method: 'GET', credentials: 'include'}
    ).then(res => res.json()
    ).then(data => {
      data.sort((a: { id: number; }, b: { id: number; }) => (a.id < b.id) ? 1 : -1);
      setGroups(data);
    }).catch((error) => {
      sweetalert2.default.fire({
        icon: 'error',
        title: 'Oops...',
        text: error,
      })
    });
  }

  let display = (id: number) => (e: React.SyntheticEvent) => {
    e.preventDefault();
    setGroupUsers(groups.find(group => group.id === id)?.users ?? []);
    navigate("/groupHome/" + id);
  }


  return (
    <>
      <div className="from-primary to-tertiary bg-gradient-to-bl h-screen overflow-hidden">
        <div className="flex flex-col items-center h-full mt-20 overflow-x-scroll pb-40">
          {groups.length > 0 ? groups.map(group =>
            <div key={group.id}
                 className="flex justify-between sm:rounded-3xl w-full flex-row bg-primary sm:w-3/4 mb-2 sm:mt-5 sm:mb-5 h-min shadow-xl">
              <div className="flex sm:py-5 p-6 flex-col hover:bg-secondary sm:rounded-3xl h-full w-full min-w-0" onClick={display(group.id)}>
                <div className="min-w-0">
                  <p
                    className="text-sm font-semibold leading-6 text-gray-900 first-letter:uppercase">{group.name}</p>
                </div>
                <div className="-space-x-2 overflow-hidden w-fit">
                  {group.users.map(groupUser => {
                    if (groupUser.id !== user.id) {
                      return <img key={groupUser.id}
                                  className="inline-block h-10 w-10 rounded-full "
                                  src={groupUser.avatar_url}
                                  alt=""/>
                    }
                  })}
                </div>
              </div>
              <div className="flex sm:py-5 p-6 flex-row items-center">
                <button onClick={() => {setCurrentGroup(group.id)
                  setOpenGroupSettings(true)}}><Cog6ToothIcon className="h-10 w-10 text-white"/></button>
              </div>
            </div>) : <p className="text-2xl text-center">You don't have any group yet</p>}
        </div>
        <div className="absolute inset-x-0 bottom-0">
          <button className="h-20 w-full text-center items-center bg-secondary" onClick={() => {
            setOpenCreateGroup(true)
          }}>New Group
          </button>
        </div>
      </div>
      <RegisterGroup open={openCreateGroup} setOpen={setOpenCreateGroup} setGroups={setGroups} groups={groups}/>
      <GroupSettings open={openGroupSettings} setOpen={setOpenGroupSettings} id={currentGroup} setGroups={setGroups} groups={groups}/>
    </>
  )
}

export default Home;

