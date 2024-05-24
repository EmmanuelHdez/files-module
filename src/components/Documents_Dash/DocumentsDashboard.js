import { IconButton } from "@mui/material";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Documents } from "./Documents";



export function DocumentsDashboard() { 
 
  return (
    <div className="w-full h-full">
     <div className="flex justify-between m-0 px-16 pr-3 bg-white shadow-lg relative items-center py-4">

        {/* Searchbar and logo */}
        <div className="flex justify-between space-x-8">
             
        </div>

        {/* Icons Control and Profile */}
        <div className="flex space-x-5">
          <div className="flex space-x-3">                 
              <IconButton>
                  <NotificationsOutlinedIcon />
              </IconButton>
              <IconButton>
                  <SettingsOutlinedIcon />
              </IconButton>                
          </div>
          
        </div>

      </div>

      <div className="h-[calc(100vh_-_5.5rem)] flex flex-col pb-4">
        <Documents/>
      </div>
    </div>
  );
}










