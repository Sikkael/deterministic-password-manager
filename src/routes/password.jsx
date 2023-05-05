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
  const [username, setUsername] = useState(password.username);
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
  
  useEffect(()=>{
    setUsername(password.username);
    console.log(password.counter)
  })
  
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
        
        {password.username && (
          <p>
            <span id="span_profile">Username</span>{password.username}
          </p>
        )}
        {password.counter && (
        <p>
          <span id="span_profile">Counter</span>{password.counter}
        </p>
        )}
        
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