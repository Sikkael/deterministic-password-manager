import { Form, useLoaderData, useFetcher,} from "react-router-dom";
import { getPassword, updatePassword } from "../passwords";


export async function action({ request, params }) {
  let formData = await request.formData();
  return updatePassword(params.passwordId, {
    favorite: formData.get("favorite") === "true",
  });
}

export async function loader({ params }) {
  const password = await getPassword(params.passwordId);
  if (!password) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  return { password };
}

export default function password() {
  const { password } = useLoaderData();
  console.log(new URL(password.avatar, import.meta.url).href);
  return (
    <div id="password">
      <div>
        <img
          key={password.avatar}
          src= {new URL("http://localhost:5173/src/images/"+password.avatar, import.meta.url).href}
        />
      </div>
      <div>
         
      </div>
      <div>
        <h1>
          {password.first || password.last ? (
            <>
              {password.first} {password.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite password={password} />
        </h1>

        {password.twitter && (
          <p>
            <a
              target="_blank"
              href={`https://twitter.com/${password.twitter}`}
            >
              {password.twitter}
            </a>
          </p>
        )}

        {password.notes && <p>{password.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (
                !confirm(
                  "Please confirm you want to delete this record."
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ password }) {
  const fetcher = useFetcher();
  // yes, this is a `let` for later
  let favorite = password.favorite;
  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }
  return (
    <fetcher.Form method="post">
    <button
      name="favorite"
      value={favorite ? "false" : "true"}
      aria-label={
        favorite
          ? "Remove from favorites"
          : "Add to favorites"
      }
    >
      {favorite ? "★" : "☆"}
    </button>
  </fetcher.Form>
  );
}