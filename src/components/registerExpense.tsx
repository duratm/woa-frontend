import React, {Fragment, useEffect, useRef, useState} from "react";
import {Dialog, Listbox, Transition} from '@headlessui/react'
import {CheckIcon, TrashIcon} from '@heroicons/react/20/solid'
function RegisterExpense({open, setOpen, group, setGroup}: Readonly<{
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  group: {
    id: number;
    name: string;
    expenses: { id: number; name: string; lender_id: number; borrowers: { id: number; amount: number; is_paid: number; }[]; }[];
  }
  setGroup: React.Dispatch<React.SetStateAction<{
    id: number;
    name: string;
    expenses: { id: number; name: string; lender_id: number; borrowers: { id: number; amount: number; is_paid: number; }[]; }[];
  }>>
}>) {
  const [errors, setErrors] = useState("");
  const [users, setUsers] = useState([{id: 0, username: "", avatar_url: ""}]);
  const [selected, setSelected] = useState(users[0]);
  const [selectedUsers, setSelectedUsers] = useState([{id: 0, username: "", avatar_url: "", amount: 0}]);
  const cancelButtonRef = useRef(null)

  useEffect(() => {
    init()
  }, [""]);
  let init = () => {
    fetch(import.meta.env.VITE_API_ENDPOINT + '/users/all', {method: 'POST', credentials: 'include'}
    ).then(res => res.json()
    ).then(data => {
      console.log(data);
      setUsers(data);
      setSelected(data[0]);
      setSelectedUsers(selectedUsers.filter(item => item.id !== 0));
    }).catch((error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      console.log(errors);
      setErrors(error.response?.data?.error);
    });
  }
  let handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };

    };
    fetch(import.meta.env.VITE_API_ENDPOINT + '/groups/expense/create',
      {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify({groupId: group.id, name: target.name.value, users: selectedUsers.map(item => {return {id: item.id, amount: item.amount}})})
      }
    ).then(res => res.json()
    ).then(data => {
      console.log(data);
      data.borrowers = selectedUsers.map(item => {return {id: item.id, amount: item.amount, is_paid: false}})
      setGroup({...group, expenses: [...group.expenses, data]})
      console.log(group);
      setOpen(false);
    }).catch((error) => {
      console.log(error);
      setErrors(error.response?.data?.error);
    });
  }

  function removeUser(id: number) {
    setSelectedUsers(selectedUsers.filter(item => item.id !== id));
  }

  function handleChange() {
    return (e: React.SyntheticEvent) => {
      const target = e.target as typeof e.target & {
        value: string;
        name: string;
      };
      setSelectedUsers(selectedUsers.map(item => {
        if (item.id === parseInt(target.name)) {
          return {...item, amount: parseInt(target.value)};
        }
        return item;
      }));
    }
  }
  function displayUsers() {
    if (selectedUsers.length === 0) return (<></>);
    return (
      <div className="flex flex-col w-full">
        {selectedUsers.map(user =>
          <div key={user.id} className="flex flex-row items-center w-full justify-between m-2">
            <img src={user.avatar_url} alt={user.username} className="w-10 h-10 rounded-full"/>
            <p>{user.username}</p>
            <input className="border-2 border-secondary rounded" name={user.id+""} placeholder="Amount" onInput={handleChange()}/>
            <button onClick={() => removeUser(user.id)}><TrashIcon className="w-8 text-red-500"/></button>
          </div>
        )}
      </div>
    )
  }

  function addUser() {
    if (selectedUsers.find(item => item.id === selected.id) === undefined) {
      const select = {...selected, amount: 0}
      setSelectedUsers([...selectedUsers, select]);
    }
  }

  function userList() {
    return (
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative">
          <Listbox.Button
            className="block w-full bg-white rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                        <span className="block truncate h-6"><div className="flex flex-wrap">
                            <img src={selected.avatar_url} alt="pdp"
                                 className="w-6 h-6 rounded-full mr-2"/>
                          {selected.username}
                            </div>
                        </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className="absolute max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {users.map((person) => (
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
                className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <form onSubmit={handleSubmit} method="post"
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
                            <input type="text" name="name"
                                   className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                          </label>
                          <label
                            className="block text-sm font-semibold leading-6 text-gray-900">
                            Users:
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            {userList()}
                            <div className="absolute inset-y-0 right-0 flex items-center">
                              <input type={'button'} onClick={addUser}
                                     className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 hover:bg-gray-100"
                                     value="Add"/>
                            </div>
                          </div>
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