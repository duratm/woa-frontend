import React, {Fragment, useContext, useEffect, useState} from "react";
import {Dialog, Transition} from '@headlessui/react'
import GroupUsers from "../contexts/groupUsers.ts";
import {AuthContext} from "../contexts/auth.tsx";
import {useFieldArray, useForm} from "react-hook-form";
import Group from "../contexts/group.tsx";

type FormValues = {
  expenses: {
    id: any;
    name: string;
    lender_id: number;
    borrowers: { id: number; amount: number; is_paid: boolean; }[];
  }[]
}

function LentList({open, setOpen}: Readonly<{
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}>) {
  const {user} = useContext(AuthContext);
  const [paid, setPaid] = useState(false);
  const {groupUsers} = useContext(GroupUsers)
  const {group} = useContext(Group);
  const { control, register, reset, handleSubmit } = useForm<FormValues>({defaultValues: {expenses: group.expenses}});
  const { fields } = useFieldArray({
    control,
    name: "expenses",
  });

  useEffect(() => {
    reset({expenses: group.expenses})
  }, [group.expenses]);

  const onSubmit = (data: FormValues) => {
    const formValues = {groupId: group.id, expenses: data.expenses}
    fetch(import.meta.env.VITE_API_ENDPOINT + '/api/expenses', {
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify(formValues),
    })
  }
  function paidList() {
    return (
      <>
        <div className="flex flex-row justify-between">
          <p className="w-5/12 trucate">why</p>
          <p className="w-4/12 trucate">who</p>
          <p className="w-2/12 trucate">amount</p>
          <p className="w-1/12 trucate">paid</p>
        </div>
        {fields.map((expense, indexe) => {
          if (user.id === expense.lender_id) {
            return <>
              {expense.borrowers.map((borrower, indexb) => {
                if (borrower.is_paid) {
                  return (
                    <div key={expense.id + borrower.id} className="flex flex-row justify-between">
                      <p className="w-5/12 trucate">{expense.name}</p>
                      <p
                        className="w-4/12 trucate">{groupUsers.find(groupUser => groupUser.id === borrower.id)?.username}</p>
                      <p className="w-2/12 trucate">{borrower.amount}</p>
                      <input type="checkbox" className="w-1/12 trucate"
                             {...register(`expenses.${indexe}.borrowers.${indexb}.is_paid`)}
                      ></input>
                    </div>
                  )
                }
              })}
            </>
          }
        })}
      </>
    )
  }

  function notPaidList() {
    return (
      <>
        <div className="flex flex-row justify-between">
          <p className="w-5/12 trucate">why</p>
          <p className="w-4/12 trucate">who</p>
          <p className="w-2/12 trucate">amount</p>
          <p className="w-1/12 trucate">paid</p>
        </div>
        {fields.map((expense, indexb) => {
          if (user.id === expense.lender_id) {
            return <>
              {expense.borrowers.map((borrower, indexe) => {
                if (!borrower.is_paid) {
                  return (
                    <div key={expense.id + borrower.id} className="flex flex-row justify-between">
                      <p className="w-5/12 trucate">{expense.name}</p>
                      <p
                        className="w-4/12 trucate">{groupUsers.find(groupUser => groupUser.id === borrower.id)?.username}</p>
                      <p className="w-2/12 trucate">{borrower.amount}</p>
                      <input type="checkbox" className="w-1/12 trucate"
                             {...register(`expenses.${indexe}.borrowers.${indexb}.is_paid`)}
                      ></input>
                    </div>
                  )
                }
              })}
            </>
          }
        })}
      </>)
  }

  function togglePaid() {
    return(
      <label
        className='themeSwitcherTwo shadow-card relative inline-flex cursor-pointer select-none items-center justify-center rounded-md bg-white p-1'>
        <input
          type='checkbox'
          className='sr-only'
          checked={paid}
          onChange={() => setPaid(!paid)}
        />
        <span
          className={`flex items-center space-x-[6px] rounded py-2 px-[18px] text-sm font-medium ${
            !paid ? 'text-primary bg-[#f4f7ff]' : 'text-body-color'
          }`}
        >
          Not Paid
        </span>
        <span
          className={`flex items-center space-x-[6px] rounded py-2 px-[18px] text-sm font-medium ${
            paid ? 'text-primary bg-[#f4f7ff]' : 'text-body-color'
          }`}
        >
          Paid
        </span>
      </label>
    )
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full min-w-full justify-center p-4 text-center items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className="relative transform rounded-lg bg-white text-left w-full sm:max-w-[800px] shadow-xl transition-all">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 w-full">
                    <div className="sm:flex sm:items-start">
                      <div className="text-center sm:mt-0 sm:text-left w-full">
                        <Dialog.Title as="h1" className="flex flex-row justify-between font-bold pb-4">
                          <p>Lent List</p>
                          {togglePaid()}
                        </Dialog.Title>
                        <div className="mt-2">
                          {paid ? paidList() : notPaidList()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <input type="submit" value="Apply"
                           className="block w-full rounded-md bg-primary px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"/>
                    <button
                      type="button"
                      className="inline-flex w-full justify-center text-quaternary rounded-md bg-none px-3 py-2 text-sm font-semibold border-2 border-tertiary shadow-sm hover:bg-primary sm:mr-3 sm:w-auto"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default LentList;