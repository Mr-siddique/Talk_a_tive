import React,{useEffect} from "react";
import {
  Container,
  Box,
  Text,
  Tab,
  Tabs,
  TabPanel,
  TabList,
  TabPanels,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import Login from '../components/authentication/Login';
import Register from '../components/authentication/Register';
const HomePage = () => {
  const history = useHistory();
  useEffect(()=>{
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if(userInfo) history.push('/chats');
  },[history]);
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"beige"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="inherit" color="black">
          Talk-A-Tive
        </Text>
      </Box>
      <Box
        bg="beige"
        w="100%"
        p={4}
        borderRadius="lg"
        borderWidth="1px"
        color="black"
      >
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Register</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Register />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};
export default HomePage;
