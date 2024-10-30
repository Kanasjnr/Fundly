import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Image,
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
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Button,
  useToast,
} from "@chakra-ui/react";
import { FiMenu, FiBell, FiChevronDown } from "react-icons/fi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { ImArrowDownLeft2 } from "react-icons/im";
import { MdHome } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";

const SidebarContent = ({ onClose, ...rest }) => {
  return (
    <Box
      transition="3s ease"
      bg={"#ECF1F6"}
      boxShadow="1px 0px 2px 1px rgba(0,0,0,0.6)"
      zIndex={99}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      color={"#374957"}
      {...rest}
    >
      <Flex direction="column" h="full" justifyContent="space-between">
        <Box>
          <Flex h="20" alignItems="center" mx="6" justifyContent="space-between">
            <Link to="/">
              <Image src="/Logo.png" mb={2} alt="Logo" />
            </Link>
            <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
          </Flex>

          <NavItem as={NavLink} to={"/dashboard"} icon={MdHome}>
            Dashboard
          </NavItem>

          <Accordion allowToggle mt={2}>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Flex
                    align="center"
                    p="4"
                    borderRadius="lg"
                    role="group"
                    cursor="pointer"
                    fontSize={"lg"}
                    fontWeight={600}
                  >
                    <Icon mr="4" as={ImArrowDownLeft2} />
                    Campaigns
                  </Flex>
                  <AccordionIcon />
                </AccordionButton>
              </h2>

              <AccordionPanel pb={4} pl={2}>
                <NavItem
                  as={NavLink}
                  to={"/create-campaign"}
                  style={({ isActive }) => ({
                    color: isActive ? "" : "",
                    paddingLeft: "12px",
                  })}
                  py="2"
                >
                  Create Campaign
                </NavItem>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          <NavItem as={NavLink} to={"/profile"} icon={CgProfile}>
            Profile
          </NavItem>
        </Box>
      </Flex>
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
          bg: "green.500",
          color: "white",
        }}
        fontSize="lg"
        fontWeight={600}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
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
 
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const toast = useToast();

  useEffect(() => {
    const address = localStorage.getItem('walletAddress');
    const balance = localStorage.getItem('walletBalance');
    
    if (address && balance) {
      setWalletAddress(address);
      setWalletBalance(balance);
    }
  }, []);

  const disconnectWallet = () => {
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletBalance');
    setWalletAddress("");
    setWalletBalance("");
    toast({
      title: "Wallet disconnected",
      description: "You have successfully disconnected your wallet.",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
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

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Logo
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar size={"sm"}  />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                 
                  {walletAddress && (
                    <Text fontSize="xs" color="gray.600">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </Text>
                  )}
                  {walletBalance && (
                    <Text fontSize="xs" color="gray.600">
                      Balance: {parseFloat(walletBalance).toFixed(4)} ETH
                    </Text>
                  )}
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
              <MenuItem onClick={() => navigate("/verify")}>
                Request verification
              </MenuItem>
              <MenuDivider />
              {walletAddress && (
                <MenuItem onClick={disconnectWallet}>Disconnect wallet</MenuItem>
              )}
              <MenuDivider />
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

const SidebarWithHeader = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
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
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
};

export default SidebarWithHeader;