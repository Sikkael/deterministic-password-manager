import { Form, useLoaderData, useFetcher} from "react-router-dom";
import { getPassword, updatePassword } from "../passwords";
import { useState } from 'react';
import { generatePassword } from "../passwords";

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

export default function Password() {
  const { password } = useLoaderData();
  const [onDisplay,setOnDisplay] = useState(false);
  async function showPassword(id) {
    var x = document.getElementById(id);
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }
  
  function copyPassword(id){
    
    navigator.clipboard.writeText(document.getElementById(id).value)
    alert("Your password has been copied!");
    alert("Don't forget to clear your password from your clipboard!")
  }
  
  function clear(id){
    document.getElementById(id).value = ''
    
  }

  async function handleGenerationClick(){
    
    var x = document.getElementById("generate-pwd-form");
    x.style.display = onDisplay?"none":"block";
    let isOpen = !onDisplay; 
    setOnDisplay(isOpen);
    
    
  }

  async function genPass() {
   let pass = document.getElementById("passphrase").value;
   if(pass!=='')
   {
    const x = await generatePassword(password.id, pass);
    document.getElementById("deterministic-password").value = x.toString();
    document.getElementById("passphrase").value ='';
   }
   else{
    alert("Please enter master password")
   }
   
}
  
  return (
    <><div id="password">
      <div>
        <img
          key={password.logo}
          src={new URL("http://localhost:5173/src/images/" + password.logo, import.meta.url).href} />
      </div>
      <div>

      </div>
      <div>
        <h1>
          {password.service ? (
            <>
              {password.service}
            </>
          ) : (
            <i>No Service</i>
          )}{" "}
          <Favorite password={password} />
        </h1>
        {password.username && (
          <p>
            {password.username}
          </p>
        )}

        {password.counter && <p>{password.counter}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!confirm(
                "Please confirm you want to delete this record."
              )) {
                event.preventDefault();
              }
            } }
          >
            <button type="submit">Delete</button>
          </Form>
          <Form
            method="post"
            onClick={() => {
              handleGenerationClick();
            } }
          >
            <button type="button"
               
               
            >{onDisplay ? (<>{"Close Password Generator"}</>):(<>{"Open Password Generator"}</>)}
            </button>
          </Form>


        </div>
      </div>
    </div>
    
    <div id="generate-pwd">

        <Form id="generate-pwd-form">
        <input
            id="deterministic-password"
            type="password"
            name="deterministic-password"
             />
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

          <input
            id="passphrase"
            type="password"
            name="passphrase"
            placeholder="Enter master passphrase" required/>
            
          <div>
            <input type="checkbox" onChange={() => { showPassword("passphrase"); } } />Show Password
            
          </div>
          <div>
            <button onClick={() => { genPass() }}>Generate</button>
          </div>
        </Form>
      </div></> 
    
  );
}

export function Favorite({ password }) {
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