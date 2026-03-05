
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import NoteModal from "./NoteModal";
// import ConfirmModal from "./ConfirmModal";
// import { useLocation } from "react-router-dom";
// import { FaRegEdit } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";
// import CollaboratorModal from "./CollaboratorModal";
// import { IoPersonAdd } from "react-icons/io5";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";



// const Home = () => {
//   const [notes, setNotes] = useState([]);
//   const [filteredNotes, setFilteredNotes] = useState([]);
//   const [error, setError] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editNote, setEditNote] = useState(null);

//   const [noteToDelete, setNoteToDelete] = useState(null);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

//   const [isCollaboratorModalOpen, setIsCollaboratorModalOpen] = useState(false);
//   const [selectedNote, setSelectedNote] = useState(null);

//   const location = useLocation();


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

//       console.log("Fetched notes:", data);

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
//   }, []); // Refetch notes after deletion

//   // Edit note
//   const handleEdit = (note) => {
//     setEditNote(note);
//     setIsModalOpen(true);
//   };

//   // Save note after add/edit
//   const handleSaveNote = (newNote) => {
//     if (editNote) {
//       setNotes(
//         notes.map((note) =>
//           note._id === newNote._id
//             ? { ...newNote, access: note.access, isOwner: note.isOwner }
//             : note
//         )
//       );
//        toast.success("Note updated successfully!");
//     } else {
//       setNotes([...notes, { ...newNote, access: "owner", isOwner: true }]);
//        toast.success("Note added successfully!");
//     }
//     setEditNote(null);
//     setIsModalOpen(false);
//   };

//   // Open delete confirmation modal
//   const handleDeleteClick = (note) => {
//     setNoteToDelete(note);
//     setIsDeleteModalOpen(true);
//   };

//   // Confirm delete
//   const confirmDelete = async () => {
//     try {
//       console.log("Deleting:", noteToDelete);

//       const token = localStorage.getItem("token");

//       const res = await axios.delete(
//         `http://localhost:3000/api/notes/${noteToDelete._id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       console.log(res.data);

//       setNotes(notes.filter((n) => n._id !== noteToDelete._id));
//       setNoteToDelete(null);
//       setIsDeleteModalOpen(false);

//        toast.success("Note deleted successfully!");



//     } catch (err) {
//       console.error(err.response?.data || err.message);
//       console.log("Note deleted successfully");
//       toast.error("Failed to delete note");
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8 min-h-screen">
  
//         <ToastContainer position="top-right" autoClose={3000} />
//         {error && <p className="text-red-400 mb-4">{error}</p>}

//         {/* Note modal for add/edit */}
//         <NoteModal
//           isOpen={isModalOpen}
//           onClose={() => {
//             setIsModalOpen(false);
//             setEditNote(null);
//           }}
//           note={editNote}
//           onSave={handleSaveNote}
//         />

//         {/* Delete confirmation modal */}
//         <ConfirmModal
//           isOpen={isDeleteModalOpen}
//           onClose={() => setIsDeleteModalOpen(false)}
//           onConfirm={confirmDelete}
//           message={`Are you sure you want to delete "${noteToDelete?.title}"?`}
//         />

//         <CollaboratorModal
//           isOpen={isCollaboratorModalOpen}
//           onClose={() => setIsCollaboratorModalOpen(false)}
//           note={selectedNote}
//           onSave={async ({ noteId, userEmail, access }) => {
//             try {
//               const token = localStorage.getItem("token");
//               const res = await axios.post(
//                 "http://localhost:3000/api/notes/collaborators",
//                 { noteId, userEmail, access },
//                 { headers: { Authorization: `Bearer ${token}` } }
//               );
//               console.log("Collaborator added:", res.data);
//               toast.success("Collaborator added successfully!");
//               setIsCollaboratorModalOpen(false);
//             } catch (err) {
//               console.error(err.response?.data || err.message);
//               toast.error("Failed to add collaborator");
//             }
//           }}
//         />

//         {/* Add new note button */}
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="fixed bottom-6 right-6 w-14 h-14 bg-gray-800 text-white text-3xl rounded-full shadow-lg hover:bg-gray-900 flex items-center justify-center"
//         >
//           <span className="flex items-center justify-center h-full w-full pb-1">+</span>
//         </button>

//         {/* Notes list */}
//         {filteredNotes.length === 0 ? (
//           <p className="text-center text-gray-200 text-lg mt-10">
//             No notes found for your search.
//           </p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {filteredNotes.map((note) => (
//               <div className="bg-gray-800 p-4 rounded-lg shadow-md" key={note._id}>
//                 <h3 className="text-lg font-medium text-white mb-2">{note.title}</h3>
//                 <p className="text-gray-300 mb-4">{note.description}</p>
//                 <p className="text-sm text-gray-400 mb-4">
//                   {new Date(note.updatedAt).toLocaleString()}
//                 </p>
//                 <div className="flex justify-end space-x-2 mt-4">
//                   <button
//                     onClick={() => handleEdit(note)}
//                     disabled={note.access === "read"}
//                     className={`px-3 py-1 rounded-md text-white 
//   ${note.access === "read"
//                         ? "bg-gray-500 cursor-not-allowed"
//                         : "bg-yellow-600 hover:bg-yellow-700"
//                       }`}
//                   >
//                     <FaRegEdit />
//                   </button>

