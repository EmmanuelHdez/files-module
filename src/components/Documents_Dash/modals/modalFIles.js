import { useEffect, useCallback, useState, useRef } from "react";
import sendEmailIcon from "../../../images/email-icon.png";
import { BsX } from "react-icons/bs";
import { FaEnvelope, FaTrash, FaCheck, FaRegFileImage } from "react-icons/fa";
import { createPortal } from "react-dom";
import loadingIcon from "../../../images/icons/loading.gif";
import { CustomDragDropFiles } from "../customControls";


const modalElement = document.getElementById('modals-root')

export function ModalFiles({files2Upload, dispatch, data, close}) {   
    
    const [inputValue, setInputValue] = useState('');
    const [sending, setSending] = useState(false);

    function uploadFiles (f) {
        dispatch({type: "UPLOAD_IMAGES_BROWSER", payload: f})
    }
    
    function deleteFile (index) {
        dispatch({type: "DELETE_BROWSER_IMAGES", payload: index})
    }

    const escClose = useCallback(
      (e) => {
        if (e.keyCode === 27) close()
      },
      [close],
    )     

    console.log(222, files2Upload);

    useEffect(() => {
        if(data) document.addEventListener('keydown', escClose, false)    

        return () => {
            document.removeEventListener('keydown', escClose, false)
        }
    }, [escClose, data])       

    return createPortal(
      <div
        className="modal-fade modal-container fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.35)" }}
      >
        <div className="w-[70vw] h-auto bg-white px-5 py-3 rounded-lg shadow-2xl animated-obj">
          <main className="text-center items-center pt-2">
            <div className="font-normal text-gray-700 text-[20px] mb-3 text-left">
              <span className="text-[#4070f4]">Subir </span>tus archivos
            </div>

            <div className="flex items-center justify-center space-x-5 mb-4">
              <CustomDragDropFiles files2Upload={files2Upload} onUpload={uploadFiles} onDelete={deleteFile} count={2} formats={["jpg", "jpeg", "png"]} />
              
            </div>

            <div className="flex justify-end space-x-5 items-center pb-2">
              <div
                className="flex justify-end items-center cursor-pointer"
                onClick={close}
              >
                <span className="text-[#2B92EC] text-[14px] font-semibold">
                  Cancelar
                </span>
              </div>

              <button
                className="flex justify-end items-center cursor-pointer disabled:cursor-not-allowed disabled:text-gray-300 text-[#2B92EC] text-[14px] font-semibold"
                onClick={close}
                disabled={inputValue === "" || sending}
              >
                Crear
              </button>
            </div>
          </main>
        </div>
      </div>,
      modalElement
    );
}



export default ModalFiles