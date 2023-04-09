import { Form, useLoaderData, redirect,  useNavigate,} from "react-router-dom";
import { updatePassword } from "../passwords";

export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updatePassword(params.passwordId, updates);
  return redirect(`/passwords/${params.passwordId}`);
}

export default function Editpassword() {
  const { password } = useLoaderData();
  const navigate = useNavigate();

  return (
    <Form method="post" id="password-form">
      <p>
        <span>Name</span>
        <input
          placeholder="Service name ex: google, facebook..."
          aria-label="Service name"
          type="text"
          name="service"
          defaultValue={password.service}
        />
        
      </p>
      <label>
        <span>Username</span>
        <input
          type="text"
          name="username"
          placeholder="Username ex: john.doe@gmail.com John Doe"
          defaultValue={password.username}
        />
      </label>
      <label>
        <span>Passphrase</span>
        <input
          type="text"
          name="passphrase"
          placeholder="Your Passphrase"
          defaultValue={password.passphrase}
        />
      </label>
      <label>
        <span>Counter</span>
        <input
          type="number"
          name="counter"
          placeholder="0"
          min="0"
          defaultValue={password.counter}
        />
      </label>
      <label>
        <span>Service logo</span>
        <input
          placeholder="logo.jpg"
          aria-label="Logo URL"
          type="text"
          name="logo"
          defaultValue={password.logo}
        />
      </label>
      
      <p>
        <button type="submit">Save</button>
        <button
          type="button"
          onClick={() => {
            navigate(-1);
          }}
        >
          Cancel
        </button>
      </p>
    </Form>
  );
}