import { useContext, useEffect, useState} from "react";
import {Link, Outlet, useParams} from "react-router-dom";
import GroupUsers from "../contexts/groupUsers.ts";
import {useNavigate} from "react-router-dom";
import {ArrowLeftCircleIcon} from "@heroicons/react/24/outline";
import BorrowedList from "../components/borrowedList.tsx";
import LentList from "../components/lentList.tsx";
import RegisterExpense from "../components/registerExpense.tsx";
import Group from "../contexts/group.tsx";
import * as sweetalert2 from "sweetalert2";


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function GroupHome() {
  const [openBorrowed, setOpenBorrowed] = useState(false);
  const [openLent, setOpenLent] = useState(false);
  const {groupUsers, setGroupUsers} = useContext(GroupUsers)
  const [openCreateExpense, setOpenCreateExpense] = useState(false);
  const [selected, setSelected] = useState(0);
  const {group, setGroup} = useContext(Group);
  const navigate = useNavigate();
  function clickExpense(expense: { id: number; name?: string; lender_id?: number; is_paid?: boolean; borrowers?: { id: number; amount: number; is_paid: boolean; }[]; }) {
    setSelected(expense.id);
    navigate("expense/"+expense.id)
  }
  const params = useParams();
  useEffect(() => {
    init()
  }, [""]);
  const init = () => {
    if (groupUsers[0].username === "") {
      fetch(import.meta.env.VITE_API_ENDPOINT + '/api/groups/show/users/' + params.id, {
          credentials: "include",
          method: "GET",
        }
      ).then(res => res.json()
      ).then(data => {
        data.groups.expenses.sort((a: { id: number; }, b: { id: number; }) => (a.id < b.id) ? 1 : -1);
        setGroup(data.groups);
        setGroupUsers(data.users);
      }).catch((error) => {
        sweetalert2.default.fire({
          icon: 'error',
          title: 'Oops...',
          text: error,
        })
      });
    }else{
      fetch(import.meta.env.VITE_API_ENDPOINT + '/api/groups/show/' + params.id, {
          credentials: "include",
          method: "GET",
        }
      ).then(res => res.json()
      ).then(data => {
        data.expenses.sort((a: { id: number; }, b: { id: number; }) => (a.id < b.id) ? 1 : -1);
        setGroup(data);
      }).catch((error) => {
        sweetalert2.default.fire({
          icon: 'error',
          title: 'Oops...',
          text: error,
        })
      });
    }
  }

  function displayTotal(id: number) {
    const borrowed = group.expenses.map((a) => {
      if (id !== a.lender_id) {
        return a.borrowers.map((a) => {
          if (a.id == id && a.is_paid === false) {
            return a.amount
          }
        }).reduce((acum,obj)=> {return (acum ?? 0) + (obj ?? 0)})
      }}).reduce((acum,obj)=> {return (acum ?? 0) + (obj ?? 0)})
    const lent = group.expenses.map((a) => {
      if (id == a.lender_id && a.borrowers.length > 0) {
        return a.borrowers.map(exp => exp.is_paid ? 0 : exp.amount).reduce((acum,obj)=> {return (acum ?? 0) + (obj ?? 0)})
      }
    }).reduce((acum,obj)=> {return (acum ?? 0) + (obj ?? 0)})
    const total = (lent ?? 0 ) - (borrowed ?? 0)
    return <p className={total <0 ? "text-red-500" : "text-green-500"}>{total} $</p>
  }

  function displayButtons() {
    return (
      <div className="flex flex-row w-min-[170px] w-1/2 h-1/2">
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
      <div className="flex sm:flex-auto flex-col sm:flex-row h-full pt-20 pb-10 overflow-x-scroll">
        <div className="flex flex-col mb-14 w-full">
          <div className="flex flex-row justify-between items-center">
          <h1 className="sm:text-5xl text-2xl font-semibold truncate w-fit mb-4 flex flex-row items-center"><Link
            to="/"><ArrowLeftCircleIcon className="h-20"/></Link>Group {group.name}
          </h1>
          {displayButtons()}
          </div>
          {groupUsers.map((currentUser) => <article
            key={currentUser.id}>
            <div className="flex flex-row items-center justify-between">
              <img src={currentUser.avatar_url} alt={currentUser.username} className="w-20 h-20 rounded-full"/>
              <p>{currentUser.username}</p>
              {group.expenses.length > 0 ? displayTotal(currentUser.id) : <>0 $</>}
            </div>
          </article>)}
          <div className="flex flex-row items-center overflow-hidden truncate">
            <p className="pr-3 font-semibold first-letter:uppercase min-w-fit w-1/6 border-r-2 border-black pl-2">Expense name</p>
            <p className="pl-3 font-semibold w-[150px] mr-3 border-r-2 border-black">Lender</p>
            <p className="pl-3 font-semibold w-3/4">Borrowers</p>
          </div>
          {group.expenses.length > 0 ? group.expenses.map((expense) =>
            <button onClickCapture={() => {
              clickExpense(expense)
            }} key={expense.id}>
              <div
                className="flex flex-row rounded-xl border-2 border-secondary bg-primary items-center overflow-hidden truncate">
                <p className="pr-3 first-letter:uppercase min-w-fit w-1/6 pl-2">{expense.name}</p>
                <div className="flex flex-row w-[150px] items-center">
                    <img src={groupUsers.find(groupUser => groupUser.id === expense.lender_id)?.avatar_url}
                         alt="user_avatar" className="w-10 h-10 rounded-full"/>

                    <p
                      className="pl-3 text-green-500 font-semibold mr-3">{expense.borrowers.map(a => a.amount).reduce((accumulator, object) => {
                      return accumulator + object
                    })} $</p>

                </div>
                <div className="flex flex-row sm:w-3/4 truncate">
                  {expense.borrowers.map((borrower) =>
                    <div key={borrower.id} className="flex flex-row w-3/4 items-center">
                      <img src={groupUsers.find(groupUser => groupUser.id === borrower.id)?.avatar_url}
                           alt="user_avatar"
                           className="w-10 h-10 rounded-full"/>
                      <p
                        className={classNames(borrower.is_paid ? "text-green-500" : "text-red-500", "font-semibold pl-3")}>
                        {borrower.amount + " $"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {displayOrNotLittle(expense.id)}
            </button>
          ) : <p className="text-2xl text-center">You don't have any expense yet</p>}
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
      <BorrowedList open={openBorrowed} setOpen={setOpenBorrowed}/>
      <LentList open={openLent} setOpen={setOpenLent}/>
      <RegisterExpense open={openCreateExpense} setOpen={setOpenCreateExpense} group={group} setGroup={setGroup}/>

    </div>
  )
}

export default GroupHome;