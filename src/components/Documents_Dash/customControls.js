import { useState, useRef, useEffect, forwardRef } from "react";
import { FaAngleDown, FaCheck } from "react-icons/fa6";
import Swal from "sweetalert2";
import uploadFiles from "../../images/uploadFiles/upload-files-input.jpg";

import FileUpload from "./components/fileUpload";

export function CustomDragDropFiles({files2Upload, file2UploadSize, onUpload, onDelete, count}) {
  const [dragging, setDragging] = useState(false);
  const [containerZoneHeight, setContainerZoneHeight] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);


  const fileRef = useRef(null);
  const uploadZoneRef = useRef(null);

  const hasAdjustedHeight = useRef(false);
  
  const mimeMap = {
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "png": "image/png",
    "pdf": "application/pdf",
    "doc": "application/msword",
    "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".ppt": "application/vnd.ms-powerpoint",
    ".vsd": "application/vnd.visio",
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".odt": "application/vnd.oasis.opendocument.text",
    ".ods": "application/vnd.oasis.opendocument.spreadsheet",
    ".odp": "application/vnd.oasis.opendocument.presentation",
};

  const acceptedTypes = Object.values(mimeMap).join(',');
  
  useEffect(() => {
    if (imageLoaded && uploadZoneRef.current) {
        console.log("Height change");
        const height = uploadZoneRef.current.clientHeight;
        setContainerZoneHeight(height);
        hasAdjustedHeight.current = true;
    }
  }, [imageLoaded]);

  function handleDrop(e, type) {
    let files;
    if (type === "inputFile") {
      files = [...e.target.files];
    } else {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
      files = [...e.dataTransfer.files];
    }

    const totalSize = files.reduce((accumulator, file) => {
      return accumulator + file.size;
    },file2UploadSize);

    const allFilesValid = files.every((file) => {
      return Object.values(mimeMap).includes(file.type);
    });

    const filesNoRepeat = files2Upload.every((file2Upload) => {
      return !files.some((file) => file.name === file2Upload.name);
    });

    if (!allFilesValid) {
      showAlert(
      "warning",
      "Invalid Media",
      `Invalid file format. Please only upload ${Object.keys(mimeMap).toString().toUpperCase()}`
    );
    return;
    }

    if (!filesNoRepeat) {
      showAlert(
      "warning",
      "Repeat Media",
      `Don't repeat elements.`
    );
    return;
    }

    if (totalSize > 10000000) {//1 byte= 1e+6Mb
      showAlert(
        "warning",
        "File size exceeds",
        `The file size exceeds 10 MB. Please do not repeat elements.`
      );
      return;
    }

    if (files2Upload.length >= count) {
      showAlert(
        "warning",
        "Maximum Files",
        `Only ${count} files can be uploaded`
      );
      return;
    }

    if (count && count < files.length) {
      showAlert(
        "error",
        "Error",
        `Only ${count} file${count !== 1 ? "s" : ""} can be uploaded at a time`
      );
      return;
    }

    if (files && files.length) {
      const nFiles = files.map((file) => {
        return  {
          name: file.name,
          file_64: file,
          type: file.type,
          size: file.size,
        };
      });
      onUpload(nFiles);
    }
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
    container.addEventListener("dragover", handleDragOver);
    container.addEventListener("drop", handleDrop);
    container.addEventListener("dragleave", handleDragLeave);

    return () => {
      if (container) {
        container.removeEventListener("dragover", handleDragOver);
        container.removeEventListener("drop", handleDrop);
        container.removeEventListener("dragleave", handleDragLeave);
      }
    };
  }, [files2Upload]);


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
    <>
      <div
        className={`${
          dragging
            ? "border border-[#2B92EC] bg-[#EDF2FF]"
            : "border-dashed border-gray-400 border-2 bg-white"
        } flex-1 flex justify-center items-center mx-auto text-center rounded-md mt-2 py-5`}
        style={{ borderStyle: "dashed", borderWidth: "2px" }}
        ref={uploadZoneRef}
      >
        <div className="flex-1 flex flex-col mx-auto text-gray-400 mb-2 space-y-5">
          <img
            className="w-[300px] mx-auto"
            src={uploadFiles}
            alt="Uploader different files"
            onLoad={() => setImageLoaded(true)}
            style={{}}
          />
          <div className="text-[12px] font-normal text-gray-500">
            <input
              className="opacity-0 hidden"
              type="file"
              multiple
              accept={acceptedTypes}
              ref={fileRef}
              onChange={(e) => handleDrop(e, "inputFile")}
            />
            <span>Arrastra tus archivos aquí</span> <br />
            <span
              className="text-[#4070f4] cursor-pointer"
              onClick={() => {
                fileRef.current.click();
              }}
            >
              Click para subir
            </span>
          </div>
        </div>
      </div>

      <div
        className="flex-1 flex justify-center items-center mx-auto overflow-y-auto scroll-none pt-2"
        style={{ height: `${containerZoneHeight}px` }}
      >
        <div className="flex-1 mx-auto mb-2 space-y-2 h-full">
          {files2Upload.length > 0 && files2Upload.map((file, index) => (
            <FileUpload file={file} index={index} onDelete={onDelete} key={index} />
          ))}
        </div>
      </div>
    </>
  );
}
