import { Form, useLoaderData, redirect,  useNavigate,} from "react-router-dom";
import { updatePassword } from "../passwords";

export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  updates.upper_case = formData.get("upper_case")==="on"?true:false;
  updates.lower_case = formData.get("lower_case")==="on"?true:false;
  updates.number = formData.get("number")==="on"?true:false;
  updates.specials_chars = formData.get("specials_chars")==="on"?true:false;
  await updatePassword(params.passwordId, updates);
  return redirect(`/passwords/${params.passwordId}`);
}

export default function EditPassword() {
  const { password } = useLoaderData();
  const navigate = useNavigate();
  
  return (
   
      <><Form method="post" id="password-form">
      <label>

        <span>Name</span>
        <input
          placeholder="Service name ex: google, facebook..."
          aria-label="Service name"
          type="text"
          name="service"
          defaultValue={password.service} />


      </label>
      <label>
        <span>Username</span>
        <input
          type="text"
          name="username"
          placeholder="Username ex: john.doe@gmail.com John Doe"
          defaultValue={password.username} />
      </label>

      <label>
        <span>Counter</span>
        <input
          type="number"
          name="counter"
          min="0"
          defaultValue={password.counter||0}
           />
      </label>
      <label>
        <span>Service logo</span>
        <input
          placeholder="logo.jpg"
          aria-label="Logo URL"
          type="text"
          name="logo"
          defaultValue={password.logo} />
      </label>
      <div>
        <label>
          <span>Password length</span>
          <input
            type="number"
            name="password_length"
            placeholder={8}
            min="4"
            max="99"
            defaultValue={password.password_length||8} />
        </label>
        <label>
          <input
           id="upper_case"
           name="upper_case"
            type="checkbox"
            defaultChecked={password.upper_case}
             />
          <span>A-Z</span>
        </label>
        <label>
          <input
            type="checkbox"
            name="lower_case"
            defaultChecked={password.lower_case} />
          <span>a-z</span>
        </label>
        <label>
          <input
            type="checkbox"
            name="number"
            defaultChecked={password.number} />
          <span>0-9</span>
        </label>
        <label>
          <input
            type="checkbox"
            name="specials_chars"
            defaultChecked={password.specials_chars} />
          <span>~!@#$%^&*+-/.,\</span>
        </label>

      </div>

      <p>
        <button>Save</button>

        <button
          type="button"
          onClick={() => {
            navigate(-1);
          } }
        >
          Cancel
        </button>
      </p>
      
      </Form></>
  );
}