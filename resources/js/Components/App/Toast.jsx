import { useEventBus } from "@/EventBus"
import { useEffect, useState } from "react"
import {v4 as uuidv4} from 'uuid'

export default function Toast({  }) {
    const [toasts, setToasts] = useState([])
    const {on}=useEventBus()

    useEffect(() =>{
        on('toast.show',(message)=>{
            const uuid=uuidv4();
            setToasts((oldToasts)=>[...oldToasts,{message,uuid}])

            setTimeout(()=>{
                setToasts((oldToasts)=>oldToasts.filter((toast)=>toast.uuid!==uuid))
            },5000)
        })
    },[on])

 return (
    <div className="toast toast-top toast-center min-w-[300px]">
       {toasts.map((toast, index) =>(
         <div key={toast.uuid} className="px-4 py-3 text-gray-100 rounded-md alert alert-success">
            <span>{toast.message}</span>
        </div>
       ))}
    </div>
 )
}
