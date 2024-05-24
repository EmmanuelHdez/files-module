import { useState, useRef, useEffect, forwardRef } from 'react';
import { FaAngleDown, FaCheck } from 'react-icons/fa6';
import { FaUpload, FaRegFileImage, FaRegFile, FaCalendarAlt } from "react-icons/fa";
import { BsX } from "react-icons/bs"
import Swal from 'sweetalert2';
import uploadFiles from "../../images/uploadFiles/upload-files-input.jpg"

export function CustomDragDropFiles ({files2Upload, onUpload, onDelete, count, formats}) {

    const [dragging, setDragging] = useState(false)
    const fileRef = useRef(null)

    const uploadZoneRef = useRef(null);
    const [containerZoneHeight, setContainerZoneHeight] = useState(0);    

    useEffect(() => {
        if (uploadZoneRef.current) {
          const height = uploadZoneRef.current.clientHeight;
          setContainerZoneHeight(height);
        }
     }, [uploadZoneRef]);
    
    function handleDrop (e, type) {
        let files;
        if(type==='inputFile') {
            files = [...e.target.files]
        } else {
            e.preventDefault();
            e.stopPropagation();
            setDragging(false);
            files = [...e.dataTransfer.files];
        }

        const allFilesValid = files.every(file => {
            return formats.some(format => file.type.endsWith(`/${format}`));
        });

        if (files2Upload.length >= count) {
            showAlert('warning', 'Maximum Files', `Only ${count} files can be uploaded`);
            return;
        }
        if (!allFilesValid) {
            showAlert('warning', 'Invalid Media', `Invalid file format. Please only upload ${formats.join(', ').toUpperCase()}`);
            return;
        }
        if (count && count < files.length) {
            showAlert('error', 'Error', `Only ${count} file${count !== 1 ? 's' : ''} can be uploaded at a time`);
            return;
        }

        if (files && files.length) {
            const nFiles = files.map(async file => {
                const base64String = await convertFileBase64(file)
                return {
                    name: file.name,
                    photo: base64String,
                    type: file.type,
                    size: file.size
                }
            });

            Promise.all(nFiles).then(newFiles => {
                onUpload(newFiles);
                TopNotification.fire({
                    icon: 'success',
                    title: 'Image(s) uploaded'
                })
            });
                    
        }
    }

    async function convertFileBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file)
            reader.onload = () => {
                resolve(reader.result); 
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    }

    useEffect(() => {      
        const container = uploadZoneRef.current;  
        function handleDragOver(e) {
            e.preventDefault();
            e.stopPropagation();
            setDragging(true);
        }
        function handleDragLeave(e) {
            e.preventDefault();
            e.stopPropagation();
            setDragging(false);
        }
        container.addEventListener('dragover', handleDragOver);
        container.addEventListener('drop', handleDrop);
        container.addEventListener('dragleave', handleDragLeave);

        return ()=> {
            if (container) {
                container.removeEventListener('dragover', handleDragOver);
                container.removeEventListener('drop', handleDrop);
                container.removeEventListener('dragleave', handleDragLeave);                
            }            
        }
    }, [files2Upload])

    const TopNotification = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })         

    function showAlert(icon, title, text) {
        Swal.fire({
            icon: icon,
            title: title,
            text: text,
            showConfirmButton: false,
            width: 500,
            timer: 1500,
        });
    }

    function showImage (image) {
        Swal.fire({
            imageUrl: image,
            showCloseButton: true,
            showConfirmButton: false,
            width: 450,
        })
    }

    return (     
        <>
            <div
              className={`${dragging ? "border border-[#2B92EC] bg-[#EDF2FF]" : "border-dashed border-gray-400 border-2 bg-white"} flex-1 flex justify-center items-center mx-auto text-center rounded-md mt-2 py-5`}
              style={{ borderStyle: "dashed", borderWidth: "2px" }}
              ref={uploadZoneRef}
            >
              <div className="flex-1 flex flex-col mx-auto text-gray-400 mb-2 space-y-5">
                <img
                  className="w-[300px] mx-auto"
                  src={uploadFiles}
                  alt="Uploader different files"
                />
                <div className="text-[12px] font-normal text-gray-500">
                    <input className="opacity-0 hidden" type="file" multiple accept="image/*" ref={fileRef} onChange={(e)=>handleDrop(e, 'inputFile')}/>
                  <span>Arrastra tus archivos aquí</span> <br />
                  <span className="text-[#4070f4] cursor-pointer" onClick={() => { fileRef.current.click() }}>
                    Click para subir
                  </span>
                </div>
              </div>
            </div>

              <div
                className="flex-1 flex justify-center items-center mx-auto bg-white overflow-y-auto scroll-none pt-2"
                style={{ height: `${containerZoneHeight}px` }}
              >
                <div className="flex-1 mx-auto mb-2 space-y-2 h-full">


                {files2Upload.length > 0 && 
                    files2Upload.map((img, index) => (
                        <div key={index} className="w-full px-3 py-3.5 rounded-md bg-slate-200">
                        <div className="flex justify-between">
                            <div className="w-[90%] flex justify-start items-center space-x-2">
                            <div className='text-[#5E62FF] text-[37px] cursor-pointer' onClick={()=>showImage(img.photo)}>
                                        {img.type.match(/image.*/i)?
                                            <FaRegFileImage/>
                                            :
                                            <FaRegFile/>
                                        }  
                                    </div>
                            <div className="space-y-1 w-full text-left">
                                <div className="text-xs font-medium text-gray-500 overflow-hidden whitespace-nowrap text-ellipsis">
                                {img.name}
                                </div>
                                <div class="indeterminate-progress-bar">
                                    <div class="indeterminate-progress-bar-progress"></div>
                                </div>
                            </div>                            
                            </div>

                            <div className="flex-1 flex justify-end">
                            <div className="space-y-1">
                                <div className="text-gray-500 text-[17px] cursor-pointer" onClick={()=> onDelete(index)}>
                                <BsX className="ml-auto" />
                                </div>
                                <div className="flex justify-between space-x-1 text-[10px] font-medium text-green-500">
                                <FaCheck className="mt-[1px]" size={10}/>
                                <span>Done</span>
                                </div>
                            </div>
                            </div>

                        </div>
                        </div>
                    ))
                }
                

                
                </div>
              </div>
              </>



        
    )
}