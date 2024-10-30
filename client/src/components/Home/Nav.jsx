import React, { useState } from "react";
import { Image, Flex, IconButton, Box, Stack, Button } from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { ethers } from "ethers";

export default function Nav() {
  const [show, setShow] = useState(false);
  const toggleMenu = () => setShow(!show);
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        const formattedBalance = ethers.utils.formatEther(balance);
        
        localStorage.setItem('walletAddress', address);
        localStorage.setItem('walletBalance', formattedBalance);
        
        navigate('/dashboard');
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      console.log("Please install MetaMask!");
    }
  };

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
        <Image src="Logo.png" alt="Logo" />
      </Flex>

      <IconButton
        display={{ base: "block", md: "none" }}
        onClick={toggleMenu}
        icon={show ? <CloseIcon /> : <HamburgerIcon />}
        variant="outline"
        aria-label="Toggle menu"
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
          <Button as={Link} to="/" colorScheme="teal" variant="ghost">
            Home
          </Button>
          <Button as={Link} to="/about" colorScheme="teal" variant="ghost">
            About-us
          </Button>
          <Button as={Link} to="/contact-us" colorScheme="teal" variant="ghost">
            Contact
          </Button>
          <Button as={Link} to="/faq" colorScheme="teal" variant="ghost">
            FAQ
          </Button>
          <Button
            onClick={connectWallet}
            colorScheme="teal"
            variant="solid"
            size={{ base: "md", md: "lg" }}
          >
            Connect Wallet
          </Button>
        </Stack>
      </Box>
    </Flex>
  );
}