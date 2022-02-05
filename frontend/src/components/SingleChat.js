import React, { useState, useEffect } from "react";
import { Box, Text, IconButton, FormControl } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { ChatState } from "../Context/ChatProvider";
import { getSender } from "../config/chatLogic";
import { getFullSender } from "../config/chatLogic";
import ProfileModal from "./miscellinious/ProfileModal";
import UpdateGroupChatModal from "./miscellinious/UpdateGroupChatModel";
import { Spinner, Input, useToast } from "@chakra-ui/react";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import "./userAvatar/styles.css";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";

var ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat,notification,setNotification } = ChatState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    renderSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    // if(selectedChat)
    // socket.emit("setup", selectedChat);
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    socket.on("connected", () => setSocketConnected(true));
  }, []);
  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if(!notification.includes(newMessageReceived)){
          setNotification([newMessageReceived,...notification]);
          setFetchAgain(!fetchAgain);
        }
      }
      setMessages([...messages, newMessageReceived]);
    });
  });
  console.log(notification);
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (err) {
      toast({
        title: "Unable to load messages",
        description: err.message,
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "top-end",
      });
    }
  };
  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            chatId: selectedChat._id,
            content: newMessage,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (err) {
        toast({
          title: "Unable to send message",
          description: err.message,
          status: "error",
          isClosable: true,
          duration: 5000,
          position: "top-end",
        });
      }
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    //typing indicator
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getFullSender(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="center"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner m="auto" size="xl" />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            {/* display messages */}
          </Box>
          <FormControl onKeyDown={sendMessage} isRequired mt={3}>
          {isTyping ? (
              <Lottie
                width={70}
                options={defaultOptions}
                height={20}
                style={{ marginBottom: 15, marginLeft: 0 }}
              />
            ) : (
              <></>
            )}
            <Input
              varient="filled"
              bg="#E0E0E0"
              value={newMessage}
              onChange={typingHandler}
              placeholder="Type your message..."
            />
          </FormControl>
        </>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="2xl" fontFamily="work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
