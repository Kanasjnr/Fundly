import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import {
  VStack,
  HStack,
  Box,
  Textarea,
  Image,
  useToast,
  Input,
  Button,
  FormControl,
  FormLabel,
  Text,
  Select,
} from "@chakra-ui/react";

import { useStateContext } from "../../context/index";
// import { checkIfImage } from "../utils";
import Loader from "../Loader";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign } = useStateContext();
  const [form, setForm] = useState({
    name: "",
    title: "",
    description: "",
    target: "",
    deadline: "",
    image: "",
    // category: "",
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };
  const handleImageUpload = (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const blobUrl = URL.createObjectURL(file);
        setForm({ ...form, image: blobUrl });
      } else {
        console.error("No file selected.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.image === "") {
      toast({
        title: "Please upload an image",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      await createCampaign({
        ...form,
        target: ethers.utils.parseUnits(form.target, 18),
      });

      setTimeout(() => {
        setIsLoading(false);
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating campaign:", error);

      toast({
        title: "Error creating campaign",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  return (
    <VStack
      spacing={6}
      align="center"
      rounded="10px"
      p={[4, 10]}
      bg="#1c1c24"
      minW={["auto", "350px"]}
      w="full"
    >
      {isLoading && <Loader />}

      <Box
        justify="center"
        align="center"
        p={4}
        bg="#3a3a43"
        rounded="10px"
        minW={["auto", "380px"]}
      >
        <Text
          as="h1"
          fontSize={["18px", "25px"]}
          fontWeight="bold"
          color="white"
        >
          Start A Campaign
        </Text>
      </Box>

      <form onSubmit={handleSubmit} className="w-full mt-6 flex flex-col gap-6">
        <HStack spacing={6}>
          <FormControl isRequired>
            <FormLabel fontSize="15px" color="white">
              Your Name
            </FormLabel>
            <Input
              py="15px"
              px={["15px", "25px", "15px"]}
              outline="none"
              border="1px"
              borderColor="#3a3a43"
              bg="transparent"
              fontFamily="epilogue"
              color="white"
              fontSize="14px"
              placeholdercolor="#4b5264"
              borderRadius="10px"
              minW={["auto", "300px"]}
              placeholder="John Doe"
              type="text"
              value={form.name}
              onChange={(e) => handleFormFieldChange("name", e)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel fontSize="15px" color="white">
              Campaign Title
            </FormLabel>
            <Input
              py="15px"
              px={["15px", "25px", "15px"]}
              outline="none"
              border="1px"
              borderColor="#3a3a43"
              bg="transparent"
              fontFamily="epilogue"
              color="white"
              fontSize="14px"
              placeholdercolor="#4b5264"
              borderRadius="10px"
              minW={["auto", "300px"]}
              placeholder="Write a Title..."
              type="text"
              value={form.title}
              onChange={(e) => handleFormFieldChange("title", e)}
            />
          </FormControl>
        </HStack>

        <FormControl isRequired>
          <FormLabel fontSize="15px" color="white">
            Story
          </FormLabel>
          <Textarea
            py="15px"
            px={["15px", "25px", "15px"]}
            outline="none"
            border="1px"
            borderColor="#3a3a43"
            bg="transparent"
            fontFamily="epilogue"
            color="white"
            fontSize="14px"
            placeholdercolor="#4b5264"
            borderRadius="10px"
            minW={["auto", "300px"]}
            placeholder="Write your Story..."
            value={form.description}
            onChange={(e) => handleFormFieldChange("description", e)}
            rows={10}
          />
        </FormControl>

        <Box
          justify="start"
          align="center"
          p={4}
          bg="#8c6dfd"
          h="120px"
          rounded="10px"
        >
          <Text
            as="h4"
            fontSize="25px"
            fontWeight="bold"
            color="white"
            ml="20px"
          >
            You will get 100% of the raised amount.
          </Text>
        </Box>

        <HStack spacing={6}>
          <FormControl isRequired>
            <FormLabel fontSize="15px" color="white">
              Goal
            </FormLabel>
            <Input
              py="15px"
              px={["15px", "25px", "15px"]}
              outline="none"
              border="1px"
              borderColor="#3a3a43"
              bg="transparent"
              fontFamily="epilogue"
              color="white"
              fontSize="14px"
              placeholdercolor="#4b5264"
              borderRadius="10px"
              minW={["auto", "300px"]}
              placeholder="ETH 0.50"
              type="text"
              value={form.target}
              onChange={(e) => handleFormFieldChange("target", e)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel fontSize="15px" color="white">
              End Date
            </FormLabel>
            <Input
              py="15px"
              px={["15px", "25px", "15px"]}
              outline="none"
              border="1px"
              borderColor="#3a3a43"
              bg="transparent"
              fontFamily="epilogue"
              color="white"
              fontSize="14px"
              placeholdercolor="#4b5264"
              borderRadius="10px"
              minW={["auto", "300px"]}
              placeholder="End Date"
              type="date"
              value={form.deadline}
              onChange={(e) => handleFormFieldChange("deadline", e)}
            />
          </FormControl>
        </HStack>
        <FormControl isRequired>
          <FormLabel fontSize="15px" color="white">
            Campaign Image
          </FormLabel>
          <Input
            py="15px"
            px={["15px", "25px", "15px"]}
            outline="none"
            border="1px"
            borderColor="#3a3a43"
            bg="transparent"
            fontFamily="epilogue"
            color="white"
            fontSize="14px"
            placeholdercolor="#4b5264"
            borderRadius="10px"
            minW={["auto", "300px"]}
            placeholder="Place image URL of your campaign or upload an image"
            type="text"
            value={form.image}
            onChange={(e) => handleFormFieldChange("image", e)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ marginTop: "10px" }}
          />
          {form.image && (
            <Image src={form.image} alt="Campaign" maxW="300px" mt="10px" />
          )}
        </FormControl>

        <Box justify="center" align="center" mt={6} padding="16px 8px">
          {isLoading && <Loader />}
          <Button
            size="md"
            height="48px"
            width="200px"
            border="2px"
            borderRadius="10px"
            backgroundColor=" #1DAA97"
            type="submit"
            isDisabled={isLoading}
          >
            {isLoading ? "Creating Campaign..." : "Create Campaign"}
          </Button>
        </Box>
      </form>
    </VStack>
  );
};

export default CreateCampaign;