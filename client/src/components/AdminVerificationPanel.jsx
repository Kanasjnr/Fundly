
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Box,
  Button,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  HStack,
  Divider,
  SimpleGrid,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import { contractAbi, contractAddress } from '../utils/constants';

export default function AdminVerificationPanel() {
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [error, setError] = useState(null);
  const [contract, setContract] = useState(null);
  const [userAddress, setUserAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const initializeContract = async () => {
      try {
        if (typeof window.ethereum !== 'undefined') {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setUserAddress(address);

          const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
          setContract(contractInstance);
        } else {
          throw new Error('MetaMask is not installed');
        }
      } catch (err) {
        console.error('Failed to initialize the contract:', err);
        setError('Failed to connect to the blockchain. Please make sure MetaMask is installed and connected.');
      }
    };

    initializeContract();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {
          window.location.reload();
        });
      }
    };
  }, []);

  useEffect(() => {
    if (contract) {
      fetchVerificationRequests();
      // Set up an interval to refresh the requests every 30 seconds
      const interval = setInterval(fetchVerificationRequests, 30000);
      return () => clearInterval(interval);
    }
  }, [contract]);

  const fetchVerificationRequests = async () => {
    if (!contract) return;

    setIsLoading(true);
    try {
      const requests = await contract.getPendingVerificationRequests();
      console.log('Pending requests:', requests);

      const formattedRequests = await Promise.all(requests.map(async (address) => {
        try {
          const details = await contract.verificationDocuments(address);
          return {
            userAddress: address,
            nameHash: details.nameHash,
            documentHash: details.documentHash,
            status: details.status
          };
        } catch (error) {
          console.error(`Error fetching details for ${address}:`, error);
          return null;
        }
      }));

      const validRequests = formattedRequests.filter(request => request !== null);

      setVerificationRequests(validRequests);
      setError(null);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Failed to fetch verification requests:', err);
      setError('Failed to fetch verification requests. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (address) => {
    try {
      const tx = await contract.verifyUser(address);
      await tx.wait();
      toast({
        title: "Verification Approved",
        description: `User ${address} has been verified.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchVerificationRequests();
    } catch (err) {
      console.error('Failed to approve verification:', err);
      toast({
        title: "Error",
        description: err.reason || "Failed to approve verification.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleReject = async (address) => {
    try {
      const tx = await contract.rejectVerification(address);
      await tx.wait();
      toast({
        title: "Verification Rejected",
        description: `Verification for user ${address} has been rejected.`,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
      fetchVerificationRequests();
    } catch (err) {
      console.error('Failed to reject verification:', err);
      toast({
        title: "Error",
        description: err.reason || "Failed to reject verification.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleManualRefresh = () => {
    fetchVerificationRequests();
    toast({
      title: "Refreshing",
      description: "Fetching latest verification requests...",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  if (error) {
    return (
      <Alert status="error" mb={4}>
        <AlertIcon />
        <AlertTitle mr={2}>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Container maxW="container.xl" p={4}>
      <Box borderWidth={1} borderRadius="lg" p={6} boxShadow="md" bg="white">
        <VStack spacing={6} align="stretch">
          <Heading as="h1" size={{ base: 'lg', md: 'xl' }} textAlign="center" color="teal.500">
            Verification Panel
          </Heading>
          <Text fontSize={{ base: 'sm', md: 'md' }} textAlign="center" color="gray.600">
            Manage verification requests
          </Text>
          <HStack justify="space-between" align="center">
            <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.600">
              Connected address: <strong>{userAddress}</strong>
            </Text>
            <Button
              leftIcon={<RepeatIcon />}
              onClick={handleManualRefresh}
              isLoading={isLoading}
              size="sm"
              colorScheme="teal"
              variant="outline"
            >
              Refresh
            </Button>
          </HStack>
          {lastRefresh && (
            <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500" textAlign="right">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </Text>
          )}
          <Divider />
          {isLoading ? (
            <Box textAlign="center" py={4}>
              <Spinner />
              <Text mt={2}>Loading verification requests...</Text>
            </Box>
          ) : verificationRequests.length === 0 ? (
            <Alert status="info" mb={4}>
              <AlertIcon />
              <AlertDescription>No pending verification requests found. If you just submitted a request, please wait a few moments and click refresh.</AlertDescription>
            </Alert>
          ) : (
            <Table variant="striped" colorScheme="teal" size="sm">
              <Thead>
                <Tr>
                  <Th>User Address</Th>
                  <Th>Name Hash</Th>
                  <Th>Document Hash</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {verificationRequests.map((request) => (
                  <Tr key={request.userAddress}>
                    <Td>{request.userAddress}</Td>
                    <Td>{request.nameHash}</Td>
                    <Td>{request.documentHash}</Td>
                    <Td>
                      <Button colorScheme="green" mr={2} onClick={() => handleApprove(request.userAddress)}>
                        Approve
                      </Button>
                      <Button colorScheme="red" onClick={() => handleReject(request.userAddress)}>
                        Reject
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </VStack>
      </Box>
    </Container>
  );
}
