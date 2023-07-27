import React from "react"
import { useState } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import { data } from "./data"
import Split from "react-split"
import {nanoid} from "nanoid"

function App() {
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem("notes")) || [])
  const [currentNoteId, setCurrentNoteId] = useState(
    (notes[0] && notes[0].id) || ""
  )

  React.useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])
  
  function createNewNote() {
    const newNote = {
      id: nanoid(), //what is nanoid?
      body: "# Type your markdown note's title here"
    }
    setNotes(prevNotes => [newNote, ...prevNotes])
    setCurrentNoteId(newNote.id)
  }
  
  function updateNote(text) {
    // Put the most recently-modified note at the top of the list
    setNotes(oldNotes => {
        const newArray = [] //create new array
        for (let i = 0; i < oldNotes.length; i++) { //loop through old notes
          const oldNote = oldNotes[i] //set old note to current index
          if (oldNote.id === currentNoteId) { //if old note id matches current note id
            newArray.unshift({ ...oldNote, body: text }) //add new note at the beginning of array
          } else { //if old note id does not match current note id
            newArray.push(oldNote) //add old note to end of array
          }
        }
        return newArray //return new array
      }
    )
  }
    
  function deleteNote(event, noteId) {
    event.stopPropagation()
    // Your code here
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId))
    
  }
  
  function findCurrentNote() {
    return notes.find(note => {
      return note.id === currentNoteId
    }) || notes[0]
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
          notes={notes}
          currentNote={findCurrentNote()}
          setCurrentNoteId={setCurrentNoteId}
          newNote={createNewNote}
          deleteNote={deleteNote}
        />
        {
          currentNoteId && 
          notes.length > 0 &&
          <Editor 
            currentNote={findCurrentNote()} 
            updateNote={updateNote} 
          />
        }
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
