import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import {useNavigate, useParams} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function Rateds(){
    const [users, setUsers] = useState([]);
    const [rateds, setRateds] = useState([]);
    const [loading, setLoading] = useState(false);
    const {setNotification} = useStateContext();
    const [usersMap, setUsersMap] = useState({});
    let {id} = useParams();
    const [rated, setRated] = useState({
      id: null,
      mark: '',
      comment: '',
      lesson_id: '',
      laboratory_work_id: '',
      user_id: ''
    })
    const [selectedRatingId, setSelectedRatingId] = useState(null);
    const [editedMarks, setEditedMarks] = useState({}); // Состояние для отслеживания измененных оценок

  
    useEffect(() => {
      getUsers();
      getRateds();
    }, [])
  
    const getRateds = () => {
        setLoading(true)
        axiosClient.get('/rateds')
          .then(({ data }) => {
            setLoading(false)
            setRateds(data.data)
          })
          .catch(() => {
            setLoading(false)
          })
      }


    if (id) {
        useEffect(() => {
          setLoading(true)
          axiosClient.get(`/rateds/${id}`)
            .then(({data}) => {
              setLoading(false)
              setRated(data)
            })
            .catch(() => {
              setLoading(false)
            })
        }, [])
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
    useEffect(() => {
       
        const usersObj = users.reduce((acc, user) => {
          acc[user.id] = user.name;
          return acc;
        }, {});
        setUsersMap(usersObj);
      }, [users]);

      const groupedData = rateds.reduce((acc, item) => {
        const key = `${item.user_id}_${item.lesson_id}`;
        if (!acc[key]) {
          acc[key] = item.mark;
        }
        return acc;
      }, {});

      const lessonIds = [...new Set(rateds.map(item => item.lesson_id))];
      const userIds = [...new Set(rateds.map(item => item.user_id))];
      


      const addNewMark = (ratedsIds, userId, lessonId, newValue) => {
        const key = `${userId}_${lessonId}`;
        setEditedMarks({ ...editedMarks, [key]: {ratedsIds, newValue} });
      };

    
    const onSubmit = async (ev) => {
        ev.preventDefault();
      debugger;
        if (selectedRatingId) {
          try {
           
            await axiosClient.put(`/rateds/${selectedRatingId}`, {
              mark: newValue, // Добавляем новую оценку для обновления
            });
      
            setNotification('User was successfully updated');
            navigate('/rateds');
          } catch (error) {
          
          }
        } else {
       
        }
      };

    return (
      <div>
        <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
          <h1>Study group</h1>
          <h1>Discipline</h1>
          <Link className="btn-add" >Genetare a report</Link>
        </div>
        <div className="card animated fadeInDown">

        <table>
        <thead>
          <tr>
            <th>User ID</th>
            {lessonIds.map((lessonId) => (
              <th key={lessonId}>Lesson {lessonId}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {userIds.map((userId) => (
            <tr key={userId}>
              <td>{userId}</td>
              {lessonIds.map((lessonId) => (
                <td 
                key={`${userId}_${lessonId}`}
               
                contentEditable="true"
                onClick={(e) => {
                    const newValue = e.currentTarget.innerText;
                    const ratingId = rateds.find(item => item.user_id === userId && item.lesson_id === lessonId)?.id || null;
                    setSelectedRatingId(ratingId);
                    addNewMark(ratingId, userId, lessonId, newValue);
                   
                  }} >
                    {rateds.find(item => item.user_id === userId && item.lesson_id === lessonId)?.mark || ''}
                {/* {groupedData[`${userId}_${lessonId}`] || ' '} */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    <button className="btn" onClick={onSubmit}>Сохранить</button>
          {/* <table>
            <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              
            </tr>
            </thead>
            {loading &&
              <tbody>
              <tr>
                <td colSpan="2" class="text-center">
                  Loading...
                </td>
              </tr>
              </tbody>
            }
            {!loading &&
              <tbody>
            
                { rateds.map(r => (
                <tr key={r.id}>
                  <td>{r.user_id}</td>
                  <td>{usersMap[r.user_id] || 'Unknown User'}</td>
                </tr>
              ))}
             
              </tbody>
            }
          </table> */}
        </div>
      </div>
    )
}

   
