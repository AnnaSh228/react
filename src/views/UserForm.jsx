import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";




export default function UserForm() {
  const { id } = useParams();
  const [disciplines, setDisciplines] = useState({});
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [laboratoryWorks, setLaboratoryWorks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [disciplineResponse, worksResponse] = await Promise.all([
          axiosClient.get(`/disciplines/${id}`),
          axiosClient.get(`/laboratory_works?discipline_id=${id}`)
        ]);
        setDisciplines(disciplineResponse.data);
        setLaboratoryWorks(worksResponse.data);
      } catch (error) {
        setErrors(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const formatDate = (deadline) => {
    const formattedDate = new Date(deadline).toLocaleDateString('ru', {
      month: "numeric",
      day: "numeric",
    });
    return formattedDate;
  };

  const handleContentEditable = (index, field, value) => {
      const updatedWorks = [...laboratoryWorks];
      updatedWorks[index][field] = value;
      setLaboratoryWorks(updatedWorks);
    };

  const saveChanges = async (workId) => {
    setLoading(true);
    try {
      const updatedWorkIndex = laboratoryWorks.findIndex((work) => work.id === workId);
      const updatedWork = laboratoryWorks[updatedWorkIndex];

      await axiosClient.put(`/laboratory_works/${workId}`, updatedWork);
      
      setNotification('Изменения успешно сохранены');
      const updatedWorks = [...laboratoryWorks];
      updatedWorks[updatedWorkIndex] = updatedWork;
      setLaboratoryWorks(updatedWorks);
    } catch (error) {
      setErrors(error);
    } finally {
      setLoading(false);
    }
  };
return (
  <div>
    {loading ? (
      <p>Loading...</p>
    ) : errors ? (
      <p>Error: {errors.message}</p>
    ) : laboratoryWorks && laboratoryWorks.length > 0 ? (
      <>
        <table style={{ borderCollapse: 'collapse', width: '800px' }}>
        <thead>
         <tr>
           <th style={{ textAlign: 'center', width: '3px' }}>№</th>
           <th style={{ textAlign: 'center' }}>Название работы</th>
           <th style={{ textAlign: 'center'}}>Срок сдачи</th>
           <th style={{ textAlign: 'center', width: '3px' }}>Максимум баллов</th>
         </tr>
       </thead>
       <tbody>
  {laboratoryWorks.map((work, index) => (
    <tr key={work.id}>
      <td style={{ backgroundColor: '#bad5ff26', textAlign: 'center', width: '3px' }}>{work.id}</td>
      <td
        style={{ width: '600px' }}
        contentEditable
        onBlur={(e) => handleContentEditable(index, 'title', e.target.innerText)}
        suppressContentEditableWarning={true}
      >
        {work.title}
      </td>
      <td
        style={{ width: '100px' }}
        contentEditable
        onBlur={(e) => handleContentEditable(index, 'deadline', e.target.innerText)}
        suppressContentEditableWarning={true}
      >
        {formatDate(work.deadline)}
      </td>
      <td
        style={{ width: '50px' }}
        contentEditable
        onBlur={(e) => handleContentEditable(index, 'maximum_score', e.target.innerText)}
        suppressContentEditableWarning={true}
      >
        {work.maximum_score}
      </td>
      <td>
        <button onClick={() => saveChanges(work.id)}>Save</button>
      </td>
    </tr>
  ))}
</tbody>
        </table>
        {/* <button onClick={saveChanges}>Save Changes</button> */}
      </>
    ) : (
      <p>No laboratory works found for this discipline ID.</p>
    )}
  </div>
);
}