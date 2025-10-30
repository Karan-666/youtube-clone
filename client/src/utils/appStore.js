
import {configureStore} from "@reduxjs/toolkit"
// Default exported appSlice.reducer, importing as a name appReducer
import appReducer from "./appSlice.js"
import userReducer from "./userSlice.js"

// configureStore creates the store and it accepts an object.
const appStore = configureStore({
    // The 'reducer' object is where we will combine all of our 'slices' (categories of state).
    reducer: {
        app : appReducer ,
        // This makes state like store.user.isLoggedIn available globally.
        user : userReducer,
    }
});

// Export the store so we can provide it to the entire React application.
export default appStore;