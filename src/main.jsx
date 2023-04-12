import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import ErrorPage from "./error-page";
import Root, {
  loader as rootLoader,
  action as rootAction,
} from "./routes/root";
import Password, {
  loader as passwordLoader,
  action as passwordAction,
} from "./routes/password";
import Editpassword, {
  action as editAction,
} from "./routes/edit";
import { action as destroyAction } from "./routes/destroy";
import { action as generateAction } from "./routes/generate";
import Index from "./routes/index";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
    action: rootAction,
    errorElement: <ErrorPage />,
    children:[
      {
        errorElement: <ErrorPage />,
        children: [
     
          {
            index: true, 
            element: <Index /> 
          },
          {
            path: "passwords/:passwordId",
            element: <Password />,
            loader: passwordLoader,
            action: passwordAction,
          },
          {
            path: "passwords/:passwordId/edit",
            element: <Editpassword />,
            loader: passwordLoader,
            action: editAction,
          },
          {
            path: "passwords/:passwordId/destroy",
            action: destroyAction,
            errorElement: <div>Oops! There was an error.</div>,
          },
          {
            path: "passwords/:passwordId/generate",
            action: generateAction,
            errorElement: <div>Oops! There was an error.</div>,
          },
         
        ],
      }
    ],
    
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);