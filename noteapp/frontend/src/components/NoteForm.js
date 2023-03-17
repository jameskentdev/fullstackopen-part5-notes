import { useState } from 'react';

const NoteForm = ({ createNote }) => {
  const [note, setNote] = useState('');

  const handleChange = (event) => {
    setNote(event.target.value);
  };

  const addNote = (event) => {
    event.preventDefault();
    createNote({
      content: note,
      important: Math.random() > 0.5,
    });
    setNote('');
  };

  return (
    <div>
      <h2>Create a new note</h2>
      <form onSubmit={addNote}>
        <input name="note" id="note" value={note} onChange={handleChange} />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default NoteForm;
