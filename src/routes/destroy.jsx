import { redirect } from "react-router-dom";
import { deletePassword } from "../passwords";

export async function action({ params }) {
  await deletePassword(params.passwordId);
  return redirect("/");
}