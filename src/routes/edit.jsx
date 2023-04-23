import { Form, useLoaderData, redirect,  useNavigate,} from "react-router-dom";
import { updatePassword } from "../passwords";
import { Favorite } from "./password"

export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updatePassword(params.passwordId, updates);
  return redirect(`/passwords/${params.passwordId}`);
}

export default function EditPassword() {
  const { password } = useLoaderData();
  const navigate = useNavigate();

  return (
   
      <Form method="post" id="password-form">
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
          <span>Passphrase</span>
          <input
            type="password"
            name="passphrase"
            placeholder="Your Passphrase"
            defaultValue={password.passphrase} />
        </label>
        <label>
          <span>Counter</span>
          <input
            type="number"
            name="counter"
            placeholder="0"
            min="0"
            defaultValue={password.counter} />
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
             <button 
               onClick={() => { 
                  copyPassword("deterministic-password");
                  
                   }}>
                Copy
              </button>
              <input type="checkbox" onChange={() => { showPassword("deterministic-password"); } } />Show Generated Password
              <button onClick={() => { clear("deterministic-password") }}>Clear</button>
              <div>
        <label>
          <span>Password length</span>
          <input
            type="number"
            name="password_length"
            placeholder="0"
            min="0"
            defaultValue={16} />
        </label>
        <label>      
          <input
            type="checkbox"
            name="upper_case"
            defaultChecked={true}
             />
            <span>A-Z</span>
        </label>
        <label> 
        <input
            type="checkbox"
            name="lower_case"
            defaultChecked={true}
             />
            <span>a-z</span>
        </label>
        <label> 
        <input
            type="checkbox"
            name="number"
            defaultChecked={true}
             />
            <span>0-9</span>
        </label>
        <label> 
        <input
            type="checkbox"
            name="specials_chars"
            defaultChecked={true}
             />
            <span>~!@#$%^&*+-/.,\</span>
        </label>
          </div>
          </div>

        <p>
          <button type="submit">Save</button>
          <button
            type="button"
            onClick={() => {
              navigate(-1);
            } }
          >
            Cancel
          </button>
        </p>
      </Form>
  );
}