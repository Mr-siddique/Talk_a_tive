import React from 'react';
// import { Button,Container } from '@chakra-ui/react';
import {Route} from 'react-router-dom';
import HomePage from './Pages/HomePage';
import ChatPage from './Pages/ChatPage';
import './App.css'
const App=()=>{
    return ( 
        <div className="App">
           <Route exact path='/' component={HomePage} />
           <Route exact path='/chats' component={ChatPage} />
        </div>
    )
}
export default App;