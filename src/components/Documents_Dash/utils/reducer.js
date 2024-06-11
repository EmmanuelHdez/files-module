// Personal Records Reducer

export function documentsReducer(state, action) {
  switch (action.type) {


    case "TYPE_SEARCH": {
      if (action.payload)
        return { ...state, inputValue: action.payload, disabledSearch: true };
      return {
        ...state,
        inputValue: action.payload,
        searchedNames: [],
        displayListNames: false,
        disabledSearch: false,
      };
    } // DONE

    case "ONCLICK_NAME":
      console.log(action.payload);
      return {
        ...state,
        disabledFilter: false,
        searchedNames: [],
        displayListNames: false,
        inputValue: action.payload.name,
        selectedNumber: action.payload.number,
        infoSelectedUser: {...action.payload},
        isFetchedNumber: false,
    };    

    case "CLEAR_INPUT":
      return {
        ...state,
        disabledFilter: false,
        searchedNames: [],
        displayListNames: false,
        inputValue: "",
        selectedNumber: "",
    }; // DoNE

    case "ERROR_FETCH": {
      return {
        ...state,
        disabledFilter: false,
        disabledRefresh: false,
        loading: false,       
        errorFetching: true,
        errorMessage: action.payload,
      };
    }

    case "ONSCROLL_ACTION": {
      return { ...state, loadingOnScroll: true, errorScrolling: false };
    }

    case "RESET_FILTERS": {
      return {
        ...state,
        startDateValue: action.payload,
        endDateValue: action.payload,
        inputValue: "",
        selectedNumber: "",
        searchedNames: [],
      };
    }
    case "LOADING_LIST": {
      return { ...state, loadingSearchNameList: action.payload };
    }

    case "FETCH_NAMES": {
      if (action.payload.length === 0)
        return {
          ...state,
          searchedNames: [],
          displayListNames: true,
          loadingSearchNameList: false,
        };
      if (!state.inputValue)
        return {
          ...state,
          searchedNames: [],
          displayListNames: false,
          loadingSearchNameList: false,
        };

      return {
        ...state,
        searchedNames: action.payload,
        displayListNames: true,
        loadingSearchNameList: false,
      };
    }

    case "DISABLED_FILTER": {
      return { ...state, disabledFilter: action.payload };
    }
    case "DISABLED_LOADING": {
      return { ...state, loading: action.payload };
    }
    case "LOADING_RECORDS": {
      return { ...state, loading_records: action.payload };
    }
    case "NOT_FOUNDED_RECORDS": {
      return { ...state, errorIndividualRecords: false, individualRecords: {}, errorRecordsMessage: action.payload };
    }
    case "ERROR_LOADING_RECORDS": {
      return { ...state, errorIndividualRecords: true, errorRecordsMessage: action.payload};
    }

    case"UPLOAD_IMAGES_BROWSER":{
      return {...state,files2Upload:[...state.files2Upload,...action.payload]}
    }

    case "DELETE_BROWSER_IMAGES":{  
      return {
        ...state,
        files2Upload: state.files2Upload.slice(0, action.payload).concat(state.files2Upload.slice(action.payload + 1))
      };
    }
    case "DELETE_ALL_BROWSER_IMAGES":{  
      return {
        ...state,
        files2Upload: []
      };
    }
      
    default:
      return state;
  }
}
// End Personal Records Reducer


