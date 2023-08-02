import React from "react"
import { useState } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { addDoc, onSnapshot, doc, deleteDoc, setDoc } from "firebase/firestore"
import { notesCollection, db } from "./firebase"

function App() {
  const [notes, setNotes] = useState([])
  const [currentNoteId, setCurrentNoteId] = useState("")
  const [tempNoteText, setTempNoteText] = useState("")

  /**
     * Challenge:
     * 1. Change the Editor so that it uses `tempNoteText` and 
     *    `setTempNoteText` for displaying and changing the text instead
     *    of dealing directly with the `currentNote` data.
     * 2. Create a useEffect that, if there's a `currentNote`, sets
     *    the `tempNoteText` to `currentNote.body`. (This copies the
     *    current note's text into the `tempNoteText` field so whenever 
     *    the user changes the currentNote, the editor can display the 
     *    correct text.
     */

  const currentNote = notes.find(note => note.id === currentNoteId) || notes[0] // find the note with the currentNoteId or the first note in the array

  const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt) // sort notes by updatedAt
  
  React.useEffect(() => {
    if (currentNote) {
      setTempNoteText(currentNote.body)
    }
  }, [currentNote])

  React.useEffect(() => {
    const unsubscribe = onSnapshot(notesCollection, function(snapshot) {
      const notesArray = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
      setNotes(notesArray)
    })
    return unsubscribe;
  }, [])

  React.useEffect(() => {
    if (!currentNoteId) {
      setCurrentNoteId(notes[0]?.id)
    }
  }, [notes])

  // debounce
  React.useEffect(() => {
      const timeoutId = setTimeout(() => { // set a timeout
        if(tempNoteText === currentNote.body) return // if the text hasn't changed, don't update the note
        updateNote(tempNoteText) // update the note
      }, 500) // wait 500ms before updating the note
      return () => clearTimeout(timeoutId) // clear the timeout if the component unmounts
  }, [tempNoteText]) // run this effect whenever tempNoteText changes
  
  async function createNewNote() {
    const newNote = {
      body: "# Type your markdown note's title here",
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    const newNoteRef = await addDoc(notesCollection, newNote)
    setCurrentNoteId(newNoteRef.id)
  }
  
  async function updateNote(text) {
    const docRef = doc(db, "notes", currentNoteId);
    await setDoc(docRef, { body: text, updatedAt: Date.now() }, { merge: true })
  }
    
  async function deleteNote(noteId) {
    const docRef = doc(db, "notes", noteId);
    await deleteDoc(docRef)
  }
  
  return (
    <main>
    {
      notes.length > 0 
      ?
      <Split 
        sizes={[30, 70]} 
        direction="horizontal" 
        className="split"
      >
        <Sidebar
          notes={sortedNotes}
          currentNote={currentNote}
          setCurrentNoteId={setCurrentNoteId}
          newNote={createNewNote}
          deleteNote={deleteNote}
        />
          <Editor 
            tempNoteText={tempNoteText}
            setTempNoteText={setTempNoteText} 
          />
      </Split>
      :
      <div className="no-notes">
        <h1>You have no notes</h1>
        <button 
          className="first-note" 
          onClick={createNewNote}
        >
          Create one now
        </button>
      </div>
    }
    </main>
  )
}

export default App
