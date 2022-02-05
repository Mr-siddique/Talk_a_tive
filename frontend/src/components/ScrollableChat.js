import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../Context/ChatProvider";
import { isSameSender, isLastMessage,isSameUser,isSameSenderMargin } from "../config/chatLogic";
import { Tooltip, Avatar,Text } from "@chakra-ui/react";
const ScrollableChat = ({ messages }) => {
  const set=new Set();
  for(let i=0;i<messages.length;i++) set.add(messages[i].chat._id)
  const { user } = ChatState();
  // console.log(set.size,selectedChat._id,set);
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message, index) => (
          <div style={{ display: "flex" }} key={message._id}>
              { 
              (isSameSender(messages,message,index,user._id) || isLastMessage(messages,index,user._id)) &&
                (<Tooltip
                  label={message.sender.name}
                  placement={"bottom-start"}
                  hasArrow
                >
                  <Avatar
                    mt={"7px"}
                    mr={"1px"}
                    size="sm"
                    cursor="pointer"
                    name={message.sender.name}
                    src={message.sender.pic}
                  />
                </Tooltip>)}
                <span 
                style={{backgroundColor:`${message.sender._id===user._id? "#BEE3F8" : "#B9F5D0"}`,
                borderRadius:'20px',
                padding:'5px 15px',
                maxWidth:'75%',
                marginLeft:isSameSenderMargin(messages,message,index,user._id),
                marginTop:isSameUser(messages,message,index)?3:10
              }}>
                  {message.content}
                </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};
export default ScrollableChat;
