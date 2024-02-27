import * as Dialog from '@radix-ui/react-dialog'
import { formatDistanceToNow } from 'date-fns'
import { enGB } from 'date-fns/locale'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'

interface NoteCardProps{
  note: {
    id: string
    date: Date
    content: string
  }
  onNoteDeleted: (id: string) => void
  onNoteEdited: (id: string, text: string) => void
}

export function NoteCard({note, onNoteDeleted, onNoteEdited}: NoteCardProps){
    const [editMode,setEditMode] = useState(false)
    const [content, setContent] = useState (note.content)

    function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>){
      setContent(event.target.value)
    }

    function handleNoteEdited(event: FormEvent){
      event.preventDefault()
      setEditMode(true)
    }

    return (
      <Dialog.Root>
        <Dialog.Trigger className='rounded-md text-left flex flex-col bg-slate-800 p-5 gap-3 overflow-hidden outline-none relative hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
          <span className='text-sm font-medium text-slate-300'>
              {formatDistanceToNow(note.date,{locale: enGB,addSuffix:true})} 
            </span>
          <p className='txt-sm leading-6 text-slate-400'>
            {note.content}
            </p>
          <div className='absolute  bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none'/>
        </Dialog.Trigger>
        <Dialog.Portal>e
          <Dialog.Overlay className='inset-0 fixed bg-black/50'/>
          <Dialog.Content className=' group fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none'>
            <Dialog.Close className=" group-focus-visible:ring-2 group-focus-visible:ring-lime-400 absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100 rounded-md" >
              <X className="size-5" />
            </Dialog.Close>
            <form className='flex-1 flex flex-col'>
            <div className='flex flex-1 flex-col gap-3 p-5'>
              <span className='text-sm font-medium text-slate-300'>
                {formatDistanceToNow(note.date,{locale: enGB,addSuffix:true})} 
              </span>
              
                {!editMode ? (

                    <p className='text-sm leading-6 text-slate-400'>
                      {note.content}
                    </p>

                ) : (
                  <textarea
                      autoFocus
                      className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none'
                      onChange={handleContentChanged}
                      value={content}
                    />

                )
                    
                }
                
              </div>

              <div className='flex justify-between'>
                {editMode ? (
                  <button 
                    type='submit'
                    onClick={() => onNoteEdited(note.id,content)}
                    className="w-1/2 bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium  border-b-2 border-lime-400"
                  >
                    You want to <span className="text-lime-400 group-hover:underline">save the note</span>?
                  </button>
                ) : (
                  <button 
                    type='button'
                    onClick={handleNoteEdited}
                    className="w-1/2 bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium  border-b-2 border-lime-400"
                  >
                    You want to <span className="text-lime-400 group-hover:underline">edit the note</span>?
                  </button>
                )}
                
                <button 
                  type='button'
                  onClick={() => onNoteDeleted(note.id)}
                  className="w-1/2 bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium  border-b-2 border-red-400"
                >
                  You want to <span className="text-red-400 group-hover:underline">delete the note</span>?
                </button>
              </div>        
                
              </form>
          </Dialog.Content>
        </Dialog.Portal>
        

      </Dialog.Root>
        
    )
}