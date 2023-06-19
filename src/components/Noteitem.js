import React, { useContext } from 'react';
import NoteContext from '../context/notes/noteContext';
const Noteitem = (props) => {
  const context = useContext(NoteContext);
  const { deleteNote } = context;
  const { note, updateNote } = props;
  const handleDeleteNote = () => {
    deleteNote(note._id);
    props.showAlert('Deleted successfully', 'success');
  };
  return (
    <div className="col-6 col-md-4 col-lg-3 col-xl-3">
      <div className="card my-3">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">{note.title}</h5>
            <div>
              <i className="fa-regular fa-trash-can mx-2" onClick={handleDeleteNote}></i>
              <i className="fa-regular fa-pen-to-square mx-2" onClick={() => updateNote(note)}></i>
            </div>
          </div>
          <p className="card-text">{note.description}</p>
        </div>
      </div>
    </div>
  );
};
export default Noteitem;
