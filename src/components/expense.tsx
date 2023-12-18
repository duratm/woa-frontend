import {useParams} from "react-router-dom";
import {useContext} from "react";
import GroupUsers from "../contexts/groupUsers.ts";

function Expense() {
  const {groupUsers} = useContext(GroupUsers)
  const params = useParams();
  const expense: {name: string; lender_id: number; borrowers: [{amount:number; id:number; is_paid:boolean}]} = JSON.parse(params.expense as string)

    return (
      <div className="w-full">
        <h1 className="first-letter:uppercase">{expense.name}</h1>
        <hr className="mb-2"/>
        <p>Lender</p>
        <div className="flex flex-row items-center justify-between mb-2">
          <div className="flex flex-row items-center">
            <img src={groupUsers.find(groupUser => groupUser.id === expense.lender_id)?.avatar_url}
                 alt="user_avatar" className="w-10 h-10 rounded-full mr-3"/>
            <p>{groupUsers.find(groupUser => groupUser.id === expense.lender_id)?.username}</p>
          </div>
          <p>{expense.borrowers.map((a: { amount: any; }) => a.amount).reduce((accumulator: any, object: any) => {
            return accumulator + object
          })}</p>
        </div>
        <hr className="mb-2"/>
        <div className="flex flex-col">
          <p>Borrowers</p>
          {expense.borrowers.map((borrower: { id: number; amount: number; is_paid: boolean }) =>
            <div key={borrower.id} className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center">
                <img src={groupUsers.find(groupUser => groupUser.id === borrower.id)?.avatar_url}
                     alt="user_avatar" className="w-10 h-10 rounded-full mr-3"/>
                <p>{groupUsers.find(groupUser => groupUser.id === borrower.id)?.username}</p>
              </div>
              <button>{borrower.is_paid ? "paid" : "not paid"}</button>
              <p>{borrower.amount}</p>
            </div>
          )}
        </div>
      </div>
    )
}

export default Expense
