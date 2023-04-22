import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
import { generatePassword } from "../passwords";


export async function action({ params }) {
  await generatePassword(params.passwordId);
  return redirect(`/passwords/${params.passwordId}/generate`);
}

export async function loader({ params }) {
  const password = await getPassword(params.passwordId);
  if (!password) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  await generatePassword(password.id);
  return { password };
}

export default function GeneratePassword() {
const navigate = useNavigate();
const { password } = useLoaderData();

async function genPass() {
  const x = await generatePassword(password.id)
  document.getElementById("gen").value = x.toString()
  
  
}


async function myFunction() {
  var x = document.getElementById("gen");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

function copyPassword(){
  navigator.clipboard.writeText(document.getElementById("gen").value)
}

function clear(){
  document.getElementById("gen").value = ''
  
}

return (
  <div >
     {password.service} 
     <div>
     <button onClick={() => navigate(-1)}>Close</button>
     </div>
     <div>
     <button onClick={() => { genPass() }}>Generate</button>
     </div>
     <input 
       id="gen"
       type="password"
       name="username"
       placeholder="Oups.."
       
     />
     
     <div>
          <input type="checkbox" onChange={() => { myFunction()}}/>Show Password
     </div>
     <div>
     <button onClick={() => { copyPassword() }}>Copy</button>
     <button onClick={() => { clear() }}>Clear</button>
     </div>
     
     
  </div>
);
};