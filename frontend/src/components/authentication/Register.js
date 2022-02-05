import React, { useState } from "react";
import {
  VStack,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import FileBase from "react-file-base64";
import axios from "axios";
import {useHistory} from "react-router-dom"; 
const Register = () => {
  const history=useHistory();
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const toast = useToast();
  // const postDetails = (pic) => {};
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "All fields are mandatory",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    const REGXP = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email.match(REGXP)) {
      toast({
        title: "Invalid Email",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (password.length < 8) {
      toast({
        title: "Password is too Short",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "confimPassword and password must be same",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const config ={
        headers: {
          "Content-type":"application/json"
        }
      }
      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        config
      );
      toast({
        title: "Registation Sucessful",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem('userInfo',JSON.stringify(data));
      history.push('/chats');
    } catch (err) {
      toast({
        title: "Registation Failed",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75em" size="sm" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id=" confirmPassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>

        <Input
          type="password"
          placeholder="Confirm Your Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
        />
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload Your Avatar</FormLabel>
        <FileBase
          className="file"
          type="file"
          name="eventImage"
          multiple={false}
          onDone={({ base64 }) => setPic(base64)}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: "15px" }}
        onClick={submitHandler}
      >
        Register
      </Button>
    </VStack>
  );
};
export default Register;
