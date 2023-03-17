import { useState, useEffect, useRef } from 'react';
import Note from './components/Note';
import Notification from './components/Notification';
import Footer from './components/Footer';
import LoginForm from './components/LoginForm';
import NoteForm from './components/NoteForm';
import Togglable from './components/Toggable';
import noteService from './services/notes';
import loginService from './services/login';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const [user, setUser] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  const noteFormRef = useRef();

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedNoteappuser');
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedNoteappuser', JSON.stringify(user));
      noteService.setToken(user.token);
      setUser(user);
    } catch (exception) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogoutOnClick = () => {
    window.localStorage.removeItem('loggedNoteappuser');
    setUser(null);
  };

  const addNote = async (noteObject) => {
    noteFormRef.current.toggleVisibility();
    const returnedNote = await noteService.create(noteObject);
    setNotes(notes.concat(returnedNote));
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
      })
      .catch((_error) => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  const handleLoginOnClick = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div>
      <h1>Notes app</h1>
      <Notification message={errorMessage} />

      <button onClick={handleLoginOnClick}>login</button>
      {showLogin && <LoginForm handleSubmit={handleLoginSubmit} />}
      {user && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p>{user.name} logged in</p>
            <button onClick={handleLogoutOnClick}>logout</button>
          </div>
          <Togglable buttonLabel="new note" ref={noteFormRef}>
            <NoteForm createNote={addNote} />
          </Togglable>
        </div>
      )}

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        <ul>
          {notesToShow.map((note) => (
            <Note
              key={note.id}
              note={note}
              toggleImportance={() => toggleImportanceOf(note.id)}
            />
          ))}
        </ul>
      </ul>
      <Footer />
    </div>
  );
};

export default App;