//                   <button
//                     onClick={() => handleDeleteClick(note)}
//                     disabled={note.access === "read"}
//                     className={`px-3 py-1 rounded-md text-white
//   ${note.access === "read"
//                         ? "bg-gray-500 cursor-not-allowed"
//                         : "bg-red-600 hover:bg-red-700"
//                       }`}
//                   >
//                     <MdDelete />
//                   </button>

//                   {note.isOwner && (
//                     <button
//                       onClick={() => {
//                         setSelectedNote(note);
//                         setIsCollaboratorModalOpen(true);
//                       }}
//                       className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
//                     >
//                       <IoPersonAdd />
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       );
// };

//       export default Home;


import React, { useEffect, useState } from "react";
import axios from "axios";
import NoteModal from "./NoteModal";
import ConfirmModal from "./ConfirmModal";
import CollaboratorModal from "./CollaboratorModal"; 
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoPersonAdd } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCollaboratorModalOpen, setIsCollaboratorModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  // For each note, maintain its own search query
  const [noteSearch, setNoteSearch] = useState({});

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in");
        toast.error("No authentication token found. Please log in");
        return;
      }

      const { data } = await axios.get("http://localhost:3000/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const notesArray = Array.isArray(data) ? data : data.notes || [];
      setNotes(notesArray);
    } catch (err) {
      setError("Failed to fetch notes");
      toast.error("Failed to fetch notes");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Highlight function
  const highlightText = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-400 text-black">{part}</mark>
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
      setNotes(notes.map((note) =>
        note._id === newNote._id
          ? { ...newNote, access: note.access, isOwner: note.isOwner }
          : note
      ));
      toast.success("Note updated successfully");
    } else {
      setNotes([...notes, { ...newNote, access: "owner", isOwner: true }]);
      toast.success("Note added successfully");
    }
    setEditNote(null);
    setIsModalOpen(false);
  };

  // Delete note
  const handleDeleteClick = (note) => {
    setNoteToDelete(note);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/notes/${noteToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((n) => n._id !== noteToDelete._id));
      setNoteToDelete(null);
      setIsDeleteModalOpen(false);
      toast.success("Note deleted successfully");
    } catch (err) {
      toast.error("Failed to delete note");
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
      toast.success("Collaborator added successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add collaborator");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Notes list */}
      {notes.length === 0 ? (
        <p className="text-center text-gray-200 text-lg mt-10">No notes found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => {
            const query = noteSearch[note._id] || "";
            const titleMatches = note.title.toLowerCase().includes(query.toLowerCase());
            const descMatches = note.description.toLowerCase().includes(query.toLowerCase());

            if (query && !titleMatches && !descMatches) return null; // hide if no match

            return (
              <div className="bg-gray-800 p-4 rounded-lg shadow-md" key={note._id}>
                {/* Per-note search input */}
                <input
                  type="text"
                  placeholder="Search inside this note..."
                  value={noteSearch[note._id] || ""}
                  onChange={(e) =>
                    setNoteSearch({ ...noteSearch, [note._id]: e.target.value })
                  }
                  className="mb-2 w-full p-2 rounded-md text-white"
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

                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => handleEdit(note)}
                    disabled={note.access === "read"}
                    className={`px-3 py-1 rounded-md text-white 
                    ${note.access === "read" ? "bg-gray-500 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700"}`}
                  >
                    <FaRegEdit />
                  </button>

                  <button
                    onClick={() => handleDeleteClick(note)}
                    disabled={note.access === "read"}
                    className={`px-3 py-1 rounded-md text-white 
                    ${note.access === "read" ? "bg-gray-500 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
                  >
                    <MdDelete />
                  </button>

                  {note.isOwner && (
                    <button
                      onClick={() => { setSelectedNote(note); setIsCollaboratorModalOpen(true); }}
                      className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
                    >
                      <IoPersonAdd />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditNote(null); }}
        note={editNote}
        onSave={handleSaveNote}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete "${noteToDelete?.title}"?`}
      />

      <CollaboratorModal
        isOpen={isCollaboratorModalOpen}
        onClose={() => setIsCollaboratorModalOpen(false)}
        note={selectedNote}
        onSave={handleAddCollaborator}
      />

      {/* Add note button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gray-800 text-white text-3xl rounded-full shadow-lg hover:bg-gray-900 flex items-center justify-center"
      >
        <span className="flex items-center justify-center h-full w-full pb-1">+</span>
      </button>
    </div>
  );
};

export default Home;