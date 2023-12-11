import {Link, Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import axiosClient from "../axios-client.js";
import {useEffect} from "react";


export default function HeaderLayout() {
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
    

        <header>
          <div>
          <Link to="/rateds">The journal of academic performance </Link> &nbsp; &nbsp;&nbsp; &nbsp;
          <Link to="/users">Users</Link>
       
          </div>
 

          <div>
            {user.name} &nbsp; &nbsp;
            
            <a onClick={onLogout} className="btn-logout" href="#">Logout</a>
          </div>
        </header>
        
       
  )
}