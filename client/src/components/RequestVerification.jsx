import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
  Spinner,
} from '@chakra-ui/react';
import { useStateContext } from '../context/index';

async function hashData(data) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export default function RequestVerification() {
  const [name, setName] = useState('');
  const [document, setDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('unverified');
  const { currentAccount, submitVerificationDocument, getUserVerificationStatus } = useStateContext();
  const toast = useToast();

  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (currentAccount) {
        const status = await getUserVerificationStatus(currentAccount);
        setVerificationStatus(status);
      }
    };

    checkVerificationStatus();
  }, [currentAccount, getUserVerificationStatus]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setDocument(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const nameHash = await hashData(name);
  
      if (document) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const documentContent = event.target.result;
          const documentHash = await hashData(documentContent);
  
          try {
            await submitVerificationDocument(documentHash, nameHash);
  
            toast({
              title: 'Verification Requested',
              description: 'Your verification request has been submitted successfully.',
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
  
            setName('');
            setDocument(null);
            setVerificationStatus('pending');
          } catch (error) {
            if (error.message.includes("User is already verified")) {
              toast({
                title: 'Already Verified',
                description: 'Your account is already verified.',
                status: 'info',
                duration: 5000,
                isClosable: true,
              });
            } else {
              throw error; // rethrow any other error to the outer catch block
            }
          }
        };
        reader.readAsText(document);
      } else {
        throw new Error('No document selected');
      }
    } catch (error) {
      console.error('Verification request failed:', error);
      toast({
        title: 'Verification Request Failed',
        description: error.message || 'Failed to submit verification request. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  const renderContent = () => {
    switch (verificationStatus) {
      case 'verified':
        return (
          <Box textAlign="center" py={10}>
            <Heading as="h2" size="xl" mb={4}>
              Verification Status
            </Heading>
            <Text fontSize="lg">Your account is verified.</Text>
          </Box>
        );
      case 'pending':
        return (
          <Box textAlign="center" py={10}>
            <Heading as="h2" size="xl" mb={4}>
              Verification Status
            </Heading>
            <Text fontSize="lg">Your verification request is pending. Please check back later.</Text>
          </Box>
        );
      case 'rejected':
        return (
          <Box textAlign="center" py={10}>
            <Heading as="h2" size="xl" mb={4}>
              Verification Status
            </Heading>
            <Text fontSize="lg">Your verification request was rejected. Please submit a new request.</Text>
            {renderVerificationForm()}
          </Box>
        );
      default:
        return renderVerificationForm();
    }
  };

  const renderVerificationForm = () => (
    <form onSubmit={handleSubmit}>
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your Name"
        />
      </FormControl>
      <FormControl isRequired mt={4}>
        <FormLabel>Document</FormLabel>
        <Input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.txt"
        />
      </FormControl>
      <Button
        mt={6}
        colorScheme="blue"
        isLoading={isLoading}
        type="submit"
        width="full"
        loadingText="Submitting"
      >
        {isLoading ? <Spinner size="sm" /> : 'Submit Verification Request'}
      </Button>
    </form>
  );

  return (
    <Container maxW="container.sm">
      <Box borderWidth={1} borderRadius="lg" p={6} boxShadow="md" bg="white">
        <VStack spacing={4} align="stretch">
          <Heading as="h1" size="xl" textAlign="center">
            Account Verification
          </Heading>
          {renderContent()}
        </VStack>
      </Box>
    </Container>
  );
}