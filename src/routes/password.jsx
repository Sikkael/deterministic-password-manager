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
  const [passphrase, setPassPhrase] = useState("");
  const navigate = useNavigate();

  
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
    setOnDisplay(false);
    
    
  }

  async function getPassword() {
   
   if(passphrase!=='')
   {
    
    const pwd = await generatePassword(password.id, passphrase);
    document.getElementById("deterministic-password").value = pwd.toString();
    
    
   }
   else{
    alert("Please enter master password")

   }
   
}

useEffect(()=>{
  
  if(onDisplay)
  {
    clear("deterministic-password");
  }
   
},[password.id])
  
  return (
    <><div id="password">
      <div id="password-header">
      <div>
        <img
          key={password.logo}
          src={new URL("http://localhost:5173/src/images/" + password.logo, import.meta.url).href} />
          
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
      <div id="bloc_body">
        
        {password.username && (
          <p>
            <span id="span_username">Username</span>{password.username}
          </p>
        )}
        {password.counter && (
        <p>
          <span id="span_counter">Counter</span>{password.counter}
        </p>
        )}
        </div>
        
    </div>
    <div>
    {password.password_length ? (
              <p>
                     <span id="span_length">Password Length</span>{password.password_length}
              </p>
        ):(<p>
          <span id="span_length">Password Length</span>N/A
   </p>)}
             {password.upper_case ? (
              <p>
                     <span id="span_upper">Upper Case</span><MDBIcon far icon="check-square" />
              </p>
        ):(<p>
          <span id="span_upper">Upper Case</span><MDBIcon far icon="square" />
   </p>)}
   {password.lower_case ? (
              <p>
                     <span id="span_lower">Lower Case</span><MDBIcon far icon="check-square" />
              </p>
        ):(<p>
          <span id="span_lower">Lower Case</span><MDBIcon far icon="square" />
   </p>)}
  
   {password.number ? (
              <p>
                     <span id="span_number">Number</span><MDBIcon far icon="check-square" />
              </p>
        ):(<p>
          <span id="span_number">Number</span><MDBIcon far icon="square" />
   </p>)}
   {password.specials_chars ? (
              <p>
                     <span id="span_spec">Special chars</span><MDBIcon far icon="check-square" />
              </p>
        ):(<p>
          <span id="span_spec">Special chars</span><MDBIcon far icon="square" />
   </p>)}
   {!onDisplay && (
         <Form method="post"  id="password-form">   
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
        )}
    {onDisplay && (
        <>
          <div id="generate-pwd">
              <Form id="generate-pwd-form">
                <input
                  id="deterministic-password"
                  type="password"
                  name="deterministic-password" />
                <div>
                  <button
                    onClick={() => {
                      copyPassword("deterministic-password");

                    } }>
                    Copy
                  </button>
                  <input type="checkbox" onChange={() => { showPassword("deterministic-password"); } } />Show Generated Password
                  <button onClick={() => { clear("deterministic-password"); } }>Clear</button>

                </div>
              </Form>
            </div></>
        )}
    <Modal open={open}   onClose={() => 
      {  
         setOpen(false)
         setOnDisplay(false);
       
      }}>
          <h2>Enter password</h2>
          <form className="form">
            <div className="form__inputs">
              <label> Password </label>
              <input
                id="passphrase"
                type="password"
                placeholder="Password"
                onChange={(e) => {
                  setPassPhrase(e.target.value)
                  
                  
                }}
                required
              />
            </div>
            <button 
            type="button"
            onClick={()=>
                 {
                  
                  getPassword();
                  setOnDisplay(true)
                  setOpen(false);
                  
                }}> Get Password </button>
            <button
                 type="button"
                 onClick={() => {
                    
                    setOpen(false);
                    setOnDisplay(false);
                    
                  } }
             >
                 Cancel
           </button>
          </form>
        </Modal>
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
        <Form action="edit">
            <button type="submit">Edit</button>
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