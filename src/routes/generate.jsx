import { redirect } from "react-router-dom";
import { generatePassword } from "../passwords";

export async function action({ params }) {
  await generatePassword(params.passwordId);
  return redirect("/");
}