import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import artReducer from './artSlice'
const store = configureStore({  // create store         
    reducer: {          
   //reducers
    auth:authReducer,
    art: artReducer
  },
 })
 
 export default store;

