import { useContext, useEffect, useState} from "react";
import {Link, Outlet, useParams} from "react-router-dom";
import GroupUsers from "../contexts/groupUsers.ts";
import {useNavigate} from "react-router-dom";
import {ArrowLeftCircleIcon} from "@heroicons/react/24/outline";
import BorrowedList from "../components/borrowedList.tsx";
import LentList from "../components/lentList.tsx";
import {AuthContext} from "../contexts/auth.tsx";
import RegisterExpense from "../components/registerExpense.tsx";


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function GroupHome() {
  const [errors, setErrors] = useState("");
  const [openBorrowed, setOpenBorrowed] = useState(false);
  const [openLent, setOpenLent] = useState(false);
  const {groupUsers, setGroupUsers} = useContext(GroupUsers)
  const [openCreateExpense, setOpenCreateExpense] = useState(false);
  const [selected, setSelected] = useState(0);
  const {user} = useContext(AuthContext);
  const [group, setGroup] = useState({
    id: 0,
    name: "",
    expenses: [{id: 0, name: "", lender_id: 0, borrowers: [{id: 0, amount: 0, is_paid: 0}]}],
  });
  const navigate = useNavigate();
  function clickExpense(expense: { id: any; name?: string; lender_id?: number; is_paid?: boolean; borrowers?: { id: number; amount: number; is_paid: number; }[]; }) {
    setSelected(expense.id);
    navigate("expense/"+JSON.stringify(expense))
  }
  const params = useParams();
  useEffect(() => {
    init()
  }, []);
  const init = () => {
    if (groupUsers[0].username === "") {
      fetch(import.meta.env.VITE_API_ENDPOINT + '/groups/show/users/' + params.id, {
          credentials: "include",
          method: "GET",
        }
      ).then(res => res.json()
      ).then(data => {
        console.log(data);
        setGroup(data.groups);
        setGroupUsers(data.users);
      }).catch((error) => {
        console.log(errors);
        setErrors(error.response?.data?.error);
      });
    }else{
      fetch(import.meta.env.VITE_API_ENDPOINT + '/groups/show/' + params.id, {
          credentials: "include",
          method: "GET",
        }
      ).then(res => res.json()
      ).then(data => {
        console.log(data);
        setGroup(data);
      }).catch((error) => {
        console.log(errors);
        setErrors(error.response?.data?.error);
      });
    }
  }

  function displayTotal(id: number) {
    const borrowed = group.expenses.map((a) => {
      if (id !== a.lender_id) {
        return a.borrowers.map((a) => {
          if (a.id == id) {
            return a.amount
          }
        }).reduce((acum,obj)=> {return (acum ?? 0) + (obj ?? 0)})
      }}).reduce((acum,obj)=> {return (acum ?? 0) + (obj ?? 0)})
    const lent = group.expenses.map((a) => {
      if (id == a.lender_id && a.borrowers.length > 0) {
        return a.borrowers.map(exp => exp.amount).reduce((acum,obj)=> {return (acum ?? 0) + (obj ?? 0)})
      }
    }).reduce((acum,obj)=> {return (acum ?? 0) + (obj ?? 0)})
    const total = (lent ?? 0 ) - (borrowed ?? 0)
    return <p className={total <0 ? "text-red-500" : "text-green-500"}>{total}</p>
  }

  function displayButtons() {
    return (
      <div className="flex flex-row w-1/4">
        <button className="border-tertiary border rounded-md w-1/2" onClick={() => setOpenBorrowed(true)}>Borrowed</button>
        <button className="border-tertiary border rounded-md w-1/2" onClick={() => setOpenLent(true)}>Lent</button>
      </div>
    )
  }

  function displayOrNotLittle(id: number) {
    if (id === selected) {
      return (
      <div className="md:hidden">
        <Outlet/>
      </div>
      )
    }
  }

  return (
    <div className="from-primary to-tertiary bg-gradient-to-bl h-screen overflow-y-scroll">
      <div className="flex sm:flex-auto flex-col sm:flex-row h-full pt-20 pb-15 overflow-x-scroll">
        <div className="flex flex-col m-2 w-full overflow-x-scroll pr-2">
          <h1 className="sm:text-5xl text-2xl font-semibold w-fit mb-4 flex flex-row items-center"><Link
            to="/"><ArrowLeftCircleIcon className="h-20"/></Link>Group {group.name}</h1>
          {groupUsers.map((currentUser) => <article
            key={currentUser.id}>
            <div className="flex flex-row items-center justify-between">
              <img src={currentUser.avatar_url} alt={currentUser.username} className="w-20 h-20 rounded-full"/>
              <p>{currentUser.username}</p>
              {user.id === currentUser.id ? displayButtons() : <></>}
              {displayTotal(currentUser.id)}
            </div>
          </article>)}

          {group.expenses.map((expense) =>
            <button onClickCapture={() => {
              clickExpense(expense)
            }} key={expense.id}>
              <div
                className="flex flex-row rounded-xl border-2 border-secondary bg-primary items-center overflow-hidden">
                <p className="pr-3 first-letter:uppercase min-w-fit w-1/4 pl-2">{expense.name}</p>
                <div className="flex flex-row w-fit items-center">
                  <div className="sm:w-1/2 flex flex-row items-center">
                    <img src={groupUsers.find(groupUser => groupUser.id === expense.lender_id)?.avatar_url}
                         alt="user_avatar" className="w-10 h-10 rounded-full"/>

                    <p
                      className="pl-3 text-green-500 font-semibold mr-3">{expense.borrowers.map(a => a.amount).reduce((accumulator, object) => {
                      return accumulator + object
                    })}</p>

                  </div>
                  <hr className="mb-2 bg-darkMode-primary"/>
                </div>
                <div className="flex flex-row sm:w-3/4">
                  {expense.borrowers.map((borrower) =>
                    <div key={borrower.id} className="flex flex-row w-3/4 items-center">
                      <img src={groupUsers.find(groupUser => groupUser.id === borrower.id)?.avatar_url}
                           alt="user_avatar"
                           className="w-10 h-10 rounded-full"/>
                      <p
                        className={classNames(borrower.is_paid ? "text-green-500" : "text-red-500", "font-semibold pl-3")}>
                        {borrower.amount}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {displayOrNotLittle(expense.id)}
            </button>
          )}

        </div>
        <div className={classNames(selected ? "hidden md:flex md:w-1/3" : "")}>
          <Outlet/>
        </div>
        <div className="absolute inset-x-0 bottom-0">
          <button className="h-20 w-full text-center items-center bg-secondary" onClick={() => {
            setOpenCreateExpense(true)
          }}>New expense
          </button>
        </div>
      </div>
      <BorrowedList open={openBorrowed} setOpen={setOpenBorrowed} expenses={group.expenses}/>
      <LentList open={openLent} setOpen={setOpenLent} expenses={group.expenses}/>
      <RegisterExpense open={openCreateExpense} setOpen={setOpenCreateExpense} group={group} setGroup={setGroup} />

    </div>
  )
}

export default GroupHome;