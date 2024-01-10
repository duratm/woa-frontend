import React, {Fragment, useContext, useRef, useState} from "react";
import {Dialog, Listbox, Transition} from '@headlessui/react'
import {CheckIcon, TrashIcon} from '@heroicons/react/20/solid'
import GroupUsers from "../contexts/groupUsers.ts";
import {AuthContext} from "../contexts/auth.tsx";
import {SubmitHandler, useFieldArray, useForm} from "react-hook-form";

type FormValues = {
  name: string;
  users: {userId: number, username: string, avatar_url: string, amount: number}[];
};

function RegisterExpense({open, setOpen, group, setGroup}: Readonly<{
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  group: {
    id: number;
    name: string;
    expenses: {
      id: number;
      name: string;
      lender_id: number;
      borrowers: { id: number; amount: number; is_paid: boolean; }[];
    }[];
  }
  setGroup: React.Dispatch<React.SetStateAction<{
    id: number;
    name: string;
    expenses: {
      id: number;
      name: string;
      lender_id: number;
      borrowers: { id: number; amount: number; is_paid: number; }[];
    }[];
  }>>
}>) {
  const {groupUsers} = useContext(GroupUsers);
  const {user} = useContext(AuthContext);
  const [selected, setSelected] = useState({id: -1, username: "", avatar_url: "", amount: 0});
  const cancelButtonRef = useRef(null)
  const { control, register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "users",
    rules: {
      required: "Please add at least one user"
    }
  });

  const onSubmit: SubmitHandler<FormValues> = (data) =>  {
    console.log(data);
    fetch(import.meta.env.VITE_API_ENDPOINT + '/api/expenses',
      {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          groupId: group.id, name: data.name, users: data.users.map(item => {
            return {id: item.userId, amount: item.amount}
          })
        })
      }
    ).then(res => res.json()
    ).then(resData => {
      console.log("important");
      console.log(data);
      resData.borrowers = data.users.map(item => {
        return {id: item.userId, amount: item.amount, is_paid: false}
      })
      setGroup({...group, expenses: [...group.expenses, resData]})
      console.log(group);
      setOpen(false);
    }).catch((error) => {
      console.log(error);
    });
  }

  function displayUsers() {
    return <div className="flex flex-col w-full">
      {fields.map((user, index) =>
        <div key={user.id} className="flex flex-row items-center w-full justify-between m-2">
          <img src={user.avatar_url} alt={user.username} className="w-10 h-10 rounded-full"/>
          <p className="w-full">{user.username}</p>
          <input
            className={errors?.users?.[index]?.amount ? "block w-1/4 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-red-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" : "block w-1/4 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"}
            type="number"
            placeholder="Amount"
            {...register(`users.${index}.amount` , { required: true, valueAsNumber: true, min: 1 })}
          />

          <button onClick={() => remove(index)}><TrashIcon className="w-8 text-red-500"/></button>
        </div>
      )}
      {errors.users && fields.length > 0 && (
        <span className="text-red-500">Amounts must be greater than 1</span>
      )}
    </div>
  }

  function addUser() {
    console.log(selected)
    if (fields.find(item => item.userId === selected.id) === undefined && selected.id !== -1) {
      const select = {username: selected.username, avatar_url: selected.avatar_url, userId: selected.id, amount: 0}
      append(select);
      console.log(fields);
    }
  }

  function userList() {
    return (
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative">
          <Listbox.Button
            className="block w-full bg-white rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                        <span className="block truncate h-6">{}
                          {selected.id !== -1 ? <div className="flex flex-wrap">
                              <img src={selected.avatar_url} alt="pdp" className="w-6 h-6 rounded-full mr-2"/>
                              {selected.username}</div>
                            : <></>}
                        </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className="absolute max-h-60 w-full rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {groupUsers.filter(person => person.id !== user.id).map((person) => (
                <Listbox.Option
                  key={person.id}
                  className={({active}) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                    }`
                  }
                  value={person}
                >
                  {({selected}) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                          <div className="flex flex-wrap">
                          <img src={person.avatar_url} alt="pdp"
                               className="w-6 h-6 rounded-full mr-2"/>
                            {person.username}
                          </div>
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                              <CheckIcon className="h-5 w-5" aria-hidden="true"/>
                                            </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    )
  }


  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
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
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
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
                className="relative transform rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <form onSubmit={handleSubmit(onSubmit)} method="post"
                      className="mx-auto max-w-xl mt-4">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="text-center sm:mt-0 sm:text-left w-full">
                        <Dialog.Title as="h1" className="flex justify-center font-bold pb-4">
                          New Expense
                        </Dialog.Title>
                        <div className="mt-2">
                          <label
                            className="block tsext-sm font-semibold leading-6 text-gray-900 ">
                            Name:{' '}
                            <input type="text"
                                   {...register("name", { required: true })}
                                   className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                          </label>
                          {errors.name && <span className="text-red-500">A name is required</span>}
                          <label
                            className="block text-sm font-semibold leading-6 text-gray-900">
                            Users:
                          <div className="relative rounded-md shadow-sm">
                            {userList()}
                            <div className="absolute inset-y-0 right-0 flex items-center">
                              <button type="button"
                                     onClick={addUser}
                                     className="block w-fit rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 hover:bg-gray-100"
                                     >Add</button>
                            </div>
                          </div>
                          </label>
                          {errors.users && fields.length < 1 && <span className="text-red-500">A minimum of 1 user should be selected</span>}
                          {displayUsers()}

                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <input type="submit" value="Create"
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

export default RegisterExpense;