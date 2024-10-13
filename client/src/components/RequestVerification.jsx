import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  useToast,
  Badge,
  Flex,
} from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'

const RequestVerification = () => {
  const [name, setName] = useState('')
  const [document, setDocument] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const toast = useToast()

  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (!name) return

      try {
        const response = await fetch(`http://localhost:3500/api/verify/status/${encodeURIComponent(name)}`, {
          method: 'GET',
        })
        if (response.ok) {
          const data = await response.json()
          setIsVerified(data.isVerified)
          if (data.isVerified) {
            localStorage.setItem('userVerified', 'true')
          }
        }
      } catch (error) {
        console.error('Failed to check verification status:', error)
      }
    }

    const verificationStatus = localStorage.getItem('userVerified')
    if (verificationStatus === 'true') {
      setIsVerified(true)
    } else {
      checkVerificationStatus()
    }
  }, [name])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !document) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('document', document)

    try {
      const response = await fetch('http://localhost:3500/api/verify/request', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: 'Success',
          description: data.message || 'Verification request submitted successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        setName('')
        setDocument(null)
        
        const statusResponse = await fetch(`http://localhost:3500/api/verify/status/${encodeURIComponent(name)}`, {
          method: 'GET',
        })
        if (statusResponse.ok) {
          const statusData = await statusResponse.json()
          setIsVerified(statusData.isVerified)
          if (statusData.isVerified) {
            localStorage.setItem('userVerified', 'true')
            toast({
              title: 'Verified',
              description: 'Your account has been successfully verified!',
              status: 'success',
              duration: 5000,
              isClosable: true,
              icon: <CheckCircleIcon />,
            })
          }
        }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to submit verification request')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box p={5} maxWidth="500px" margin="auto">
      <Flex justifyContent="center" alignItems="center" mb={5}>
        <Text fontSize="2xl" textAlign="center">Request Verification</Text>
        {isVerified && (
          <Badge ml={2} colorScheme="green" variant="solid" borderRadius="full" px={2}>
            <Flex alignItems="center">
              <CheckCircleIcon mr={1} />
              Verified
            </Flex>
          </Badge>
        )}
      </Flex>
      {!isVerified ? (
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Upload Document</FormLabel>
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => setDocument(e.target.files[0] || null)}
              />
              <Text fontSize="sm" color="gray.500" mt={1}>
                Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG
              </Text>
            </FormControl>
            <Button 
              colorScheme="teal" 
              type="submit" 
              isLoading={isLoading}
              loadingText="Submitting"
              width="100%"
            >
              Submit Verification Request
            </Button>
          </VStack>
        </form>
      ) : (
        <Box textAlign="center">
          <Text fontSize="lg" mb={4}>Your account is verified. Thank you!</Text>
          <CheckCircleIcon w={12} h={12} color="green.500" />
        </Box>
      )}
    </Box>
  )
}

export default RequestVerification