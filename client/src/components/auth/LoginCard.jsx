import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Text,
  VStack,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";

import { FcGoogle } from "react-icons/fc";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useRecoilState, useSetRecoilState } from "recoil";
import authScreenAtom from "../../atoms/authAtom";
import { useState } from "react";
import userAtom from "../../atoms/userAtom";
import { prevPathAtom } from "../../atoms/prevPathAtom";
import useShowToast from "../../hooks/useShowToast";
import { useAxiosInstance } from "/api/axios";
import tokenAtom from "../../atoms/tokenAtom";

export default function SplitScreen() {
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const [showPassword, setShowPassword] = useState(false);
  const setUser = useSetRecoilState(userAtom);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [prevPath, setPrevPath] = useRecoilState(prevPathAtom);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useRecoilState(tokenAtom);
  const axiosInstance = useAxiosInstance();
  const showToast = useShowToast();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        "/auth/signin",
        JSON.stringify({ email, password })
      );
      const loggedUser = response.data.loggedInUser;
      const token = response.data.token;

      // Store user data and token in localStorage
      localStorage.setItem("fundly", JSON.stringify(loggedUser));
      localStorage.setItem("token", token);

      // Set state for Recoil atoms
      setToken(token);
      setUser(loggedUser);

      // Handle redirection after successful login
      const localStoragePrevPath = localStorage?.getItem("localPrevPath");
      if (localStoragePrevPath) {
        localStorage.removeItem("localPrevPath");
        navigate(localStoragePrevPath);
      } else if (prevPath) {
        setPrevPath(null); // Clear stored path
        navigate(prevPath);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      if (error?.response?.status === 404) {
        showToast(
          "Error",
          "This user registered with Google authentication. Please continue with Google and create a password.",
          "error"
        );
      }
      console.error(error.response);
    } finally {
      setLoading(false);
    }
  };

  // const baseUrl = import.meta.env.VITE_BACKEND_URL

  // const handleGoogleAuth = () => {
  //   window.location.href = `${baseUrl}/auth/googleauth`;
  // }

  // Color settings for light and dark modes
  const bgGradient = useColorModeValue(
    "linear(to-br, teal.600, indigo.900)",
    "linear(to-br, teal.800, indigo.900)"
  );
  const formBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Box minH="100vh" bg={bgGradient} p={8}>
      <Flex justifyContent="center" alignItems="center" minH="100vh" p={{ base: 4, lg: 8 }}>
        <Box w={{ base: "full", md: "75%", lg: "50%" }} bg={formBg} borderRadius="lg" boxShadow="lg" p={{ base: 6, lg: 8 }}>
          <VStack spacing={8} align="stretch" maxW="md" mx="auto">
            <Flex justify="center" mb={4}>
              <Image
                objectFit="cover"
                src="Logo.png"
                alt="short logo"
                onClick={() => navigate("/")}
                cursor="pointer"
              />
            </Flex>

            <VStack align="stretch" spacing={2}>
              <Heading as="h2" size="xl" color={textColor}>
                Hi, Welcome Back!
              </Heading>
              <Text color={mutedTextColor}>Login</Text>
            </VStack>

            {/* <Button
              leftIcon={<FcGoogle />}
              variant="outline"
              w="full"
              onClick={handleGoogleAuth}
            >
              Sign in with Google
            </Button> */}

            {/* <Flex align="center">
              <Box flex={1} h="1px" bg="gray.300" />
              <Text px={3} color={mutedTextColor} fontSize="sm">
                or Sign in with Email
              </Text>
              <Box flex={1} h="1px" bg="gray.300" />
            </Flex> */}

            <VStack as="form" spacing={4} onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Email address</FormLabel>
                <InputGroup>
                  <InputLeftElement children={<FiMail color="gray.500" />} />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <InputLeftElement children={<FiLock color="gray.500" />} />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    required
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button colorScheme="teal" w="full" type="submit" isLoading={loading} loadingText="Signing in">
                Sign In
              </Button>
            </VStack>

            <Text fontSize="sm" textAlign="center" color={mutedTextColor}>
              Don&apos;t have an account?{" "}
              <Link color="teal.500" onClick={() => setAuthScreen("signup")}>
                Sign Up
              </Link>
            </Text>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
}
