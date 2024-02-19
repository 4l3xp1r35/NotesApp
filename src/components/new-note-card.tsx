import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps{
  onNoteCreated: (content: string) => void
}

export function NewNoteCard({onNoteCreated}:NewNoteCardProps){
    const [shouldShowOnBoarding, setShouldShowOnBoarding] = useState(true)
    const [text, setText] = useState("")
    const [history, setHistory] = useState([])
    const [content,setContent] = useState('')
    const [isRecording,setIsRecording] = useState(false)
    
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    const speechRecognition = new SpeechRecognitionAPI()

    function handleStartEditor(){
      setShouldShowOnBoarding(false)
    }

    function handleEndEditor(){
      setShouldShowOnBoarding(true)
    }

    function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>){
      
      setText(event.target.value) 
      setContent(event.target.value)

      if(event.target.value == '')
        setShouldShowOnBoarding(true)

    }

    function handleSaveNote(event: FormEvent){
      event.preventDefault()
      
      if ( content == '')
        return

      onNoteCreated(content)

      setContent('')

      setShouldShowOnBoarding(true)

      toast.success('Note create with success')
    }

    function handleStartRecording (){
      setIsRecording(true)

      const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

      console.log(isSpeechRecognitionAPIAvailable)

      if (!isSpeechRecognitionAPIAvailable) {
        alert('Your browser does not support the recording api')
        return
      }

      speechRecognition.lang = "pt-BR"
      //nao para de gravar ate falar para parar the gravar
      speechRecognition.continuous = true
      //as vezes nao é entendido o que se disse entao no caso de meter 1 quer dizer que vai ser escolhida a alternativa com mais chanse de ser a correta
      speechRecognition.maxAlternatives = 1
      //trazer os resultados á medida que falamos em vez de so no final
      speechRecognition.interimResults = true

      speechRecognition.onresult = (event) => {
        console.log(event.results)
      }

      speechRecognition.onerror = (event) => {
        console.error(event)
      }

      speechRecognition.start()
    }

    function handleStopRecording (){
      setIsRecording(false)

      
    }

    return (
      <Dialog.Root>
        <Dialog.Trigger className='rounded-md flex flex-col bg-slate-700 p-5 gap-3 text-left hover:ring-2 outline-none hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
          <span className='text-sm font-medium text-slate-200'>
            Add note
            </span>
          <p className='text-sm leading-6 text-slate-400'>
            Save an audio note that will be automatically converted to text
            </p>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className='inset-0 fixed bg-black/50'/>
          <Dialog.Content className='fixed overflow-hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full h-[60vh] bg-slate-700 rounded-md flex flex-col outline-none '>
            <Dialog.Close onClick={handleEndEditor} className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-slate-200 rounded-md" >
              <X className="size-5" />
            </Dialog.Close>
           
            {!shouldShowOnBoarding &&
              <button className='absolute right-10 top-0 p-1.5 bg-slate-800 text-slate-400 text-sm hover:text-slate-100 rounded-md'
              >
                undo
              </button>
            }
            <form className="flex-1 flex flex-col">
              <div className='flex flex-1 flex-col gap-3 p-5'>
                <span className='text-sm font-medium text-slate-300'>
                  Add note
                </span>
                
                {shouldShowOnBoarding ? (
                
                  <p className='text-sm leading-6 text-slate-400'>
                    Start by <button type='button' onClick={handleStartRecording} className='font-medium text-lime-400 hover:underline'>recording an audio note</button> or if you prefer, <button type='button' onClick={handleStartEditor} className='font-medium text-lime-400 hover:underline'>just use text</button>.
                  </p>
                  
                  
                ) : (
                  
                  <textarea
                    autoFocus
                    className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none'
                    onChange={handleContentChanged}
                    value={content}
                  />
                  
                )}
              </div>
                {isRecording ? (
                    <button 
                      type='submit'
                      onClick={handleStopRecording}
                      className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100"
                    >
                      <div className='size-3 rounded-full bg-red-500 animate-pulse'/>
                      Recording! (press to stop)
                    </button>
                ) : (
                  <button 
                    type='button'
                    onClick={handleSaveNote}
                    className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
                  >
                    Save note
                  </button>
                )}
              
            </form>
          </Dialog.Content>
        </Dialog.Portal>


      </Dialog.Root>
        
    )
}