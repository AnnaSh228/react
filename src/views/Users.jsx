import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function Users(){
   

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const {setNotification} = useStateContext()
  
    useEffect(() => {
      getUsers();
    }, [])
  
    const onDeleteClick = user => {
      if (!window.confirm("Are you sure you want to delete this user?")) {
        return
      }
      axiosClient.delete(`/users/${user.id}`)
        .then(() => {
          setNotification('User was successfully deleted')
          getUsers()
        })
    }
  
    const getUsers = () => {
      setLoading(true)
      axiosClient.get('/users')
        .then(({ data }) => {
          setLoading(false)
          setUsers(data.data)
        })
        .catch(() => {
          setLoading(false)
        })
    }
  
    return (
      <div>
        <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
          <h1>Пользователи</h1>
          <Link className="btn-add" to="/users/new">Добавить нового</Link>
        </div>
        <div className="card animated fadeInDown">
          <table>
            <thead>
            <tr>
              <th>ID</th>
              <th>ФИО</th>
              <th>Email</th>
              <th>Дата создания</th>
              <th>Действия</th>
            </tr>
            </thead>
            {loading &&
              <tbody>
              <tr>
                <td colSpan="5" class="text-center">
                  Загрузка...
                </td>
              </tr>
              </tbody>
            }
            {!loading &&
              <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.created_at}</td>
                  <td>
                    <Link className="btn-edit" to={'/users/' + u.id}>Редактировать</Link>
                    &nbsp;
                    <button className="btn-delete" onClick={ev => onDeleteClick(u)}>Удалить</button>
                  </td>
                </tr>
              ))}
              </tbody>
            }
          </table>
        </div>
      </div>
    )
}