
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import NoteModal from "./NoteModal";
// import { useLocation } from "react-router-dom";
// import { FaRegEdit } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";

// const Home = () => {
//   const [notes, setNotes] = useState([]);
//   const [filteredNotes, setFilteredNotes] = useState([]);
//   const [error, setError] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editNote, setEditNote] = useState(null);
//   const location = useLocation();

//   // Fetch notes from backend
//   const fetchNotes = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("No authentication token found. Please log in");
//         return;
//       }

//       const { data } = await axios.get("http://localhost:3000/api/notes", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const notesArray = Array.isArray(data) ? data : data.notes || [];
//       setNotes(notesArray);
//     } catch (err) {
//       setError("Failed to fetch notes");
//       setNotes([]);
//     }
//   };

//   // Filter notes based on search query in URL
//   useEffect(() => {
//     const searchQuery = new URLSearchParams(location.search).get("search") || "";
//     const filtered = notes.filter(
//       (note) =>
//         note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         note.description.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//     setFilteredNotes(filtered);
//   }, [notes, location.search]);

//   useEffect(() => {
//     fetchNotes();
//   }, []);

//   const handleEdit = (note) => {
//     setEditNote(note);
//     setIsModalOpen(true);
//   };

//   const handleDeleteClick = (note) => {
//   setNoteToDelete(note);
//   setIsDeleteModalOpen(true);
// };


//   const handleSaveNote = (newNote) => {
//     if (editNote) {
//       setNotes(notes.map((note) => (note._id === newNote._id ? newNote : note)));
//     } else {
//       setNotes([...notes, newNote]);
//     }
//     setEditNote(null);
//     setIsModalOpen(false);
//   };

//   const handleDelete = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("No authentication token found. Please log in");
//         return;
//       }
//       await axios.delete(`http://localhost:3000/api/notes/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setNotes(notes.filter((note) => note._id !== id));
//     } catch (err) {
//       setError("Failed to delete note");
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8 min-h-screen">
//       {error && <p className="text-red-400 mb-4">{error}</p>}
//       <NoteModal
//         isOpen={isModalOpen}
//         onClose={() => {
//           setIsModalOpen(false);
//           setEditNote(null);
//         }}
//         note={editNote}
//         onSave={handleSaveNote}
//       />
//       <button
//         onClick={() => setIsModalOpen(true)}
//         className="fixed bottom-6 right-6 w-14 h-14 bg-gray-800 text-white text-3xl rounded-full shadow-lg hover:bg-gray-900 flex items-center justify-center"
//       >
//         <span className="flex items-center justify-center h-full w-full pb-1">+</span>
//       </button>

//       {filteredNotes.length === 0 ? (
//         <p className="text-center text-gray-200 text-lg mt-10">
//           No notes found for your search.
//         </p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {filteredNotes.map((note) => (
//             <div className="bg-gray-800 p-4 rounded-lg shadow-md" key={note._id}>
//               <h3 className="text-lg font-medium text-white mb-2">{note.title}</h3>
//               <p className="text-gray-300 mb-4">{note.description}</p>
//               <p className="text-sm text-gray-400 mb-4">
//                 {new Date(note.updatedAt).toLocaleString()}
//               </p>
//               <div className="flex justify-end space-x-2 mt-4">
//                 <button
//                   onClick={() => handleEdit(note)}
//                   className="bg-yellow-600 text-white px-3 py-1 rounded-md hover:bg-yellow-700"
//                 >
//                   <FaRegEdit />

//                 </button>
//                 <button
//                   onClick={() => handleDeleteClick(note)}
//                   className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
//                 >
//                   <MdDelete />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;

import React, { useEffect, useState } from "react";
import axios from "axios";
import NoteModal from "./NoteModal";
import ConfirmModal from "./ConfirmModal"; // Make sure this component exists
import { useLocation } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);

  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const location = useLocation();


  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in");
        return;
      }

      const { data } = await axios.get("http://localhost:3000/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched notes:", data);

      const notesArray = Array.isArray(data) ? data : data.notes || [];
      setNotes(notesArray);
    } catch (err) {
      setError("Failed to fetch notes");
      setNotes([]);
    }
  };

  // Filter notes based on search query in URL
  useEffect(() => {
    const searchQuery = new URLSearchParams(location.search).get("search") || "";
    const filtered = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNotes(filtered);
  }, [notes, location.search]);

  useEffect(() => {
    fetchNotes();
  }, []); // Refetch notes after deletion

  // Edit note
  const handleEdit = (note) => {
    setEditNote(note);
    setIsModalOpen(true);
  };

  // Save note after add/edit
  const handleSaveNote = (newNote) => {
    if (editNote) {
      setNotes(notes.map((note) => (note._id === newNote._id ? newNote : note)));
    } else {
      setNotes([...notes, newNote]);
    }
    setEditNote(null);
    setIsModalOpen(false);
  };

  // Open delete confirmation modal
  const handleDeleteClick = (note) => {
    setNoteToDelete(note);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      console.log("Deleting:", noteToDelete);

      const token = localStorage.getItem("token");

      const res = await axios.delete(
        `http://localhost:3000/api/notes/${noteToDelete._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(res.data);

      setNotes(notes.filter((n) => n._id !== noteToDelete._id));
      setNoteToDelete(null);
      setIsDeleteModalOpen(false);



    } catch (err) {
      console.error(err.response?.data || err.message);
      console.log("Note deleted successfully");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {error && <p className="text-red-400 mb-4">{error}</p>}

      {/* Note modal for add/edit */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditNote(null);
        }}
        note={editNote}
        onSave={handleSaveNote}
      />

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete "${noteToDelete?.title}"?`}
      />

      {/* Add new note button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gray-800 text-white text-3xl rounded-full shadow-lg hover:bg-gray-900 flex items-center justify-center"
      >
        <span className="flex items-center justify-center h-full w-full pb-1">+</span>
      </button>

      {/* Notes list */}
      {filteredNotes.length === 0 ? (
        <p className="text-center text-gray-200 text-lg mt-10">
          No notes found for your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <div className="bg-gray-800 p-4 rounded-lg shadow-md" key={note._id}>
              <h3 className="text-lg font-medium text-white mb-2">{note.title}</h3>
              <p className="text-gray-300 mb-4">{note.description}</p>
              <p className="text-sm text-gray-400 mb-4">
                {new Date(note.updatedAt).toLocaleString()}
              </p>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => handleEdit(note)}
                  disabled={note.access === "read"}
                  className={`px-3 py-1 rounded-md text-white 
  ${note.access === "read"
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-yellow-600 hover:bg-yellow-700"
                    }`}
                >
                  <FaRegEdit />
                </button>

                <button
                  onClick={() => handleDeleteClick(note)}
                  disabled={note.access === "read"}
                  className={`px-3 py-1 rounded-md text-white
  ${note.access === "read"
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                    }`}
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;