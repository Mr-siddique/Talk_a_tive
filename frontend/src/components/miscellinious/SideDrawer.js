import React, { useEffect, useState } from "react";
import {
  Tooltip,
  Button,
  Text,
  Box,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import ProfileModal from "./ProfileModal";
import { ChatState } from "../../Context/ChatProvider";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from '../userAvatar/UserListItem'
import { getSender } from "../../config/chatLogic";
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';
const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { user,selectedChat,setSelectedChat,chats,setChats,notification,setNotification}  = ChatState();
  const history = useHistory();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Invalid search",
        description: "Search string must not be empty",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data} = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (err) {
      toast({
        title: "Error in fetching user",
        description: err.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const accessChat = async(userId) => {
    try{
      setLoadingChat(true);
      const config={ 
        headers:{
          "content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        }
      }
      const {data}=await axios.post('/api/chat',{userId},config);
      // console.log(data);
      if(!chats.find(c=>c._id===data._id)) setChats([data,...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    }catch(err){
      toast({
        title: 'Error in fetching chat',
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text d={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
               {!notification.length && 'No new Messages'}
               {notification.map(notif=>(
                 <MenuItem key={notif._id} onClick={()=>{
                   setSelectedChat(notif.chat);
                  //  setNotification(notification.filter(n=>n.chat._id!==selectedChat._id));
                  setNotification(notification.filter(n=>n!==notif));
                 }}>
                   {notif.chat.isGroupChat?`New Message From ${notif.chat.chatName}`:`New Message from ${getSender(user,notif.chat.users)}`}
                 </MenuItem>
               ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                src={user.pic}
                size="sm"
                cursor="pointer"
                name={user.name}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Create your account
          </DrawerHeader>

          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>GO</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() =>{
                    accessChat(user._id);
                  }}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex"/>}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
export default SideDrawer;
