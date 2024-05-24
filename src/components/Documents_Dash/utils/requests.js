import axios from 'axios';
import Swal from 'sweetalert2';

const baseUrl = window.location.href.includes("localhost")
  ? "https://localhost:3001"
  : "https://10.20.50.35:3001";

export function showAlert(icon, title, text) {
  Swal.fire({
    icon: icon,
    title: title,
    text: text,
    showConfirmButton: false,
    width: 500,
    timer: 2000,
  });
}


export const TopNotification = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})  




export async function onTypeSearchAccount(inputValue, token, usrKey) {  
  let requestConfig = {
    method: "GET",
    url: `/api/personal-change?valSearch=${inputValue}&collection=personal&usrKey=${usrKey}`,
    baseUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }
  return await axios(requestConfig);
}

export async function searchPersonalInfo (number, token, usrKey) {
  let requestConfig = {
    method: "GET",
    url: `/api/personal-change-searchPersonInfo?number=${number}&collection=personal&usrKey=${usrKey}`,
    baseUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }
  return await axios(requestConfig); 
}















