import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import {useNavigate, useParams} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import AsyncSelect from 'react-select/async';

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
    const [editedMarks, setEditedMarks] = useState({}); 
    const [academicLoads, setAcademicLoads] = useState([]);
    const [academicLoadsGroup, setAcademicLoadsGroup] = useState([]);
    const [selectedCell, setSelectedCell] = useState({
      userId: null,
      lessonId: null,
    });
    const [openDropdown, setOpenDropdown] = useState({
      userId: null,
      lessonId: null,
    });
    useEffect(() => {
      const fetchData = async () => {
        
        const result = await axiosClient.get('/disciplinename'); 
        setAcademicLoads(result.data);

      };
      fetchData();
    }, []);
 
    useEffect(() => {
      const fetchData = async () => {
        
        const result = await axiosClient.get('/studygroups'); 
        setAcademicLoadsGroup(result.data);

      };
      fetchData();
    }, []);
 
  
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

     
    const onSubmit = async () => {
    
  
        const {id, mark, lessonId, userId} = currentMark;

        console.log(id)

        if(id) {
          try {
         
            await axiosClient.put(`/rateds/${id}`, {
              mark: mark, 
            });
      
            setNotification('Оценка успешно изменена');
            navigate('/rateds');
          } catch (error) {
          
          }
        } else {
          try {
         
            await axiosClient.post(`/rateds`, {
              mark,
              comment: '',
              lesson_id: lessonId,
              laboratory_work_id: 1,
              user_id: userId
            });
      
            setNotification('Оценка сохранена');
            navigate('/rateds');
          } catch (error) {
          
          }
        }
     
      };

     const [currentMark, setCurrentMark] = useState({}); 

     console.log(rateds)
     console.log(userIds)
     
     const handleCellClick = (userId, lessonId) => {
      if (lessonId !== 0) {
        setSelectedCell({ userId, lessonId });
        setOpenDropdown({ userId, lessonId });
      }
    };

  
    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <select>
              <option value="" disabled selected hidden>
                Выберите группу
              </option>
              {academicLoadsGroup.map((load) => (
                <option key={load.id} value={load.study_group_id}>
                  {load.title}
                </option>
              ))}
            </select>
            &nbsp; &nbsp;&nbsp; &nbsp;
            <select>
              <option value="" disabled selected hidden>
                Выберите дисциплину
              </option>
              {academicLoads.map((load) => (
                <option key={load.id} value={load.discipline_id}>
                  {load.title}
                </option>
              ))}
            </select>
          </div>

          <Link className="btn-add">Создать отчет</Link>
        </div>
        <div className="card animated fadeInDown">
          <table>
            <thead>
              <tr>
                <th>ФИО</th>
                {lessonIds.map((lessonId) => (
                  <th key={lessonId}>Lesson {lessonId}</th>
                ))}
                <th>
                  {" "}
                  <button>+</button>
                </th>
              </tr>
            </thead>
            <tbody>
              {userIds.map((userId) => (
                <tr key={userId}>
                  <td>{usersMap[userId]}</td>

                  {lessonIds.map((lessonId) => (
                    <td
                      key={`${userId}_${lessonId}`}
                      contentEditable="true"
                      suppressContentEditableWarning="true"
                      style={{ position: "relative" }}
                      // onInput={(e) => {
                      //   console.log(e.target.innerText);
                      //   console.log(
                      //     `ID: ${
                      //       rateds.find(
                      //         (item) =>
                      //           item.user_id === userId &&
                      //           item.lesson_id === lessonId
                      //       )?.id || null
                      //     }`
                      //   );
                      //   const id =
                      //     rateds.find(
                      //       (item) =>
                      //         item.user_id === userId &&
                      //         item.lesson_id === lessonId
                      //     )?.id || null;
                      //   console.log(lessonId);
                      //   setCurrentMark({
                      //     id,
                      //     lessonId,
                      //     userId,
                      //     mark: e.target.innerText,
                      //   });
                      // }}
                      //onBlur={onSubmit}
                      onClick={() => handleCellClick(userId, lessonId)} 
                      // onClick={(e) => {
                      //     const newValue = e.currentTarget.innerText;
                      //     const ratingId = rateds.find(item => item.user_id === userId && item.lesson_id === lessonId)?.id || null;
                      //     setSelectedRatingId(ratingId);
                      //     addNewMark(ratingId, userId, lessonId, newValue);

                      //   }}
                    >
                      {rateds.find(
                        (item) =>
                          item.user_id === userId && item.lesson_id === lessonId
                      )?.mark || ""}



                       {lessonId !== 0 &&
                  openDropdown.userId === userId &&
                  openDropdown.lessonId === lessonId ? (
                    <div
                      style={{
                        position: "absolute",
                        border: "1px solid black",
                        padding: "20px",
                        top: "55px",
                        left: "50%",
                        zIndex: "99",
                        background: "rgb(186, 213, 255, 0.6)",
                        transform: "translateX(-50%)" 
                      }}
                    >
              <button className="btn-add" onClick={onSubmit}>
              Сохранить
            </button>
                    </div>
                  ) : (
                    userId[lessonId]
                  )}
                      
                      {/* {groupedData[`${userId}_${lessonId}`] || ' '} */}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <pre></pre>
            <button className="btn-add" onClick={onSubmit}>
              Сохранить
            </button>
          </div>

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
    );
}

   
