import {Disclosure, Menu, Transition} from "@headlessui/react";
import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";
import {Fragment, useContext, useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import RegisterGroup from "./registerGroup.tsx";
import {AuthContext} from "../contexts/auth.tsx";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const NavBar = () => {
  const computerStyle = {
    currentNavStyle: "bg-secondary text-quaternary rounded-md px-3 py-2 text-sm font-medium",
    navStyle: "text-tertiary hover:bg-quaternary hover:text-white rounded-md px-3 py-2 text-sm font-medium"
  }
  const [open, setOpen] = useState(false)
  const mobileStyle = {
    currentNavStyle: "bg-secondary text-quaternary block rounded-md px-3 py-2 text-base font-medium",
    navStyle: "text-tertiary hover:bg-quaternary hover:text-white block rounded-md px-3 py-2 text-base font-medium"
  }
  const navItems = [{name: "Create Group", link: ""}]
  const profileItems = [{name: "Profile", link: "/profile"}, {name: "Settings", link: "/settings"}, {
    name: "Logout",
    link: "/logout"
  }]
  const [currentNav, setCurrentNav] = useState("Home")
  const {user, setUser} = useContext(AuthContext);

  function logout() {
    axios.get(
      import.meta.env.VITE_API_ENDPOINT + '/auth/me/logout',
      {withCredentials: true}
    ).then(() => {
      setUser({username: "", avatar_url: "", email: "", isAuth: false})
    }).catch((error: any) => {
      console.log(error);
    });
  }

  function navButton(displayType: string) {
    return navItems.map((item) => {
      if (displayType === "computer") {
        return <button key={item.name}
                       className={currentNav === item.name ? computerStyle["currentNavStyle"] : computerStyle["navStyle"]}
                       onClick={() => {
                         setCurrentNav(item.name)
                         setOpen(true)
                       }}>{item.name}</button>
      }
      return <button key={item.name}
                     className={currentNav === item.name ? mobileStyle["currentNavStyle"] : mobileStyle["navStyle"]}
                     onClick={() => {
                       setCurrentNav(item.name)
                       setOpen(true)
                     }}>{item.name}</button>
    })
  }

  function profileButton() {
    return (
      <Menu as="div" className="relative ml-3">
        <div>
          <Menu.Button
            className="relative flex rounded-full bg-primary text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            <span className="absolute -inset-1.5"/>
            <span className="sr-only">Open user menu</span>
            <img
              className="h-8 w-8 rounded-full"
              src={user.avatar_url}
              alt=""/>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {profileItems.map((item) => {
              if (item.name !== "Logout") {
                return <Menu.Item key={item.name}>
                  <Link
                    to={item.link}
                    className={classNames(currentNav == item.name ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                    onClick={() => setCurrentNav(item.name)}
                  >
                    {item.name}
                  </Link>
                </Menu.Item>
              } else {
                return <Menu.Item key={item.name}>
                  <button
                    className={classNames(currentNav == item.name ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                    onClick={() => logout()}
                  >
                    {item.name}
                  </button>
                </Menu.Item>
              }
            })
            }

          </Menu.Items>
        </Transition>
      </Menu>
    )
  }

  if (user.isAuth) {
    return (
      <>
        <Disclosure as="nav" className="bg-none backdrop-blur-sm absolute w-full">
          {({open}) => (
            <>
              <div className="mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                  <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    {/* Mobile menu button*/}
                    <Disclosure.Button
                      className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                      <span className="absolute -inset-0.5"/>
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true"/>
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true"/>
                      )}
                    </Disclosure.Button>
                  </div>
                  <div
                    className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                    <div className="flex flex-shrink-0 items-center">
                      <img
                        className="h-8 w-auto"
                        src="/logo.svg"
                        alt="Your Company"/>
                    </div>
                    <div className="hidden sm:ml-6 sm:block">
                      <div className="flex space-x-4">
                        {navButton("computer")}
                      </div>
                    </div>
                  </div>
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    {/* Profile dropdown */}
                    {profileButton()}
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="sm:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2">
                  {navButton("mobile")}
                </div>
              </Disclosure.Panel>


            </>
          )}
        </Disclosure>
        <RegisterGroup open={open} setOpen={setOpen}/>
      </>
    )
  }
}

export default NavBar;