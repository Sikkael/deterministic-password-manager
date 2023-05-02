import { Form, useLoaderData, useFetcher, useNavigate,} from "react-router-dom";
import { getPassword, updatePassword } from "../passwords";
import { useEffect, useState } from 'react';
import { generatePassword } from "../passwords";
import { MDBIcon } from 'mdb-react-ui-kit';
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

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
  const [open, setOpen] = useState(false);
  const [passphrase, setPassPhrase] = useState('');
  const navigate = useNavigate();
   
  useEffect(()=>{
    updatePassword(password.id,password)
  },[password]);
  
  
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

  async function addNewPassword() {
   
   if(passphrase!=='')
   {
    const x = await generatePassword(password.id, passphrase);
    document.getElementById("deterministic-password").value = x.toString();
    alert(x.toString());
    setPassPhrase("");
   }
   else{
    alert("Please enter master password")
   }
   
}
  
  return (
    <><div id="password">
      <div id="password-header">
      <div>
        <img
          key={password.logo}
          src={new URL("http://localhost:5173/src/images/" + password.logo, import.meta.url).href} />
          <Form onClick={(e)=>{e.preventDefault; alert("Salut")}}>
             <MDBIcon  icon='edit' size='xs'  />
                 Edit image
          </Form>
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
       
      </div>
      </div>
        <div>
        <Form method="post" id="password-form">
      
      <label>
        <span>Username</span>
        <input
          type="text"
          name="username"
          placeholder="Username ex: john.doe@gmail.com John Doe"
          defaultValue={password.username} 
          onChange={(e)=>{
            e.preventDefault();
            password.username = e.target.value;
            updatePassword(password.id,password);
          }}
          />
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
      
      <div>
        <label>
          <span>Password length</span>
          <input
            type="number"
            name="password_length"
            placeholder="8"
            min="4"
            max="99"
            defaultValue={password.password_length} />
        </label>
        <label>
          <input
            type="checkbox"
            name="upper_case"
            defaultChecked={password.upper_case} />
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
      <div >
      <button
          id="generate"
          className="btn-warning"
          onClick={() => {
            setOpen(true);
          }
          }
        >
          Generate
        </button>
      </div>
      
    </Form>
    <Modal open={open} onClose={() => setOpen(false)}>
          <h2>Enter password</h2>
          <form className="form">
            <div className="form__inputs">
              <label> Password </label>
              <input
                type="password"
                placeholder="Password"
                value={passphrase}
                onChange={(e) => setPassPhrase(e.target.value)}
                required
              />
            </div>

            <button onClick={addNewPassword}> Enter </button>
            <button
                 type="button"
                 onClick={() => {
                       setOpen(false);
                  } }
             >
                 Cancel
           </button>
          </form>
        </Modal>
    
      </div>
    </div>
    
    <div id="temp">
    <p>
        <button>Save</button>

        <button
          type="button"
          onClick={() => {
            navigate("/");
          } }
        >
          Cancel
        </button>
      </p>
      <button
        onClick={() => {
          copyPassword("deterministic-password");

        } }>
        Copy
      </button>
      <input type="checkbox" onChange={() => { showPassword("deterministic-password"); } } />Show Generated Password
      <button type="button" onClick={() => { clear("deterministic-password"); } }>Clear</button>

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


<div id="generate-pwd" >
    
        <Form id="generate-pwd-form">
        <input
            id="deterministic-password"
            type="password"
            name="deterministic-password"
             />
        
          <input
            id="passphrase"
            type="password"
            name="passphrase"
            placeholder="Enter master passphrase" required/>
            
          <div>
            <input type="checkbox" onChange={() => { showPassword("passphrase"); } } />Show Password
            
          </div>
          <div>
            <button onClick={() => { addNewPassword() }}>Generate</button>
          </div>
        </Form>
        
        
      </div>
    </div>
    <div id="footer-buttons">
       
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
            <button type="submit">
            <MDBIcon far icon="trash-alt"  className=" text-danger"/>
               <span>Delete</span>
            </button>
        </Form>
        <div id="history-btn-div">
        <button
          type="button"
          onClick={() => {
            alert("Sorry this option is not available")
          } }
        >
          <MDBIcon icon="history" /> 
          <span>
            See history
          </span>
          
        </button>
        </div>
        <div id="close-btn-div">
        <button
          type="button"
          onClick={() => {
            navigate("/");
          } }
        >
          Close
        </button>
        </div>
        <div>
          
        </div>
    

    </div>
      </> 
    
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