

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import NoteModal from "./NoteModal";
// import ConfirmModal from "./ConfirmModal";
// import CollaboratorModal from "./CollaboratorModal";
// import { FaRegEdit } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";
// import { IoPersonAdd } from "react-icons/io5";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useLocation } from "react-router-dom";

// const Home = () => {
//   const [notes, setNotes] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editNote, setEditNote] = useState(null);
//   const [noteToDelete, setNoteToDelete] = useState(null);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [isCollaboratorModalOpen, setIsCollaboratorModalOpen] = useState(false);
//   const [selectedNote, setSelectedNote] = useState(null);

//   const [noteSearch, setNoteSearch] = useState({});

//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const searchQuery = params.get("search")?.toLowerCase() || "";

//   // Fetch notes
//   const fetchNotes = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const { data } = await axios.get("http://localhost:3000/api/notes", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const notesArray = Array.isArray(data) ? data : data.notes || [];
//       setNotes(notesArray);
//     } catch (err) {
//       toast.error("Failed to fetch notes");
//     }
//   };

//   useEffect(() => {
//     fetchNotes();
//   }, []);

//   // Highlight search text
//   const highlightText = (text, query) => {
//     if (!query) return text;

//     const parts = text.split(new RegExp(`(${query})`, "gi"));

//     return parts.map((part, index) =>
//       part.toLowerCase() === query.toLowerCase() ? (
//         <mark key={index} className="bg-yellow-400 text-black">
//           {part}
//         </mark>
//       ) : (
//         part
//       )
//     );
//   };

//   // Edit
//   const handleEdit = (note) => {
//     setEditNote(note);
//     setIsModalOpen(true);
//   };

//   // Save
//   const handleSaveNote = (newNote) => {
//     if (editNote) {
//       setNotes(
//         notes.map((note) =>
//           note._id === newNote._id
//             ? { ...newNote, access: note.access, isOwner: note.isOwner }
//             : note
//         )
//       );
//       toast.success("Note updated");
//     } else {
//       setNotes([...notes, { ...newNote, access: "owner", isOwner: true }]);
//       toast.success("Note added");
//     }

//     setEditNote(null);
//     setIsModalOpen(false);
//   };

//   // Delete
//   const handleDeleteClick = (note) => {
//     setNoteToDelete(note);
//     setIsDeleteModalOpen(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       await axios.delete(
//         `http://localhost:3000/api/notes/${noteToDelete._id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setNotes(notes.filter((n) => n._id !== noteToDelete._id));
//       setIsDeleteModalOpen(false);
//       toast.success("Note deleted");
//     } catch {
//       toast.error("Delete failed");
//     }
//   };

//   // Add collaborator
//   const handleAddCollaborator = async ({ noteId, userEmail, access }) => {
//     try {
//       const token = localStorage.getItem("token");

//       await axios.post(
//         "http://localhost:3000/api/notes/collaborators",
//         { noteId, userEmail, access },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setIsCollaboratorModalOpen(false);
//       toast.success("Collaborator added");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Error");
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8 min-h-screen">
//       <ToastContainer position="top-right" autoClose={3000} />

//       {notes.length === 0 ? (
//         <p className="text-center text-gray-200 text-lg mt-10">
//           No notes found
//         </p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {notes
//             .filter((note) =>
//               note.title.toLowerCase().includes(searchQuery)
//             )
//             .map((note) => {
//               const query = noteSearch[note._id] || "";

//               return (
//                 <div
//                   key={note._id}
//                   className="bg-gray-800 p-4 rounded-lg shadow-md"
//                 >
//                   {/* search inside note */}
//                   <input
//                     type="text"
//                     placeholder="Search inside note..."
//                     value={noteSearch[note._id] || ""}
//                     onChange={(e) =>
//                       setNoteSearch({
//                         ...noteSearch,
//                         [note._id]: e.target.value,
//                       })
//                     }
//                     className="mb-2 w-full p-2 rounded-md bg-gray-700 text-white"
//                   />

//                   <h3 className="text-lg font-medium text-white mb-2">
//                     {highlightText(note.title, query)}
//                   </h3>

//                   <p className="text-gray-300 mb-4">
//                     {highlightText(note.description, query)}
//                   </p>

//                   <p className="text-sm text-gray-400 mb-4">
//                     {new Date(note.updatedAt).toLocaleString()}
//                   </p>

//                   <div className="flex justify-end space-x-2">
//                     <button
//                       onClick={() => handleEdit(note)}
//                       disabled={note.access === "read"}
//                       className={`px-3 py-1 rounded-md text-white ${
//                         note.access === "read"
//                           ? "bg-gray-500"
//                           : "bg-yellow-600 hover:bg-yellow-700"
//                       }`}
//                     >
//                       <FaRegEdit />
//                     </button>

//                     <button
//                       onClick={() => handleDeleteClick(note)}
//                       disabled={note.access === "read"}
//                       className={`px-3 py-1 rounded-md text-white ${
//                         note.access === "read"
//                           ? "bg-gray-500"
//                           : "bg-red-600 hover:bg-red-700"
//                       }`}
//                     >
//                       <MdDelete />
//                     </button>

//                     {note.isOwner && (
//                       <button
//                         onClick={() => {
//                           setSelectedNote(note);
//                           setIsCollaboratorModalOpen(true);
//                         }}
//                         className="bg-green-600 px-3 py-1 rounded-md hover:bg-green-700"
//                       >
//                         <IoPersonAdd />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//         </div>
//       )}

//       {/* modals */}

//       <NoteModal
//         isOpen={isModalOpen}
//         onClose={() => {
//           setIsModalOpen(false);
//           setEditNote(null);
//         }}
//         note={editNote}
//         onSave={handleSaveNote}
//       />

