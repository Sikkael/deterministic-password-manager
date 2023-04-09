import {
  Outlet,
  NavLink,
  useLoaderData,
  Form,
  redirect,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { getPasswords, createPassword } from "../passwords";
import { useEffect } from "react";


export async function action() {
  const password = await createPassword();
  return redirect(`/passwords/${password.id}/edit`);
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const passwords = await getPasswords(q);
  return { passwords, q };
}

export default function Root() {
  const { passwords, q } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();
  
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has(
      "q"
    );

  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);


    return (
      <>
        <div id="sidebar">
          <h1>React Router passwords</h1>
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                className={searching ? "loading" : ""}
                aria-label="Search passwords"
                placeholder="Search"
                type="search"
                name="q"
                defaultValue={q}
                onChange={(event) => {
                  const isFirstSearch = q == null;
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
              />
              <div
                id="search-spinner"
                aria-hidden
                hidden={!searching}
              />
              <div
                className="sr-only"
                aria-live="polite"
              ></div>
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
          {passwords.length ? (
            <ul>
              {passwords.map((password) => (
                <li key={password.id}>
                  <NavLink
                    to={`passwords/${password.id}`}
                    className={({ isActive, isPending }) =>
                      isActive
                        ? "active"
                        : isPending
                        ? "pending"
                        : ""
                    }>
                    {password.service ? (
                      <>
                        {password.service}
                      </>
                    ) : (
                      <i>No Service</i>
                    )}{" "}
                    {password.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No passwords</i>
            </p>
          )}
        
          </nav>
        </div>
        <div id="detail"
        className={
          navigation.state === "loading" ? "loading" : ""
        }>
        <Outlet />
      </div>
      </>
    );
  }