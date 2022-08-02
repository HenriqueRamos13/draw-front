import React, {
  Fragment,
  memo,
  SVGProps,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/solid";
import {
  BellIcon,
  LogoutIcon,
  MenuIcon,
  XIcon,
} from "@heroicons/react/outline";
import { classNames } from "../../utils/functions/ClassNames";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/context/auth";
import TextInput from "../TextInput";

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

export default function LayoutBase() {
  const [navigation, setNavigation] = useState([
    { name: "Dashboard", href: "/", current: true },
    { name: "Ranking", href: "ranking", current: false },
    { name: "Create Challenge", href: "challenge", current: false },
  ]);
  const { user: userIntern, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
  }, []);

  const userNavigation = [
    {
      name: "Perfil",
      href: "",
      function: () =>
        handleNavigation({ name: "Configurações", href: "/app/configuracoes" }),
    },
    { name: "Sair", href: "", function: () => handleLogout() },
  ];

  const handleNavigation = (item: any) => {
    setNavigation(
      Object.assign(
        [],
        navigation.map((nav) => ({
          ...nav,
          current: nav.name === item.name,
        }))
      )
    );

    navigate(item.href);
  };

  const changeTheme = () => {
    const isDark = document.documentElement?.classList?.contains("dark");

    if (isDark) {
      document?.documentElement?.classList?.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document?.documentElement?.classList?.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }

    localStorage.setItem("theme", isDark ? "light" : "dark");
  };

  const ButtonMenu = (item: any) => {
    return (
      <p
        key={item.name}
        onClick={() => handleNavigation(item)}
        className={classNames(
          "text-white hover:bg-indigo-500 hover:bg-opacity-75 dark:hover:dark:bg-gray-900 ",
          "rounded-md py-2 px-3 text-sm font-medium"
        )}
        aria-current={item.current ? "page" : undefined}
      >
        {item.name}
      </p>
    );
  };

  return (
    <>
      <div className="min-h-full">
        <div className="bg-indigo-600 pb-32 dark:bg-gray-800">
          <Disclosure
            as="nav"
            className="bg-indigo-600 border-b border-indigo-300 dark:bg-gray-800 dark:border-gray-300 border-opacity-25 lg:border-none"
          >
            {({ open }) => (
              <>
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                  <div className="relative h-16 flex items-center justify-between lg:border-b lg:border-indigo-400 lg:border-opacity-25">
                    <div className="px-2 flex items-center lg:px-0">
                      <div className="flex-shrink-0">
                        <img
                          className="block h-8 w-8"
                          src="https://tailwindui.com/img/logos/workflow-mark-indigo-300.svg"
                          alt="Workflow"
                        />
                      </div>
                      <div className="hidden lg:block lg:ml-10">
                        <div className="flex space-x-4">
                          {navigation.map((item) => (
                            <p
                              key={item.name}
                              onClick={() => handleNavigation(item)}
                              className={classNames(
                                item.current
                                  ? "bg-indigo-700 text-white dark:bg-gray-500 "
                                  : "text-white hover:bg-indigo-500 hover:bg-opacity-75 dark:hover:dark:bg-gray-900 ",
                                "rounded-md py-2 px-3 text-sm font-medium"
                              )}
                              aria-current={item.current ? "page" : undefined}
                            >
                              {item.name}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 px-2 flex justify-center lg:ml-6 lg:justify-end">
                      <div className="max-w-lg w-full lg:max-w-xs">
                        <label htmlFor="search" className="sr-only">
                          Search
                        </label>
                        <div className="relative text-gray-400 focus-within:text-gray-600">
                          <div className="pointer-events-none absolute inset-y-0 right-2 pl-3 flex items-center">
                            <SearchIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </div>
                          <TextInput
                            onChange={() => {}}
                            value={""}
                            placeholder="Search"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex lg:hidden">
                      {/* Mobile menu button */}
                      <Disclosure.Button className="bg-indigo-600 dark:bg-gray-800 p-2 rounded-md inline-flex items-center justify-center text-indigo-200 hover:text-white hover:bg-indigo-500 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white dark:focus:rinf-offset-gray-600">
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XIcon className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                          <MenuIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </Disclosure.Button>
                    </div>
                    <div className="hidden lg:block lg:ml-4">
                      <div className="flex items-center">
                        <button
                          id="theme-toggle"
                          type="button"
                          onClick={() => changeTheme()}
                          className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-lg text-sm p-2.5"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 dark:hidden"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 hidden dark:block"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            color="yellow"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        {/* <button
                          type="button"
                          className="bg-indigo-600 dark:bg-gray-800 flex-shrink-0 rounded-full p-1 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                        >
                          <span className="sr-only">View notifications</span>
                          <BellIcon className="h-6 w-6" aria-hidden="true" />
                        </button> */}

                        {isAuthenticated ? (
                          <>
                            <p className="text-white dark:text-gray-300 ml-2">
                              {user.name}
                            </p>
                            <button
                              type="button"
                              className="ml-auto bg-indigo-600 dark:bg-gray-800 flex-shrink-0 rounded-full p-1 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                            >
                              <span className="sr-only">Logout</span>
                              <LogoutIcon
                                className="h-6 w-6 ml-2"
                                aria-hidden="true"
                              />
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="btn btn-sm btn-secondary mx-3">
                              Sign in
                            </button>
                            <button className="btn btn-sm btn-accent btn-outline">
                              Sign up
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Disclosure.Panel className="lg:hidden">
                  <div className="px-2 pt-2 pb-3 space-y-1">
                    {navigation.map((item) => (
                      <Disclosure.Button
                        as={() => ButtonMenu(item)}
                      ></Disclosure.Button>
                    ))}
                  </div>
                  <div className="pt-4 pb-3 border-t border-indigo-700 dark:border-gray-300">
                    <div className="px-5 flex items-center">
                      {isAuthenticated ? (
                        <>
                          <div className="ml-3">
                            <div className="text-base font-medium text-white">
                              <p className="text-white dark:text-gray-300 ml-2">
                                {user.name}
                              </p>
                            </div>
                          </div>

                          {/* <button
                        type="button"
                        className="ml-auto bg-indigo-600 dark:bg-gray-800 flex-shrink-0 rounded-full p-1 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                      >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button> */}
                          <button
                            type="button"
                            className="ml-auto bg-indigo-600 dark:bg-gray-800 flex-shrink-0 rounded-full p-1 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                          >
                            <span className="sr-only">Logout</span>
                            <LogoutIcon
                              className="h-6 w-6 ml-2"
                              aria-hidden="true"
                            />
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-sm btn-secondary mx-3">
                            Sign in
                          </button>
                          <button className="btn btn-sm btn-accent btn-outline">
                            Sign up
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <header className="py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* <h1 className="text-3xl font-bold text-white">Dashboard</h1> */}
            </div>
          </header>
        </div>

        <main className="-mt-32 bg-transparent">
          <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
            {/* Replace with your content */}

            <Outlet />

            {/* /End replace */}
          </div>
        </main>
      </div>
    </>
  );
}
