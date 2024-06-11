import { useEffect, useCallback, useState } from "react";
import sendEmailIcon from "../../../images/email-icon.png";
import { BsXCircle } from "react-icons/bs";
import { FaEnvelope, FaTrash, FaPlusCircle } from "react-icons/fa";
import { createPortal } from "react-dom";
import loadingIcon from "../../../images/icons/loading.gif";


const modalElement = document.getElementById('modals-root')

export function ModalFolder({data, close, setMessage}) {   
    
    const [inputValue, setInputValue] = useState('');
    const [sending, setSending] = useState(false);      

    const escClose = useCallback(
      (e) => {
        if (e.keyCode === 27) close()
      },
      [close],
    )
    
    useEffect(() => {
        if(data) document.addEventListener('keydown', escClose, false)    

        return () => {
            document.removeEventListener('keydown', escClose, false)
        }
    }, [escClose, data])       

    return createPortal(        
        
        <div className="modal-fade modal-container fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center" style={{backgroundColor: "rgba(0, 0, 0, 0.35)"}}>
            <div className="w-[27vw] h-auto bg-white px-5 py-3 rounded-lg shadow-2xl animated-obj" >                
                <main className="text-center items-center pt-2">                    
                    <div className="font-normal text-gray-700 text-[20px] mb-3 text-left">Carpeta nueva</div>                    

                    <div className="relative flex items-center justify-start space-x-2 mb-4">
                        <label className="relative cursor-pointer w-full">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value.trim())}
                                placeholder="Nueva Carpeta"
                                className="font-normal h-[35px] w-full px-3 text-[12px] text-gray-500 bg-white border-gray-400 border rounded-lg border-opacity-50 outline-none focus:border-[#2B92EC] placeholder-gray-400"
                            />                          
                        </label>                                                                    
                    </div>         
                    
                    <div className="flex justify-end space-x-5 items-center pb-2">                            
                        <div className="flex justify-end items-center cursor-pointer" onClick={close}>
                            <span className="text-[#2B92EC] text-[14px] font-semibold">Cancelar</span>
                        </div>

                        <button className="flex justify-end items-center cursor-pointer disabled:cursor-not-allowed disabled:text-gray-300 text-[#2B92EC] text-[14px] font-semibold" onClick={close} disabled={inputValue===""||sending}>
                            Crear
                        </button>
                        
                    </div>
                </main>                    
            </div>
        </div>        
        ,        
        modalElement
        
    )
}



export default ModalFolder