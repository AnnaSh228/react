import { useEffect, useState, useRef } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import AsyncSelect from "react-select/async";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'



export default function Rateds() {
  const [users, setUsers] = useState([]);
  const [rateds, setRateds] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [lessons, setLessons] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [lessonsMap, setLessonsMap] = useState({});
  const [selectedDisciplineId, setSelectedDisciplineId] = useState("");
  const [selectedStudyGroupId, setSelectedStudyGroupId] = useState("");
  let { id } = useParams();
  const [rated, setRated] = useState({
    id: null,
    mark: "",
    comment: "",
    lesson_id: "",
    laboratory_work_id: "",
    user_id: "",
  });

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
  const [laboratoryWorks, setLaboratoryWorks] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axiosClient.get("/disciplinename");
      setAcademicLoads(result.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axiosClient.get("/studygroups");
      setAcademicLoadsGroup(result.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    getUsers();
    getRateds();
    getLessons();
  }, []);
  useEffect(() => {
    if (selectedDisciplineId !== "" && selectedStudyGroupId !== "") {
      getRateds();
    }
  }, [selectedDisciplineId, selectedStudyGroupId]);
  useEffect(() => {
    if (selectedDisciplineId !== "" && selectedStudyGroupId !== "") {
      getLessons();
    }
  }, [selectedDisciplineId, selectedStudyGroupId]);

  useEffect(() => {
    if (selectedStudyGroupId !== "") {
      getUsers();
    }
  }, [selectedStudyGroupId]);

 
  const getRateds = () => {
    if (selectedDisciplineId !== "" && selectedStudyGroupId !== "") {
      setLoading(true);
      axiosClient
        .get(
          `/rateds?study_group_id=${selectedStudyGroupId}&discipline_id=${selectedDisciplineId}`
        )
        .then(({ data }) => {
          setLoading(false);
          setRateds(data.data);
          // console.log(selectedDisciplineId);
          // console.log(selectedStudyGroupId);
          // console.log(data.data);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  if (id) {
    useEffect(() => {
      setLoading(true);
      axiosClient
        .get(`/rateds/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setRated(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }, []);
  }

  const getUsers = () => {
    if (selectedStudyGroupId !== "") {
      setLoading(true);
      axiosClient
        .get(`/users?study_group_id=${selectedStudyGroupId}`)
        .then(({ data }) => {
          setLoading(false);
          setUsers(data.data);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  const getLessons = () => {
    axiosClient
      .get(
        `/lessons?study_group_id=${selectedStudyGroupId}&discipline_id=${selectedDisciplineId}`
      )
      .then(({ data }) => {
        setLessons(data.data);
        console.log(selectedDisciplineId);
        console.log(selectedStudyGroupId);
        console.log(data.lessons);
      })
      .catch(() => {});
  };

  useEffect(() => {
    const usersObj = users.reduce((acc, user) => {
      acc[user.id] = user.name;
      return acc;
    }, {});
    setUsersMap(usersObj);
  }, [users]);

  useEffect(() => {
    const lessonsObj = lessons.reduce((acc, lesson) => {
      const formattedDate = new Intl.DateTimeFormat("ru", {
        month: "numeric",
        day: "numeric",
        // year:"numeric"
      }).format(new Date(lesson.date_of_lesson));

      acc[lesson.id] = formattedDate;
      return acc;
    }, {});
    setLessonsMap(lessonsObj);
  }, [lessons]);

  useEffect(() => {
    const fetchLaboratoryWorks = async () => {
      try {
        const response = await axiosClient.get("/laboratory_works");
        setLaboratoryWorks(response.data);
      } catch (error) {
        console.error("Error fetching laboratory works", error);
      }
    };

    fetchLaboratoryWorks();
  }, []);

  const lessonIds = [...new Set(lessons.map((item) => item.id))];

  // const lessonIds = [...new Set(rateds.map((item) => item.lesson_id))];
  //const userIds = [...new Set(rateds.map((item) => item.user_id))];
  const userIds = [...new Set(users.map((item) => item.id))];
  const uniqueLabIds = [
    ...new Set(rateds.map((item) => item.laboratory_work_id)),
  ];
  console.log(rateds);
  console.log(lessonIds);

  function getOptions(curruntLabId) {
    console.log(`id lab: ${curruntLabId}`);
    console.log(`id lab: ${uniqueLabIds}`);
    // const labOptions = uniqueLabIds.map((labId) => (
    //   <option key={labId} value={labId} selected={labId == curruntLabId}>
    //     {labId}
    //   </option>
    // ));

    // return labOptions;
    const nonEmptyLabIds = uniqueLabIds.filter((labId) => labId !== null);

    const labOptions = nonEmptyLabIds.map((labId) => (
      <option key={labId} value={labId} selected={labId == curruntLabId}>
        {labId}
      </option>
    ));

    return labOptions;
  }

  const onSubmit = async () => {
    const { id, mark, lessonId, userId } = currentMark;

    console.log(id);
    debugger;
    if (id) {
      try {
        await axiosClient.put(`/rateds/${id}`, {
          mark: mark,
        });

        setNotification("Оценка успешно изменена");

        const updatedRateds = rateds.map((item) => {
          if (item.id === id) {
            return { ...item, mark };
          }
          return item;
        });
        setRateds(updatedRateds);
      } catch (error) {
        setNotification("Перепроверьте введенные значения!");
      }
    } else {
      try {
        await axiosClient.post(`/rateds`, {
          mark,
          comment: "",
          lesson_id: lessonId,
          laboratory_work_id: laboratoryWorks,
          user_id: userId,
        });
        getRateds();
        setNotification("Оценка сохранена");
        setLaboratoryWorks(null);
      } catch (error) {
        setNotification("Перепроверьте введенные значения!");
      }
    }
  };

  const [currentMark, setCurrentMark] = useState({});

  const handleAddRated = async () => {
    const { lessonId, userId } = selectedCell;

    try {
      await axiosClient.post(`/rateds`, {
        mark: -1,
        comment: null,
        lesson_id: lessonId,
        laboratory_work_id: null,
        user_id: userId,
      });

      getRateds();
      setNotification("Посещаемость учтена");
    } catch (error) {
      setNotification("Перепроверьте введенные значения!");
    }
  };

  const handleCellClick = (userId, lessonId) => {
    if (lessonId !== 0) {
      setSelectedCell({ userId, lessonId });
      setOpenDropdown({ userId, lessonId });
    }
  };

  const newLesson = async () => {
    const { id, mark, lessonId, userId } = currentMark;
    const currentDate = new Date();
    try {
      const disciplineId = selectedDisciplineId;
      const studygroup = selectedStudyGroupId;
      await axiosClient.post(`/lessons`, {
        comment: "new lesson",
        date_of_lesson: currentDate.toISOString(),
        lesson_type_id: 1,
        discipline_id: disciplineId,
        study_group_id: studygroup,
      });
      setNotification("Добавлено новое занятие");
      getLessons();
    } catch (error) {
      setNotification("error");
    }
  };

  const handleDisciplineChange = (event) => {
    setSelectedDisciplineId(event.target.value);
  };

  return (
    <div>
      <div className="contain">
        <div>
          <select
            onChange={(e) => setSelectedStudyGroupId(e.target.value)}
            value={selectedStudyGroupId}
          >
            <option>Выберите группу</option>
            {academicLoadsGroup.map((load) => (
              <option key={load.id} value={load.study_group_id}>
                {load.title}
              </option>
            ))}
          </select>
          &nbsp; &nbsp;&nbsp; &nbsp;
          <select
            onChange={handleDisciplineChange}
            value={selectedDisciplineId}
          >
            <option>Выберите дисциплину</option>
            {academicLoads.map((load) => (
              <option key={load.id} value={load.discipline_id}>
                {load.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Link className="btn-add" to={`/disciplines/${selectedDisciplineId}`}>
            Редактировать дисциплину
          </Link>
          &nbsp; &nbsp;
          <Link className="btn-add">Создать отчет</Link>
        </div>
      </div>

      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ФИО</th>
              {lessonIds.map((lessonId) => (
                <th key={lessonId}>{lessonsMap[lessonId]}</th>
              ))}
              <th>
                {" "}
                <button className="btn-add" onClick={newLesson}>
                  +
                </button>
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
                    onInput={(e) => {
                      console.log(e.target.innerText);
                      console.log(
                        `ID: ${
                          rateds.find(
                            (item) =>
                              item.user_id === userId &&
                              item.lesson_id === lessonId
                          )?.id || null
                        }`
                      );
                      const id =
                        rateds.find(
                          (item) =>
                            item.user_id === userId &&
                            item.lesson_id === lessonId
                        )?.id || null;
                      console.log(`номер занятия: ${lessonId}`);
                      setCurrentMark({
                        id,
                        lessonId,
                        userId,
                        mark: e.target.innerText,
                      });
                    }}
                    onClick={() => handleCellClick(userId, lessonId)}
                    style={{ position: "relative" }}
                  >
                    {rateds.find(
                      (item) =>
                        item.user_id === userId && item.lesson_id === lessonId
                    )?.mark === -1 ? (
                      <span className="n">H</span>
                    ) : (
                      rateds.find(
                        (item) =>
                          item.user_id === userId && item.lesson_id === lessonId
                      )?.mark || ""
                    )}

                    {lessonId !== 0 &&
                    openDropdown.userId === userId &&
                    openDropdown.lessonId === lessonId ? (
                      <div className="dropdown">
                        <select
                          className="select-mark"
                          disabled={
                            rateds.find(
                              (item) =>
                                item.user_id === userId &&
                                item.lesson_id === lessonId
                            )?.id !== undefined
                          }
                          value={
                            rateds.find(
                              (item) =>
                                item.user_id === userId &&
                                item.lesson_id === lessonId
                            )?.laboratory_work_id
                          }
                          onChange={(e) => {
                            console.log("e:" + e.target.value);

                            setLaboratoryWorks(e.target.value);
                            console.log(e.target.value);
                          }}
                        >
                          <option value="">Выберите работу</option>
                          {getOptions(
                            rateds.find(
                              (item) =>
                                item.user_id === userId &&
                                item.lesson_id === lessonId
                            )?.laboratory_work_id
                          )}
                        </select>
                        &nbsp;&nbsp;
                        <button className="btn-n" onClick={handleAddRated}>
                          H
                        </button>
                        <div>
                          <label>Введите балл: </label>
                          <input
                            className="input-mark"
                            type="text"
                            onChange={(e) => {
                              const id =
                                rateds.find(
                                  (item) =>
                                    item.user_id === userId &&
                                    item.lesson_id === lessonId
                                )?.id || null;
                              const value = e.target.value;
                              console.log(`новая оценка: ${value}`);

                              setCurrentMark({
                                id,
                                lessonId,
                                userId,
                                mark: value,
                              });
                            }}
                          />
                        </div>
                        <button className="btn-add-mark" onClick={onSubmit}>
                          Сохранить
                        </button>
                      </div>
                    ) : (
                      userId[lessonId]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <FontAwesomeIcon icon={faCoffee} />
        <FontAwesomeIcon icon={faCoffee} />
        <FontAwesomeIcon icon={faCoffee} />d
        defw

      </div>
    </div>
  );
}
