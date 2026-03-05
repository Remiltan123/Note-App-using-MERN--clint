import express from "express";
import Note from "../models/Note.js";
import { protect } from "../middleware/auth.js";
import Collaborator from "../models/Collaborator.js";
import User from "../models/User.js";

const router = express.Router();


// Get notes (own + shared as collaborator)
// router.get("/", protect, async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const ownNotes = await Note.find({ createdBy: userId });


//     const collaboratorData = await Collaborator.find({ user: userId }).populate("note");
//     const collaboratorNotes = collaboratorData
//       .map((c) => c.note)
//       .filter((note) => note !== null); 

//     const allNotes = [...ownNotes, ...collaboratorNotes].filter(
//       (value, index, self) =>
//         index === self.findIndex((t) => t._id.toString() === value._id.toString())
//     );

//     res.json(allNotes);
//     console.log(allNotes);
//   } catch (err) {
//     console.error("Get notes error: ", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });


router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const ownNotes = await Note.find({ createdBy: userId });

    const collaboratorData = await Collaborator.find({ user: userId })
      .populate("note");

    const collaboratorNotes = collaboratorData
      .map((c) => {
        if (!c.note) return null;

        return {
          ...c.note.toObject(),
          access: c.access, // send access type
          isOwner: false,
        };
      })
      .filter((note) => note !== null);

    const formattedOwnNotes = ownNotes.map((note) => ({
      ...note.toObject(),
      access: "owner",
      isOwner: true,
    }));

    const allNotes = [...formattedOwnNotes, ...collaboratorNotes];

    res.json(allNotes);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



// Create a note
router.post("/", protect, async (req, res) => {
  const { title, description } = req.body;
  try {
    if (!title || !description) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const note = await Note.create({
      title,
      description,
      createdBy: req.user._id,
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get a note
router.get("/:id", protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update a note
router.put("/:id", protect, async (req, res) => {
  const { title, description } = req.body;
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    // Check if user is owner
    if (note.createdBy.toString() !== req.user._id.toString()) {
      // Check if user is a collaborator with write access
      const collab = await Collaborator.findOne({ note: note._id, user: req.user._id });
      if (!collab || collab.access !== "write") {
        return res.status(401).json({ message: "Not authorized" });
      }
    }

    // Update note
    note.title = title || note.title;
    note.description = description || note.description;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.delete("/:id", protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    // Check if user is owner
    if (note.createdBy.toString() !== req.user._id.toString()) {
      // Check if user is a collaborator with write access
      const collab = await Collaborator.findOne({ note: note._id, user: req.user._id });
      if (!collab || collab.access !== "write") {
        return res.status(401).json({ message: "Not authorized" });
      }
    }

    await note.deleteOne();
    res.json({ message: "Note was deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// add the colobtor 
router.post("/collaborators", protect, async (req, res) => {
  try {
    const { noteId, userEmail, access } = req.body;

    if (!noteId || !userEmail || !access) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check note
    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    // Only owner can add collaborator
    if (note.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Find user using email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Save collaborator using userId
    const collaborator = await Collaborator.create({
      note: noteId,
      user: user._id,
      access: access,
      invitedBy: req.user._id,
    });

    res.status(201).json(collaborator);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get collaborators for a note
router.get("/:noteId", protect, async (req, res) => {
  try {
    const collaborators = await Collaborator.find({ note: req.params.noteId }).populate("user", "name email");
    res.json(collaborators);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove a collaborator
router.delete("/:id", protect, async (req, res) => {
  try {
    const collab = await Collaborator.findById(req.params.id);
    if (!collab) return res.status(404).json({ message: "Collaborator not found" });

    const note = await Note.findById(collab.note);
    if (note.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await collab.deleteOne();
    res.json({ message: "Collaborator removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
