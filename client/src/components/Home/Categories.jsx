import { Flex, Image, Text } from "@chakra-ui/react";
import React from "react";

const Categories = () => {
  return (
    <Flex flexDirection="column" gap="50px" alignItems="center" mt={70}>
      <Text fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }} fontWeight={600}>
        Explore Categories
      </Text>
      <Flex 
        flexWrap="wrap"
        justifyContent="center"
        gap={{ base: "20px", md: "30px", lg: "50px" }}
      >
        <Flex
          padding="20px"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          maxW={{ base: "100%", md: "calc(33.333% - 30px)", lg: "calc(33.333% - 50px)" }}
          flexBasis={{ base: "100%", md: "calc(33.333% - 30px)", lg: "calc(33.333% - 50px)" }}
        >
          <Image borderRadius="20px" src="health and medical.png" />
          <Text
            fontSize={{ base: "md", md: "lg", lg: "xl" }}
            fontWeight={500}
            color="black"
            textAlign="center"
            mt="10px"
          >
            Health & Medical
          </Text>
        </Flex>
        <Flex
          padding="20px"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          maxW={{ base: "100%", md: "calc(33.333% - 30px)", lg: "calc(33.333% - 50px)" }}
          flexBasis={{ base: "100%", md: "calc(33.333% - 30px)", lg: "calc(33.333% - 50px)" }}
        >
          <Image borderRadius="20px" src="education.png" />
          <Text
            fontSize={{ base: "md", md: "lg", lg: "xl" }}
            fontWeight={500}
            color="black"
            textAlign="center"
            mt="10px"
          >
            Education
          </Text>
        </Flex>
        <Flex
          padding="20px"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          maxW={{ base: "100%", md: "calc(33.333% - 30px)", lg: "calc(33.333% - 50px)" }}
          flexBasis={{ base: "100%", md: "calc(33.333% - 30px)", lg: "calc(33.333% - 50px)" }}
        >
          <Image borderRadius="20px" src="community.png" />
          <Text
            fontSize={{ base: "md", md: "lg", lg: "xl" }}
            fontWeight={500}
            color="black"
            textAlign="center"
            mt="10px"
          >
            Local Communities
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Categories;
