import { useEffect, useState} from "react";
import {  FaUpload,  FaRegFileImage,  FaRegFile,  FaCalendarAlt,  FaRegFilePdf, FaRegFileWord,} from "react-icons/fa";
import Swal from "sweetalert2";
import { FaAngleDown, FaCheck ,FaArrowsRotate } from "react-icons/fa6";
import { BsX } from "react-icons/bs";

export default function FileUpload({ file, index, onDelete }) {
  const [uploading, setUploading] = useState(true);  

  async function convertFileBase64(file) {
    return new Promise((resolve, reject) => {
      console.log(typeof file);
      if (typeof file === 'string'){
        resolve(file);
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const dataURL = reader.result;
        let base64String='';
        file.type==="application/pdf" ? base64String = dataURL.split(',')[1]: base64String = dataURL;
        resolve(base64String);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  useEffect(()=>{
    convertFileBase64(file.file_64).then(base64String => {
      file.file_64 = base64String;
      setTimeout(() => {
        setUploading(false);
        bottomNotification.fire({
          icon: "success",
          title: `File ${file.name} uploaded`,
        });
      }, 3000);
    }).catch(error => {
      console.error('Error al convertir el archivo a Base64:', error);
    });
  },[])

  const bottomNotification = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  function showPreview(file) {
    switch (file.type) {
      case "image/jpg":
      case "image/jpeg":
      case "image/png":
        Swal.fire({
          imageUrl: file.file_64,
          showCloseButton: true,
          showConfirmButton: false,
          width: 450,
        }); 
        break;
      case "application/pdf":
        try {
          var byteCharacters = atob(file.file_64);
          var byteNumbers = new Array(byteCharacters.length);
          for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          var byteArray = new Uint8Array(byteNumbers);
          var blob = new Blob([byteArray], { type: 'application/pdf' });
  
          var blobUrl = URL.createObjectURL(blob);
  
          window.open(blobUrl, '_blank');        
        } catch (error) {
          showAlert(
            "error",
            "Preview error",
            "There was an error while trying to preview the PDF."
          );
        }      
      break;
      default:
        showAlert(
          "question",
          "Invalid preview",
          `Sorry, but it is not possible to show a preview for this type of file ${file.type}.`
        );
    }
  }

  const renderIcon = (file) => {
    switch (file.type) {
      case "image/jpg":
      case "image/jpeg":
      case "image/png":
        return <FaRegFileImage onClick={() => showPreview(file)} />;
      case "application/pdf":
        return <FaRegFilePdf onClick={() => showPreview(file)} />;
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return <FaRegFileWord onClick={() => showPreview(file)} />;
      default:
        return <FaRegFile onClick={() => showPreview(file)} />;
    }
  };

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

  return (
    <div key={index} className="w-full px-3 py-3.5 rounded-md bg-slate-200">
      <div className="flex justify-between">
        <div className="w-[90%] flex justify-start items-center space-x-2">
          <div className="text-[#5E62FF] text-[37px] cursor-pointer">
            {renderIcon(file)}
          </div>
          <div className="space-y-1 w-full text-left">
            <div className="text-xs font-medium text-gray-500 overflow-hidden whitespace-nowrap text-ellipsis">
              {file.name}
            </div>
            {uploading ? (
              <div className="indeterminate-progress-bar">
                  <div className="indeterminate-progress-bar-progress"></div>
              </div>
            ) : 
            (
              <p className="text-black text-xs font-bold overflow-hidden whitespace-nowrap text-ellipsis">{(file.size / (1024 * 1024)).toFixed(2) +"MB"}</p>
            )
            }
          </div>
        </div>

        <div className="flex-1 flex justify-end">
          <div className="space-y-1">
            <div
              className="text-gray-500 text-[17px] cursor-pointer"
              onClick={() => onDelete(index)}
            >
              <BsX className="ml-auto" />
            </div>
            {uploading ? 
            (<div className="flex justify-between space-x-1 text-[10px] font-medium text-amber-500">
              <FaArrowsRotate className="mt-[1px]" size={10} />
              <span>Update</span>
            </div>)
            :(<div className="flex justify-between space-x-1 text-[10px] font-medium text-green-500">
              <FaCheck className="mt-[1px]" size={10} />
              <span>Done</span>
            </div>)
            }
          </div>
        </div>
      </div>
    </div>
  );
}
