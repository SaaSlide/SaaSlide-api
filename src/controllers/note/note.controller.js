const mongoose = require("mongoose")
const Note = mongoose.model("note")
const InfoDiapo = mongoose.model("infodiapo")

const createNote = async (req, res) => {
  const { description } = req.body
  const { pageId } = req.params

  const newNote = new Note({
    description,
  })

  try {
    await newNote.save()
    const data = await InfoDiapo.findByIdAndUpdate(pageId, { $push: { notes: newNote.id } }, { new: true }).populate([
      {
        path: "notes",
        model: "note",
        select: "_id description",
      },
    ])
    return res.status(200).json(data.notes.slice(-1).pop())
  } catch (e) {
    return res.status(500).json(e)
  }
}

const getNote = async (req, res) => {
  const { pageId } = req.params
  try {
    const data = await InfoDiapo.findById(pageId)
      .select("notes")
      .populate([
        {
          path: "notes",
          model: "note",
          select: "_id description",
        },
      ])

    return res.status(200).json(data)
  } catch (e) {
    return res.status(500).json(e)
  }
}

const updateNote = async (req, res) => {
  const { noteId } = req.params

  let { description } = req.body
  const updates = {}

  if (description?.length) {
    updates.description = description
  }

  try {
    await Note.findByIdAndUpdate(noteId, updates)
    const newNotes = {
      _id: noteId,
      description: updates.description,
    }
    return res.status(200).json(newNotes)
  } catch (e) {
    return res.status(500).json(e)
  }
}

const deleteNote = async (req, res) => {
  const { noteId } = req.params

  try {
    await Note.remove({ _id: noteId })
    return res.status(200).json({ message: "delete note" })
  } catch (e) {
    return res.status(500).json(e)
  }
}

module.exports = { createNote, getNote, updateNote, deleteNote }
