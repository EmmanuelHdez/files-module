import { useReducer, useEffect, useRef, useState } from "react";
import autoAnimate from '@formkit/auto-animate'
import { FaSearchPlus, FaFolderPlus , FaCloudUploadAlt, FaSearch, FaSync } from "react-icons/fa";
import { FaFileCirclePlus  } from "react-icons/fa6";
import { BsPersonCircle } from "react-icons/bs";
import { IoIosClose } from "react-icons/io";
import { documentsReducer } from "./utils/reducer";
import loadingGif from "../../images/icons/loading.gif";
import { onTypeSearchAccount } from "./utils/requests";
import Swal from 'sweetalert2';
import { ModalFolder } from "./modals/modalFolder.js";
import ModalFiles from "./modals/modalFIles.js";

const initialState = {
  infoSelectedUser: null,
  inputValue: "",
  loadingSearchNameList: false,
  searchedNames: [],
  displayListNames: false,
  selectedNumber: "",
  disabledRefresh: true,
  isFetchedNumber: false,
  loading: true,
  disabledSearch: true,
  files2Upload: []

};

export function Documents() {
  const [state, dispatch] = useReducer(documentsReducer, initialState);
  const [modalNewFolder, setModalNewFolder] = useState(false);  
  const [modalNewFiles, setModalNewFiles] = useState(false);
  const [refreshAction, setRefreshAction] = useState(false);
  const [errorSearch, setErrorSearch] = useState(false);  
  const token = "token";
  const usrKey = "idUser";
  const searchInput = useRef(); 


  

  useEffect(() => {
    if (state.inputValue !== "" && state.inputValue.length >= 3) {
      let stop = false;
      let id = setTimeout(() => {
        dispatch({ type: "LOADING_LIST", payload: true });
        onTypeSearchAccount(state.inputValue, token, usrKey)
          .then((response) => {
            const data = response.data.result;
            if (!stop) {
              dispatch({ type: "FETCH_NAMES", payload: data });
              setErrorSearch(false);
            }
          })
          .catch((e) => {
            console.log(e);
            dispatch({ type: "FETCH_NAMES", payload: [] });
            setErrorSearch(e.response.data.error);
          });
      }, 500);
      return () => {
        clearTimeout(id);
        stop = true;
      };
    }
  }, [state.inputValue]);

  useEffect(() => {
    if (state.displayListNames) {
      let l = document.querySelector(".searchNamesList");
      const inputElement = searchInput.current;
      const handleListNames = () => {
        l.style.display = "none";
      };
      const handleInputClick = (e) => {
        l.style.display = "block";
        e.stopPropagation();
      };

      if (inputElement) {
        inputElement.addEventListener("click", handleInputClick);
      }
      window.addEventListener("click", handleListNames);

      return () => {
        window.removeEventListener("click", handleListNames);
        if (inputElement) {
          inputElement.removeEventListener("click", handleInputClick);
        }
      };
    }
  }, [state.displayListNames]);

  const closeNewFolder = () => {
    setModalNewFolder(false)
  } 

  const closeNewFiles = () => {
    setModalNewFiles(false)
  }

  const onInputChange = (e) => {
    let value = e.target.value;
    dispatch({ type: "TYPE_SEARCH", payload: value });
    if (value === "") return;
  };

  const OnNameClick = (person) => {
    dispatch({ type: "ONCLICK_NAME", payload: person });
  }; 

  function createFolder() {
    
  }

  return (
    <div className="w-full h-full">
      <div className="flex justify-between align-middle">
        <div className="my-4 px-8">
          <div className="flex justify-between align-middle">
            <div
              className="shadow-inner rounded-full w-[50px] h-[50px] my-auto flex"
              style={{
                boxShadow:
                  "-5px -5px 9px rgba(255,255,255,0.45), 5px 5px 9px rgba(94,104,121,0.3)",
              }}
            >
              <div className="text-[#1F9EE4] m-auto">
                <FaCloudUploadAlt size={30} />
              </div>
            </div>
            <div className="ml-5">
              <div className="text-[20px] text font-semibold my-auto text-gray-500">
                Documentos de Personal
              </div>
              <div className="text-md font-bold text-[#5E62FF] my-auto">
                Visualiza todos los documentos de todo el personal!
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[calc(100%_-_4.5rem)] flex flex-col flex-1 overflow-y-auto scroll-none mx-[2rem] rounded-xl bg-indigo-50 border">
        <div className="space-y-6">
          <div className="form-show-animation w-full">
            <div className="flex justify-between relative items-end px-7 py-3 border-b-2 border-gray-300">
              <div className="w-[40%] flex justify-start space-x-3 items-center">
                {state.selectedNumber ? (
                  <div className="flex justify-start items-center m-0 text-[15px]">
                    <PersonalPhoto
                      name={state.infoSelectedUser?.name}
                      photo={state.infoSelectedUser?.photo}
                    />
                  </div>
                ) : (
                  <div className="text-[#2B92EC] font-semibold md:text-[16px] text-[13.5px]">
                    Directorios y Documentos
                  </div>
                )}

                <button className="rounded-full p-3 shadow-md bg-[#2B92EC] text-white disabled:cursor-not-allowed disabled:bg-indigo-600">
                  <FaSync className="hover-reload-animation" size={18} />
                </button>
              </div>

              <div className="flex-1 flex justify-between items-end space-x-2">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-none">
                    <FaSearch size={14} className="text-gray-500" />
                  </div>
                  <input
                    ref={searchInput}
                    className="pl-8 font-normal h-[35px] w-full text-[11px] px-3 text-gray-500 bg-white border-gray-400 border rounded-lg border-opacity-50 outline-none focus:border-[#2B92EC] placeholder-gray-400 placeholder-opacity-80 transition duration-200 mr-2"
                    type="text"
                    value={state.inputValue}
                    onChange={(e) => onInputChange(e)}
                    placeholder="Buscar Nombre..."
                  />
                  <div className="inline-flex items-center absolute right-[0.4rem] z-50 bg-white bottom-[3px] py-1">
                    {state.loadingSearchNameList && (
                      <img
                        className="w-4 h-4 ml-1"
                        src={loadingGif}
                        alt="Loading while searching"
                      />
                    )}
                    {!state.inputValue ? null : (
                      <IoIosClose
                        className="text-[#f12b2c] text-[20px] cursor-pointer"
                        onClick={() => {
                          dispatch({ type: "CLEAR_INPUT" });
                        }}
                      />
                    )}
                  </div>
                  <>
                    {state.displayListNames ? (
                      <SearchNamesList
                        names={state.searchedNames}
                        OnNameClick={OnNameClick}
                        error={errorSearch}
                      />
                    ) : (
                      false
                    )}
                  </>
                </div>

                <div className="flex items-end justify-between space-x-2">
                  <button
                    className="disabled:bg-indigo-600 disabled:cursor-not-allowed bg-[#2B92EC] rounded-md shadow-lg cursor-pointer"
                    onClick={console.log(222)}
                  >
                    <div className="flex items-center justify-around px-3 py-[7px]">
                      <div className="flex justify-between md:inline-flex items-center">
                        <span className="text-white mr-2">
                          <FaSearchPlus size={18} />
                        </span>
                        <span className="text-white text-[14px] font-medium">
                          Buscar
                        </span>
                      </div>
                    </div>
                  </button>
                  <AddMediaControls createFolder={createFolder} openFolder={()=>setModalNewFolder(true)} openFiles={()=>setModalNewFiles(true)}/>
                  
                  

                  {modalNewFolder && <ModalFolder close={closeNewFolder}/>}
                  {modalNewFiles && <ModalFiles close={closeNewFiles} files2Upload={state.files2Upload} dispatch={dispatch}/>}
                  
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonalPhoto({ name, photo }) {
  return !photo ? (
    <>
      <div className="md:h-[3em] md:w-[3em] h-[42px] w-[42px] border-2 border-white rounded-full mr-2">
        <BsPersonCircle
          className="h-full w-full rounded-full text-white"
          alt={`Foto de personal de ${name}`}
        />
      </div>
      <span
        className="font-semibold text-[#707070] text-[11px] md:text-[13px] max-w-[180px] overflow-hidden whitespace-nowrap text-ellipsis"
        title={name}
      >
        {name}
      </span>
    </>
  ) : (
    <>
      <div className="md:h-[3em] md:w-[3em] h-[42px] w-[42px] border-2 border-white rounded-full mr-2">
        <img
          src={photo}
          className="h-full w-full rounded-full text-white"
          alt={`Foto de personal de ${name}`}
        />
      </div>
      <span
        className="font-semibold text-[#707070] text-[11px] md:text-[13px] max-w-[180px] overflow-hidden whitespace-nowrap text-ellipsis"
        title={name}
      >
        {name}
      </span>
    </>
  );
}

function AddMediaControls({createFolder, openFolder, openFiles}) {
  const [show, setShow] = useState(false);
  const parent = useRef(null);

  function closeContainer(e) {
    if (parent.current && !parent.current.contains(e.target)) {
      setShow(false);
    }
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      closeContainer(e);
    };

    if (show) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [show]);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const reveal = () => setShow(!show);

  return (
    <div ref={parent} className="relative">
      <button
        className="disabled:bg-indigo-600 disabled:cursor-not-allowed bg-[#2B92EC] rounded-md shadow-lg cursor-pointer"
        onClick={reveal}
      >
        <div className="flex items-center justify-around px-3 py-[7px]">
          <div className="flex justify-between md:inline-flex items-center">
            <span className="text-white mr-2">
              <FaFolderPlus size={18} />
            </span>
            <span className="text-white text-[14px] font-medium">
              Añadir contenido
            </span>
          </div>
        </div>
      </button>
      {show && (
        <div className="dropdown-content absolute border shadow-md rounded-md divide-y divide-slate-300 text-[11px] w-full max-h-[150px] top-[100%] z-50 bg-white font-normal mt-2 py-2">
          <div className="flex justify-between items-center px-3 pb-2 text-gray-400 cursor-pointer" onClick={openFiles}>
            <p className="flex-1 text-xs font-bold">Añadir archivos</p>
            <FaFileCirclePlus size={20} />
          </div>
          <div className="flex justify-between items-center px-3 pt-2 text-gray-400 cursor-pointer" onClick={openFolder}>
            <p className="flex-1 text-xs font-bold">Crear Carpeta</p>
            <FaFolderPlus size={20} />
          </div>
        </div>
      )}
    </div>
  );
}


function SearchNamesList(props) {
  return (
    <div className="searchNamesList absolute border shadow-md rounded-md divide-y divide-slate-300 text-[11px] w-full max-h-[150px] top-[100%] z-50 overflow-y-scroll cstm-personal-bar bg-white text-gray-500 font-normal mt-2">
      {props.error !== false ? (
        <div className="px-3 py-1 w-full text-red-500">
          Error: {props.error || "Unknown error"}
        </div>
      ) : props.names.length === 0 ? (
        <div className="px-3 py-1 w-full">
          No fueron encontrados resultados.
        </div>
      ) : (
        props.names.map((e, i) => (
          <div
            key={`person${i}`}
            className="px-3 py-1 w-full hover:cursor-pointer hover:bg-[#3751ff1a]"
            onClick={(a) => {
              props.OnNameClick(e.Info);
            }}
          >
            {e.Info.name}
          </div>
        ))
      )}
    </div>
  );
}
