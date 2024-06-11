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
    const [progress, setProgress] = useState(0);

    const file2UploadSize=files2Upload.reduce((accumulator,file)=>{
      return accumulator + file.size;
    },0);

    useEffect(() => {
      const fileSizeInBytes = file2UploadSize;
      const maxFileSize = 10000000; // 10 MB (tamaño máximo permitido)
      const newProgress = (fileSizeInBytes / maxFileSize) * 100;
      setProgress(newProgress);
    }, [file2UploadSize]);

    function uploadFiles (f) {
        dispatch({type: "UPLOAD_IMAGES_BROWSER", payload: f})
    }
    
    function deleteFile (index) {
      dispatch({type: "DELETE_BROWSER_IMAGES", payload: index})
    }

    function deleteAllFiles () {
      dispatch({type: "DELETE_ALL_BROWSER_IMAGES"})
    }

    const escClose = useCallback(
      (e) => {
        if (e.keyCode === 27 && files2Upload.length === 0) {
          close();
        }
      },
      [close],
    );
    
    console.log(222, files2Upload);

    useEffect(() => {
        document.addEventListener('keydown', escClose, false)    

        return () => {
            document.removeEventListener('keydown', escClose, false)
        }
    }, [escClose, data])  
    

    return createPortal(
      <div
        className="modal-fade modal-container fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.35)" }}
      >
        <div className="w-[70vw] h-auto min-h-[60vh] bg-white px-5 py-3 rounded-lg shadow-2xl animated-obj">
          <main className="text-center items-center pt-2">
          <div className="flex justify-between items-center font-normal text-gray-700 text-[20px] mb-3 text-left">
            <span className="text-[#4070f4] text-[20px] text font-semibold">Subir tus Documentos</span>
            <div
              className="text-gray-500 text-[17px] cursor-pointer"
              onClick={() => {
                close();
                deleteAllFiles();
              }}
            >
              <BsX className="ml-auto" />
            </div>
          </div>

            <div className="flex items-center justify-center space-x-5 mb-4">
              <CustomDragDropFiles files2Upload={files2Upload} file2UploadSize ={file2UploadSize} onUpload={uploadFiles} onDelete={deleteFile} count={10} />
            </div>
            <p className="text-black text-xs	font-sans	text-left	tracking-wide	">Upload</p>
            <div className="flex justify-end items-center pb-2">
            <div className="flex w-full items-center justify-center mr-5">
              <div className="indeterminate-progress-bar w-full mr-2">
                <div  className="determinate-progress-bar" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-black text-xs	font-sans	">{(file2UploadSize / (1024 * 1024)).toFixed(2) +"MB/10MB"}</p>
            </div>
            

            <button
              className="cursor-pointer disabled:cursor-not-allowed disabled:text-gray-300 text-[#2B92EC] text-[14px] font-semibold"
              onClick={() => {
                close();
                deleteAllFiles();
              }}
              disabled={files2Upload.length === 0}
            >
              Cancelar
            </button>

            <button
              className="cursor-pointer disabled:cursor-not-allowed disabled:text-gray-300 text-[#2B92EC] text-[14px] font-semibold ml-5"
              onClick={() => {
                close();
                deleteAllFiles();
              }}
              disabled={files2Upload.length === 0 || sending}
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