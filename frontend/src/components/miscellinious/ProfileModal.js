import { useDisclosure } from "@chakra-ui/hooks";
import { ViewIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/button";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text
  } from '@chakra-ui/react';
  import {Image} from '@chakra-ui/image';
import {Button} from '@chakra-ui/react'
import React from "react";
const ProfileModal = ({ user, children }) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader 
          fontSize={40}
          fontFamily="inherit"
          d="flex"
          justifyContent="center"
          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <Image src={user.pic} alt={user.name} borderRadius="full" boxSizing="150px" />
          <Text style={{marginTop:"10px"}} fontFamily='inherit' fontSize="25px" fontWeight="light">{user.email}</Text>
          </ModalBody>
          <ModalFooter d="flex" justifyContent="center">
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
        </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ProfileModal;
