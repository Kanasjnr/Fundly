import React, { useState } from "react";
import { Image, Flex, IconButton, Box, Stack, Button } from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
// import { useStateContext } from "../../context";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const [show, setShow] = useState(false);
  const toggleMenu = () => setShow(!show);
  // const { connect, address } = useStateContext();
  const navigate = useNavigate();

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1rem"
      bg="white"
      color="black"
      position="fixed"
      top={0}
      width="100%"
      zIndex={999}
    >
      <Flex align="center" mr={5}>
        <Image src="Logo.png" />
      </Flex>

      <IconButton
        display={{ base: "block", md: "none" }}
        onClick={toggleMenu}
        icon={show ? <CloseIcon /> : <HamburgerIcon />}
        variant="outline"
      />

      <Box
        display={{ base: show ? "block" : "none", md: "block" }}
        flexBasis={{ base: "100%", md: "auto" }}
      >
        <Stack
          spacing={4}
          align="center"
          justify={["center", "space-between", "flex-end", "flex-end"]}
          direction={["column", "row", "row", "row"]}
          pt={[4, 0, 0, 0]}
        >
          <Button colorScheme="teal" variant="ghost">
            <Link to="/">Home</Link>
          </Button>
          <Button colorScheme="teal" variant="ghost">
            <Link to="/about">About-us</Link>
          </Button>
          <Button colorScheme="teal" variant="ghost">
            <Link to="/contact-us">Contact</Link>
          </Button>
          <Button colorScheme="teal" variant="ghost">
            <Link to="/faq">FAQ</Link>
          </Button>
          <Button
            colorScheme="white"
            variant="ghost"
            size={{ base: "md", md: "lg" }}
            >
            
            <Link to="/auth">Get Started</Link>
          
          </Button>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Nav;
