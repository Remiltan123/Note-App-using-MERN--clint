import React, { useState } from "react";

const CollaboratorModal = ({ isOpen, onClose, onSave, note }) => {
    const [email, setEmail] = useState("");
    const [access, setAccess] = useState("read");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !access) {
            setError("All fields are required");
            return;
        }

        await onSave({ noteId: note._id, userEmail: email, access });
        setEmail("");
        setAccess("read");
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-center">
                <h2 className="text-white font-bold mb-4">Add Collaborator</h2>
                {error && <p className="text-red-400 mb-2">{error}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="User Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="px-3 py-2 rounded-md bg-white text-gray-900"
                    />

                    <select
                        value={access}
                        onChange={(e) => setAccess(e.target.value)}
                        className="px-3 py-2 rounded-md bg-white text-gray-900"
                    >
                        <option value="read">Read</option>
                        <option value="write">Write</option>
                    </select>
                    <div className="flex justify-center gap-4">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Add
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CollaboratorModal;