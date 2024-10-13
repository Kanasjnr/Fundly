import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
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
// import { AiFillGift } from "react-icons/ai";
// import { BsGearFill } from "react-icons/bs";
// import { IconType } from "react-icons";
// import { ReactText } from "react";
import useLogout from "../hooks/useLogout";
import { CgProfile } from "react-icons/cg";
import { ImArrowDownLeft2 } from "react-icons/im";
import { MdHome } from "react-icons/md";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { ethers } from "ethers";

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
      color={"#374957"} ///////////////////////////////////////////////////For the sidebar
      {...rest}
    >
      <Flex direction="column" h="full" justifyContent="space-between">
        <Box>
          <Flex
            h="20"
            alignItems="center"
            mx="6"
            justifyContent="space-between"
          >
            <Link to="/">
              {" "}
              {/* Wrap the Image component with Link */}
              <Image src="/Logo.png" mb={2} />
            </Link>
            <CloseButton
              display={{ base: "flex", md: "none" }}
              onClick={onClose}
            />
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
  const logout = useLogout();
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const savedAccount = localStorage.getItem("walletAccount");
    const savedBalance = localStorage.getItem("walletBalance");
    if (savedAccount && savedBalance) {
      setAccount(savedAccount);
      setBalance(savedBalance);
      setIsConnected(true);
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const accountAddress = await signer.getAddress();
        const accountBalance = await provider.getBalance(accountAddress);
        const formattedBalance = ethers.utils.formatEther(accountBalance);

        setAccount(accountAddress);
        setBalance(formattedBalance);
        setIsConnected(true);

        localStorage.setItem("walletAccount", accountAddress);
        localStorage.setItem("walletBalance", formattedBalance);

        toast({
          title: "Wallet connected",
          description: `Connected to ${accountAddress}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        toast({
          title: "Connection failed",
          description: "Failed to connect wallet. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to connect your wallet.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance(null);
    setIsConnected(false);
    localStorage.removeItem("walletAccount");
    localStorage.removeItem("walletBalance");
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
                <Avatar size={"sm"} src={user?.avatar} />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Flex alignItems="center">
                    <Text fontSize="sm" fontWeight="bold">
                      {user?.name}
                    </Text>
                    {user?.isVerified && (
                      <Box ml={1} color="green.500">
                        <FaCheckCircle size="0.75em" />
                      </Box>
                    )}
                  </Flex>
                  {isConnected && (
                    <Text fontSize="xs" color="gray.600">
                      {account.slice(0, 6)}...{account.slice(-4)}
                    </Text>
                  )}
                  {isConnected && (
                    <Text fontSize="xs" color="gray.600">
                      Balance: {parseFloat(balance).toFixed(4)} ETH
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
              <MenuItem
                onClick={isConnected ? disconnectWallet : connectWallet}
              >
                {isConnected ? "Disconnect wallet" : "Connect wallet"}
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={logout}>Sign out</MenuItem>
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
