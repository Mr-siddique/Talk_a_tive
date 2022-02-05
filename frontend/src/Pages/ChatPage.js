import React, { useEffect,useState } from 'react';
import { Box } from '@chakra-ui/layout';
import SideDrawer from '../components/miscellinious/SideDrawer';
import MyChat from '../components/miscellinious/MyChat';
import ChatBox from '../components/miscellinious/ChatBox';
import {ChatState} from '../Context/ChatProvider';
const ChatPage=()=>{
     const {user}=ChatState();
     const [fetchAgain,setFetchAgain]=useState(false);
     return (
         <div style={{width:"100%"}}>
             { user && <SideDrawer/> }
             <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh"p="10px">
                 {user && <MyChat fetchAgain={fetchAgain}/>}
                 {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
             </Box>
         </div>
     )
}
export default ChatPage;