//       <ConfirmModal
//         isOpen={isDeleteModalOpen}
//         onClose={() => setIsDeleteModalOpen(false)}
//         onConfirm={confirmDelete}
//         message={`Delete "${noteToDelete?.title}" ?`}
//       />

//       <CollaboratorModal
//         isOpen={isCollaboratorModalOpen}
//         onClose={() => setIsCollaboratorModalOpen(false)}
//         note={selectedNote}
//         onSave={handleAddCollaborator}
//       />

//       {/* add note button */}

//       <button
//         onClick={() => setIsModalOpen(true)}
//         className="fixed bottom-6 right-6 w-14 h-14 bg-gray-800 text-white text-3xl rounded-full shadow-lg hover:bg-gray-900 flex items-center justify-center"
//       >
//         +
//       </button>
//     </div>
//   );
// };

// export default Home;


import React, { useEffect, useState } from "react";
import axios from "axios";
import NoteModal from "./NoteModal";
import ConfirmModal from "./ConfirmModal";
import CollaboratorModal from "./CollaboratorModal";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoPersonAdd } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";

const Home = () => {

  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCollaboratorModalOpen, setIsCollaboratorModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const [noteSearch, setNoteSearch] = useState({});

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const navbarSearch = params.get("search")?.toLowerCase() || "";

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get("http://localhost:3000/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const notesArray = Array.isArray(data) ? data : data.notes || [];
      setNotes(notesArray);

    } catch (err) {
      toast.error("Failed to fetch notes");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Highlight text
  const highlightText = (text, query) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));

    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-400 text-black">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Edit note
  const handleEdit = (note) => {
    setEditNote(note);
    setIsModalOpen(true);
  };

  // Save note
  const handleSaveNote = (newNote) => {

    if (editNote) {
      setNotes(
        notes.map((note) =>
          note._id === newNote._id
            ? { ...newNote, access: note.access, isOwner: note.isOwner }
            : note
        )
      );

      toast.success("Note updated");

    } else {

      setNotes((prev) => [...prev, { ...newNote, access: "owner", isOwner: true }]);

      toast.success("Note added");
    }

    setEditNote(null);
    setIsModalOpen(false);
  };

  // Delete
  const handleDeleteClick = (note) => {
    setNoteToDelete(note);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {

      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:3000/api/notes/${noteToDelete._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotes((prev) => prev.filter((n) => n._id !== noteToDelete._id));

      setIsDeleteModalOpen(false);

      toast.success("Note deleted");

    } catch {

      toast.error("Delete failed");
    }
  };

  // Add collaborator
  const handleAddCollaborator = async ({ noteId, userEmail, access }) => {

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:3000/api/notes/collaborators",
        { noteId, userEmail, access },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsCollaboratorModalOpen(false);

      toast.success("Collaborator added");

    } catch (err) {

      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (

    <div className="container mx-auto px-4 py-8 min-h-screen">

      <ToastContainer position="top-right" autoClose={3000} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {notes
          .filter((note) =>
            note.title.toLowerCase().includes(navbarSearch)
          )
          .map((note) => {

            const query = noteSearch[note._id] || "";

            return (

              <div
                key={note._id}
                className="bg-gray-800 p-4 rounded-lg shadow-md"
              >

                {/* Search inside note */}
                <input
                  type="text"
                  placeholder="Search inside note..."
                  value={noteSearch[note._id] || ""}
                  onChange={(e) =>
                    setNoteSearch({
                      ...noteSearch,
                      [note._id]: e.target.value,
                    })
                  }
                  className="mb-2 w-full p-2 rounded-md bg-gray-700 text-white"
                />

                <h3 className="text-lg font-medium text-white mb-2">
                  {highlightText(note.title, query)}
                </h3>

                <p className="text-gray-300 mb-4">
                  {highlightText(note.description, query)}
                </p>

                <p className="text-sm text-gray-400 mb-4">
                  {new Date(note.updatedAt).toLocaleString()}
                </p>

                <div className="flex justify-end space-x-2">

                  <button
                    onClick={() => handleEdit(note)}
                    disabled={note.access === "read"}
                    className={`px-3 py-1 rounded-md text-white ${
                      note.access === "read"
                        ? "bg-gray-500"
                        : "bg-yellow-600 hover:bg-yellow-700"
                    }`}
                  >
                    <FaRegEdit />
                  </button>

                  <button
                    onClick={() => handleDeleteClick(note)}
                    disabled={note.access === "read"}
                    className={`px-3 py-1 rounded-md text-white ${
                      note.access === "read"
                        ? "bg-gray-500"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    <MdDelete />
                  </button>

                  {note.isOwner && (
                    <button
                      onClick={() => {
                        setSelectedNote(note);
                        setIsCollaboratorModalOpen(true);
                      }}
                      className="bg-green-600 px-3 py-1 rounded-md hover:bg-green-700"
                    >
                      <IoPersonAdd />
                    </button>
                  )}

                </div>
              </div>
            );
          })}
      </div>

      {/* Modals */}

      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditNote(null);
        }}
        note={editNote}
        onSave={handleSaveNote}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        message={`Delete "${noteToDelete?.title}" ?`}
      />

      <CollaboratorModal
        isOpen={isCollaboratorModalOpen}
        onClose={() => setIsCollaboratorModalOpen(false)}
        note={selectedNote}
        onSave={handleAddCollaborator}
      />

      {/* Add note */}

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gray-800 text-white text-3xl rounded-full shadow-lg hover:bg-gray-900 flex items-center justify-center"
      >
        +
      </button>

    </div>
  );
};

export default Home;