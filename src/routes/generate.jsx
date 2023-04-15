import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
import { generatePassword } from "../passwords";

export async function action({ params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updatePassword(params.passwordId, updates);
  return redirect(`/passwords/${params.passwordId}`);
}

export default function GeneratePassword() {
const navigate = useNavigate();
return (
  <div className="modalDiv">
    <div className="modal">
      <h3>Modal</h3>
      <button onClick={() => navigate(-1)}>Close</button>
    </div>
  </div>
);
};