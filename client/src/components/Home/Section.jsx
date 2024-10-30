import { Button, Flex, Image, Text, Box } from "@chakra-ui/react";
import React from "react";

const Section = () => {
  return (
    <Flex
      px={{ base: 4, md: 20 }}
      flexDirection={{ base: "column", md: "row" }}
      justifyContent={{ base: "center", md: "space-between" }}
      alignItems="center"
      gap={{ base: 8, md: 10, lg: 20 }}
      w="full"
      bg="#F5EFE0"
      mt={250}
      py={{ base: 8, md: 0 }}
      height={{ base: "auto", md: "336px" }}
      textAlign={{ base: "center", md: "left" }}
    >
      <Flex
        flexDir="column"
        gap={{ base: 4, md: 2, lg: 1 }}
        justifyContent="center"
        alignItems={{ base: "center", md: "flex-start" }}
        maxW={{ base: "full", md: "50%" }}
      >
        <Text fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }} fontWeight={600}>
          Start one today!
        </Text>
        <Text fontSize={{ base: "md", md: "lg", lg: "xl" }} fontWeight={400}>
          People everywhere are empowered to start campaigns, mobilize <br />
          supporters, and work with Decision Makers to drive solutions.
        </Text>
        <Flex gap={4} mt={4} justifyContent={{ base: "center", md: "flex-start" }}>
          <Button bg="#1DAA97" w="216px" height="48px">
            Get Started
          </Button>
        </Flex>
      </Flex>
      <Box display={{ base: "flex", md: "block" }} justifyContent="center" width={{ base: "full", md: "auto" }}>
        <Image mb={{ base: 0, md: 40 }} src="start one today.png" />
      </Box>
    </Flex>
  );
};

export default Section;
