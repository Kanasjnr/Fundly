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
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../../atoms/authAtom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAxiosInstance } from "../../../api/axios";
import userAtom from "../../atoms/userAtom";
import useShowToast from "../../hooks/useShowToast";

export default function SplitScreen() {
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const setUser = useSetRecoilState(userAtom);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  const axiosInstance = useAxiosInstance();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return showToast("Error", "password does not correspond", "error");
    }
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/auth/signup",
        JSON.stringify({ name, email, password, confirmPassword })
      );
      const data = response.data;

      if (data.message) {
        showToast("Success", data.message, "success");
      }

      navigate("/confirm-email");
    } catch (error) {
      console.log(error);
      showToast("Error", error.response.data.error, "error");
    } finally {
      setLoading(false);
    }
  };

  // const handleGoogleAuth = async () => {
  //   window.location.href = "http://localhost:5173/auth/googleauth/callback";
  // };

  const bgGradient = useColorModeValue(
    "linear(to-br, teal.600, indigo.900)",
    "linear(to-br, teal.800, indigo.900)"
  );
  const formBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Box w="full" minH="100vh" bg={bgGradient} p={8}>
      <Flex
        justifyContent="center"
        alignItems="center"
        minH="100vh"
        p={{ base: 4, lg: 8 }}
      >
        <Box
          w={{ base: "full", md: "75%", lg: "50%" }}
          bg={formBg}
          borderRadius="lg"
          boxShadow="lg"
          p={{ base: 6, lg: 8 }}
        >
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
                Hi, Welcome to Fundly!
              </Heading>
              <Text color={mutedTextColor}>
                Create an account
              </Text>
            </VStack>

            {/* <Button
              leftIcon={<FcGoogle />}
              variant="outline"
              w="full"
              onClick={handleGoogleAuth}
            >
              Sign up with Google
            </Button>

            <Flex align="center">
              <Box flex={1} h="1px" bg="gray.300" />
              <Text px={3} color={mutedTextColor} fontSize="sm">
                or Sign up with Email
              </Text>
              <Box flex={1} h="1px" bg="gray.300" />
            </Flex> */}

            <VStack as="form" spacing={4} onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <InputGroup>
                  <InputLeftElement children={<FiUser color="gray.500" />} />
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Smith"
                  />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email address</FormLabel>
                <InputGroup>
                  <InputLeftElement children={<FiMail color="gray.500" />} />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
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
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <InputLeftElement children={<FiLock color="gray.500" />} />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                  />
                </InputGroup>
              </FormControl>

              <Button
                colorScheme="teal"
                w="full"
                type="submit"
                isLoading={loading}
                loadingText="Signing Up"
              >
                Sign Up
              </Button>
            </VStack>

            <Text fontSize="sm" textAlign="center" color={mutedTextColor}>
              Already have an Account?{" "}
              <Link color="teal.500" onClick={() => setAuthScreen("login")}>
                Login
              </Link>
            </Text>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
}
