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

export default function LayoutBase() {
  const [navigation, setNavigation] = useState([
    { name: "Dashboard", href: "/", current: true },
    { name: "Ranking", href: "ranking", current: false },
    { name: "Create Challenge", href: "challenge", current: false },
  ]);
  const { user, isAuthenticated, logout, login, register, checkingSession } =
    useAuth();
  const navigate = useNavigate();
  const [modal, setModal] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleLogin = () => {
    login(email, password);
  };

  useEffect(() => {
    if (user) {
      modal && setModal(null);
      email.length && setEmail("");
      username.length && setUsername("");
      password.length && setPassword("");
      confirmPassword.length && setConfirmPassword("");
    }
  }, [user]);

  const handleRegister = () => {
    register(email, username, password, confirmPassword);
  };

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
      <div className="min-h-full bg-gray-100 dark:bg-gray-700">
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
                      {/* <div className="max-w-lg w-full lg:max-w-xs">
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
                      </div> */}
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

                        {isAuthenticated && user ? (
                          <>
                            <p
                              className="text-white dark:text-gray-300 ml-2 cursor-pointer"
                              onClick={() => navigate(`user/${user.username}`)}
                            >
                              {user.username}
                            </p>
                            <button
                              type="button"
                              onClick={() => logout()}
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
                            <button
                              onClick={() => setModal("Login")}
                              className="btn btn-sm btn-secondary mx-3"
                            >
                              Sign in
                            </button>
                            <button
                              onClick={() => setModal("Register")}
                              className="btn btn-sm btn-accent btn-outline"
                            >
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
                      {isAuthenticated && user ? (
                        <>
                          <div className="ml-3">
                            <div className="text-base font-medium text-white">
                              <p
                                className="text-white dark:text-gray-300 ml-2 cursor-pointer"
                                onClick={() =>
                                  navigate(`user/${user.username}`)
                                }
                              >
                                {user.username}
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
                            onClick={() => logout()}
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
                          <button
                            onClick={() => setModal("Login")}
                            className="btn btn-sm btn-secondary mx-3"
                          >
                            Sign in
                          </button>
                          <button
                            onClick={() => setModal("Register")}
                            className="btn btn-sm btn-accent btn-outline"
                          >
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

        <main className="-mt-32 bg-none">
          <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 bg-none">
            {/* Replace with your content */}

            <Outlet />

            {/* /End replace */}
            {modal && !isAuthenticated && (
              <div className={classNames("modal", modal ? "modal-open" : "")}>
                <div className="modal-box relative">
                  <label
                    htmlFor="my-modal-3"
                    className="btn btn-sm btn-circle absolute right-2 top-2"
                    onClick={() => setModal(null)}
                  >
                    ✕
                  </label>

                  <div className="card-body">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Email</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Email"
                        className="input input-bordered"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                      />
                    </div>
                    {modal === "Register" && (
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Username</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Username"
                          className="input input-bordered"
                          onChange={(e) => setUsername(e.target.value)}
                          value={username}
                        />
                      </div>
                    )}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Password</span>
                      </label>
                      <input
                        type="password"
                        placeholder="Password"
                        className="input input-bordered"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                      />
                      {modal === "Login" && (
                        <label className="label">
                          <p className="label-text-alt link link-hover cursor-pointer">
                            Forgot password?
                          </p>
                        </label>
                      )}
                    </div>
                    {modal === "Register" && (
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Confirm Password</span>
                        </label>
                        <input
                          type="password"
                          placeholder="Confirm Password"
                          className="input input-bordered"
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          value={confirmPassword}
                        />
                      </div>
                    )}
                    <div className="form-control mt-6">
                      <button
                        disabled={!!checkingSession}
                        onClick={() => {
                          if (checkingSession) {
                            return;
                          }
                          if (modal === "Login") {
                            handleLogin();
                          } else {
                            handleRegister();
                          }
                        }}
                        className="btn btn-primary"
                      >
                        {checkingSession ? "Loading..." : modal}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        <footer className="footer footer-center p-10 bg-indigo-600 dark:bg-gray-800 text-primary-content">
          <div>
            <svg
              width="50"
              height="50"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill-rule="evenodd"
              clip-rule="evenodd"
              className="inline-block fill-current"
            >
              <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
            </svg>
            <p className="font-bold">
              A website for artists. <br />
              Show your art for people.
            </p>
            <p>Copyright © 2022 - All right reserved</p>
          </div>
          {/* <div>
            <div className="grid grid-flow-col gap-4">
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                </svg>
              </a>
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                </svg>
              </a>
            </div>
          </div> */}
        </footer>
      </div>
    </>
  );
}
