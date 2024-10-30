import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Button,
    Image,
  } from "@chakra-ui/react";
  import {
    IconButton,
    Avatar,
    Box,
    CloseButton,
    Flex,
    HStack,
    VStack,
    Icon,
    useColorModeValue,
    Text,
    Drawer,
    DrawerContent,
    useDisclosure,
  } from "@chakra-ui/react";
  import { FiMenu, FiBell, FiChevronDown } from "react-icons/fi";
  import { CiLogout } from "react-icons/ci";
  import { NavLink, useNavigate } from "react-router-dom";
  import { CgProfile } from "react-icons/cg";
  import { AiOutlineSound } from "react-icons/ai";
  import { ImArrowDownLeft2, ImArrowUpRight2 } from "react-icons/im";
  import { AiFillAppstore } from "react-icons/ai";
  
  import React, { useContext } from "react";
//   import { useDisconnect } from "@thirdweb-dev/react";
  const SidebarContent = ({ onClose, ...rest }) => {
    const navigate = useNavigate();
    return (
      <Box
        transition="3s ease"
        bg={"#ECF1F6"}
        boxShadow="1px 0px 2px 1px rgba(0,0,0,0.6)"
        zIndex={99}
        w={{ base: "full", md: 60 }}
        pos="fixed"
        h="full"
        color={"#374957"} ///////////////////////////////////////////////////For the sidebar
        {...rest}
      >
        <Flex h="20" alignItems="center" mx="6" justifyContent="space-between">
          {/* <Image mb={2} src="Logo.png" /> */}
  
          <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
        </Flex>
  
        <NavItem
          as={NavLink}
          to={"/dashboard"}
          style={({ isActive }) => ({
            color: isActive ? "rgb(41, 112, 255)" : "",
          })}
          icon={AiFillAppstore}
        >
          Dashboard
        </NavItem>
  
        <Accordion allowToggle mt={2}>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Flex
                  align="center"
                  p="4"
                  // mx="4"
                  borderRadius="lg"
                  role="group"
                  cursor="pointer"
                >
                  <Icon mr="4" fontSize="16" as={ImArrowDownLeft2} />
                  Camapigns
                </Flex>
                <AccordionIcon />
              </AccordionButton>
            </h2>
  
            <AccordionPanel pb={4} pl={2}>
              <NavItem
                as={NavLink}
                to={"/create-campaign"}
                style={({ isActive }) => ({
                  color: isActive ? "rgb(41, 112, 255)" : "",
                  paddingLeft: "12px", // Adjust left padding to create indentation
                })}
                py="2"
              >
                Create Campaign
              </NavItem>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
  
        <NavItem
          as={NavLink}
          to={"/profile"}
          style={({ isActive }) => ({
            color: isActive ? "rgb(41, 112, 255)" : "",
          })}
          icon={CgProfile}
        >
          Profile
        </NavItem>
      </Box>
    );
  };
  
  const NavItem = ({ icon, children, ...rest }) => {
    return (
      <Box>
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: "#1DAA97",
            color: "white",
          }}
          {...rest}
        >
          {icon && (
            <Icon
              mr="4"
              fontSize="20"
              _groupHover={{
                color: "white",
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      </Box>
    );
  };
  const MobileNav = ({ onOpen, ...rest }) => {
  
  
    return (
      <Flex
        pos={"sticky"}
        top={0}
        zIndex={9}
        ml={{ base: 0, md: 60 }}
        px={{ base: 4, md: 4 }}
        height="20"
        alignItems="center"
        bg={"#ECF1F6"}
        boxShadow="base"
        justifyContent={{ base: "space-between", md: "flex-end" }}
        {...rest}
      >
        <IconButton
          display={{ base: "flex", md: "none" }}
          onClick={onOpen}
          variant="outline"
          aria-label="open menu"
          icon={<FiMenu />}
        />
  
        <Image display={{ base: "flex", md: "none" }} src="Logo.png" />
  
        <HStack spacing={{ base: "0", md: "6" }}>
          <Flex
            justify="space-between"
            align="center"
            w="full"
            display={{ base: "none", sm: "flex" }}
            mr={10}
            gap={10}
          >
          </Flex>
        </HStack>
      </Flex>
    );
  };
  
  
  const Header = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    return (
      <Box
        minH="100vh"
        bg={"#F8F8F8"} ///////////////////////////////////////////////////////////For the whole box
      >
        <SidebarContent
          onClose={() => onClose}
          display={{ base: "none", md: "block" }}
        />
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full"
        >
          <DrawerContent>
            <SidebarContent onClose={onClose} />
          </DrawerContent>
        </Drawer>
        {/* mobilenav */}
        <MobileNav onOpen={onOpen} />
        <Box ml={{ base: 0, md: 60 }} p="2">
          {children}
        </Box>
      </Box>
    );
  };
  
  export default Header;
  