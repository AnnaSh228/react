import React, { useState } from "react";
import Modal from "react-modal";


const App = () => {
  const [columns, setColumns] = useState(["studentList"]);
  const [rows, setRows] = useState([
    { studentList: "Шелест Анна Сергеевна" },
    { studentList: "Преловский Тимофей Игоревич" },
    { studentList: "Чернов Артём Дмитриевич" },
    { studentList: "Шелест Анна Сергеевна" },
    { studentList: "Преловский Тимофей Игоревич" },
    { studentList: "Чернов Артём Дмитриевич" },
    { studentList: "Шелест Анна Сергеевна" },
    { studentList: "Преловский Тимофей Игоревич" },
  ]);
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [selectedCell, setSelectedCell] = useState({
    rowIndex: null,
    columnIndex: null,
  });
  const [newColumnName, setNewColumnName] = useState("");
  const [openDropdown, setOpenDropdown] = useState({
    rowIndex: null,
    columnIndex: null,
  });
  const [showAddCellModal, setShowAddCellModal] = useState(false);

  const options = { day: "2-digit", month: "2-digit" };
  const dateFormat = new Intl.DateTimeFormat("en-GB", options);

  const handleAddColumn = () => {
    setShowAddColumnModal(true);
  };

  const handleCancelAddColumn = () => {
    setShowAddColumnModal(false);
    setNewColumnName("");
  };

  const handleSaveNewColumn = () => {
    if (newColumnName !== "") {
      const formattedDate = dateFormat.format(new Date(newColumnName));
      setColumns([...columns, formattedDate]);
      setRows((prevRows) =>
        prevRows.map((row) => ({ ...row, [formattedDate]: "" }))
      );
      setShowAddColumnModal(false);
      setNewColumnName("");
    }
  };

  const handleCellClick = (rowIndex, columnIndex) => {
    if (columnIndex !== 0) {
      setSelectedCell({ rowIndex, columnIndex });
      setOpenDropdown({ rowIndex, columnIndex });
    }
  };

  const handleSelectChange = (event) => {
    const newValue = event.target.value;
    const { rowIndex, columnIndex } = selectedCell;
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[rowIndex][columns[columnIndex]] = newValue;
      return newRows;
    });
    setOpenDropdown({ rowIndex: null, columnIndex: null });
  };

  return (
    <div className="table-wrapper">
      <Header />
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
            <th>
              <button onClick={handleAddColumn} className="plus">
                +
              </button>
              <Modal
                isOpen={showAddColumnModal}
                onRequestClose={handleCancelAddColumn}
                className="modal"
              >
                <h2>Добавить занятие</h2>
                <input
                  type="date"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                />
                <button onClick={handleSaveNewColumn}>Save</button>
                <button onClick={handleCancelAddColumn}>Cancel</button>
              </Modal>
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, columnIndex) => (
                <td
                  key={columnIndex}
                  onClick={() => handleCellClick(rowIndex, columnIndex)}
                  contentEditable="true"
                  style={{ position: "relative" }}
                >
                  {columnIndex !== 0 &&
                  openDropdown.rowIndex === rowIndex &&
                  openDropdown.columnIndex === columnIndex ? (
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

                    </div>
                  ) : (
                    row[column]
                  )}
                </td>

              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
