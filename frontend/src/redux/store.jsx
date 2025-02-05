import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
const store = configureStore({  // create store         
    reducer: {          
   //reducers
    auth:authReducer
  },
 })
 
 export default store;

