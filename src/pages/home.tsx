import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import GroupUsers from "../contexts/groupUsers.ts";
import {AuthContext} from "../contexts/auth.tsx";

function Home() {
  const [errors, setErrors] = useState("");
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
      console.log(data);
      setGroups(data);
    }).catch((error) => {
      console.log(error);
      setErrors(error.response?.data?.error);
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
        <div className="flex flex-col items-center h-full mt-20 overflow-y-scroll pb-20">
          {groups.map(group =>
            <button key={group.id} onClick={display(group.id)}
                    className="flex p-6 justify-between sm:rounded-3xl w-full bg-primary hover:bg-secondary sm:w-3/4 mb-2 sm:py-5 sm:mt-5 sm:mb-5 h-min shadow-xl">
              <div className="flex flex-col min-w-0">
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
            </button>)}
        </div>
      </div>
      <p>{errors}</p>
    </>
  )
}

export default Home;

