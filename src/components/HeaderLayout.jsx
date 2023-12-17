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
          <Link to="/rateds">Журнал успеваемости </Link> &nbsp; &nbsp;&nbsp; &nbsp;
          <Link to="/users">Пользователи</Link>
       
          </div>
 

          <div>
            {user.name} &nbsp; &nbsp;
            {/* <a  className="btn-logout" href="#">Рейтинг студентов</a> */}
            <a onClick={onLogout} className="btn-logout" href="#">Выйти</a>
          </div>
        </header>
        
       
  )
}