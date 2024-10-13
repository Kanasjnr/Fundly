import React from "react";
import { Box, Text } from "@chakra-ui/react";

const Loader = () => {
  return (
    <Box
      position="fixed"
      inset="0"
      zIndex="10"
      h="100vh"
      bg="rgba(0,0,0,0.7)"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        bg="white"
        rounded="full"
        p="6"
        shadow="md"
        display="flex"
        alignItems="center"
        // spaceX="4"
      >
        {/* <Image
          src={"Loader.svg"}
          alt="loader"
          w="50px"
          h="50px"
          animate="spin"
        /> */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" color="gray.800">
            Transaction in Progress
          </Text>
          <Text color="gray.600">Please wait...</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Loader;
