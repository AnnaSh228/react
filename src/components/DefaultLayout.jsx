import {Link, Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import axiosClient from "../axios-client.js";
import {useEffect} from "react";
import HeaderLayout from "./HeaderLayout.jsx";



export default function DefaultLayout() {
  const {user, token, setUser, setToken, notification} = useStateContext();

  if (!token) {
    return <Navigate to="/login"/>
  }

  const onLogout = ev => {

    ev.preventDefault()

    axiosClient.post('/logout')
    .then(() => {
      setUser({})
      setToken(null)
    })
}



  useEffect(() => {
    axiosClient.get('/user')
      .then(({data}) => {
         setUser(data)
      })
  }, [])

  

  return (
    <div id="defaultLayout">
  
      <div className="content">
        <HeaderLayout/>
  
                                                                                                                                                        
        {/* <header>
          <div>
            Header
          </div>

          <div>
            {user.name} &nbsp; &nbsp;
            
            <a onClick={onLogout} className="btn-logout" href="#">Logout</a>
          </div>
        </header> */}
        <main>
          <Outlet/>
        </main>
        {notification &&
          <div className="notification">
            {notification}
          </div>
        }
      </div>
    </div>
  )
}