import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Sender from "./components/sender.tsx"
import Receiver from "./components/receiver.tsx"

const router = createBrowserRouter([
  {
    path:'/',
    element:<App/>,
    children:[
      {
        path:'/sender',
        element:<Sender/>
      },
      {
        path:'/receiver',
        element:<Receiver/>
      }
    ]
  }
])
createRoot(document.getElementById('root')!).render(
  
    <RouterProvider router={router}></RouterProvider>
)
