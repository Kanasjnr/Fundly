import React, { useState } from "react";
import { Card, Flex, Image, Text, Box, Button } from "@chakra-ui/react";

function HotProjects() {
  return (
    <Flex
      mt={70}
      alignItems="center"
      justifyContent="center"
      gap={100}
      flexDirection="column"
    >
      <Text fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }} fontWeight={600}>
        Hot Projects
      </Text>
      <Flex
        gap={"40px"}
        flexDirection={{ base: "column", md: "row" }}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box
          ml={"25px"}
          mt={"30px"}
          cursor={"pointer"}
          w="full"
          maxW="288px"
          rounded="15px"
          bg="#1c1c24"
          _hover={{ boxShadow: "0 0 10px rgba(0,0,0,0.3)" }}
        >
          <Image
            src={"disabilities.png"}
            alt="fund"
            w="full"
            h="158px"
            objectFit="cover"
            rounded="10px"
          />
          <Box p={"4px"}>
            <Flex flexDir="column" mb="18px">
              {/* <Image
                src={"type.svg"}
                alt="tag"
                w="17px"
                h="17px"
                objectFit="contain"
              /> */}
              <Text
                ml="12px"
                mt="2px"
                fontWeight="medium"
                fontSize="12px"
                color="#808191"
              >
                Disability
              </Text>
            </Flex>
            <Box>
              <Text
                fontWeight="semibold"
                fontSize="16px"
                color="white"
                textAlign="left"
                lineHeight="26px"
                isTruncated
              >
                hello
              </Text>
              <Text
                mt="5px"
                fontSize="normal"
                color="#808191"
                textAlign="left"
                lineHeight="18px"
                isTruncated
              >
                hello
              </Text>
            </Box>
            <Flex justify="space-between" flexWrap="wrap" mt="15px" gap="2">
              <Box flexDir="column">
                <Text
                  fontWeight="semibold"
                  fontSize="14px"
                  color="#b2b3bd"
                  lineHeight="22px"
                >
                  $100
                </Text>
                <Text
                  mt="3px"
                  fontSize="12px"
                  color="#808191"
                  lineHeight="18px"
                  maxW="120px"
                  isTruncated
                >
                  Raised of $300
                </Text>
              </Box>
              <Box flexDir="column">
                <Text
                  fontWeight="semibold"
                  fontSize="14px"
                  color="#b2b3bd"
                  lineHeight="22px"
                >
                  70
                </Text>
                <Text
                  mt="3px"
                  fontSize="12px"
                  color="#808191"
                  lineHeight="18px"
                  maxW="120px"
                  isTruncated
                >
                  days Left
                </Text>
              </Box>
            </Flex>
            <Flex align="center" mt="20px" gap="12px">
              <Box
                w="30px"
                h="30px"
                rounded="full"
                flex="justify-center"
                items="center"
                bg="#13131a"
              >
                <Image
                  src={"thirdweb.png"}
                  alt="user"
                  w="50%"
                  h="50%"
                  objectFit="contain"
                />
              </Box>
              <Text flex="1" fontSize="12px" color="#808191" isTruncated>
                by{" "}
                <Text as="span" color="#b2b3bd">
                  0xA667C6695A864c753274D1e26b1F8CF9227A3781
                </Text>
              </Text>
            </Flex>
          </Box>
        </Box>
        <Box
          ml={"25px"}
          mt={"30px"}
          cursor={"pointer"}
          w="full"
          maxW="288px"
          rounded="15px"
          bg="#1c1c24"
          _hover={{ boxShadow: "0 0 10px rgba(0,0,0,0.3)" }}
        >
          <Image
            src={"Charity.png"}
            alt="fund"
            w="full"
            h="158px"
            objectFit="cover"
            rounded="10px"
          />
          <Box p={"4px"}>
            <Flex flexDir="column" mb="18px">
              {/* <Image
                src={"type.svg"}
                alt="tag"
                w="17px"
                h="17px"
                objectFit="contain"
              /> */}
              <Text
                ml="12px"
                mt="2px"
                fontWeight="medium"
                fontSize="12px"
                color="#808191"
              >
                Charity
              </Text>
            </Flex>
            <Box>
              <Text
                fontWeight="semibold"
                fontSize="16px"
                color="white"
                textAlign="left"
                lineHeight="26px"
                isTruncated
              >
                hello
              </Text>
              <Text
                mt="5px"
                fontSize="normal"
                color="#808191"
                textAlign="left"
                lineHeight="18px"
                isTruncated
              >
                hello
              </Text>
            </Box>
            <Flex justify="space-between" flexWrap="wrap" mt="15px" gap="2">
              <Box flexDir="column">
                <Text
                  fontWeight="semibold"
                  fontSize="14px"
                  color="#b2b3bd"
                  lineHeight="22px"
                >
                  $100
                </Text>
                <Text
                  mt="3px"
                  fontSize="12px"
                  color="#808191"
                  lineHeight="18px"
                  maxW="120px"
                  isTruncated
                >
                  Raised of $300
                </Text>
              </Box>
              <Box flexDir="column">
                <Text
                  fontWeight="semibold"
                  fontSize="14px"
                  color="#b2b3bd"
                  lineHeight="22px"
                >
                  120
                </Text>
                <Text
                  mt="3px"
                  fontSize="12px"
                  color="#808191"
                  lineHeight="18px"
                  maxW="120px"
                  isTruncated
                >
                  Days Left
                </Text>
              </Box>
            </Flex>
            <Flex align="center" mt="20px" gap="12px">
              <Box
                w="30px"
                h="30px"
                rounded="full"
                flex="justify-center"
                items="center"
                bg="#13131a"
              >
                <Image
                  src={"thirdweb.png"}
                  alt="user"
                  w="50%"
                  h="50%"
                  objectFit="contain"
                />
              </Box>
              <Text flex="1" fontSize="12px" color="#808191" isTruncated>
                by{" "}
                <Text as="span" color="#b2b3bd">
                  0xA667C6695A864c753274D1e26b1F8CF9227A3781
                </Text>
              </Text>
            </Flex>
          </Box>
        </Box>
        <Box
          ml={"25px"}
          mt={"30px"}
          cursor={"pointer"}
          w="full"
          maxW="288px"
          rounded="15px"
          bg="#1c1c24"
          _hover={{ boxShadow: "0 0 10px rgba(0,0,0,0.3)" }}
        >
          <Image
            src={"education.png"}
            alt="fund"
            w="full"
            h="158px"
            objectFit="cover"
            rounded="10px"
          />
          <Box p={"4px"}>
            <Flex flexDir="column" mb="18px">
              {/* <Image
                src={"type.svg"}
                alt="tag"
                w="17px"
                h="17px"
                objectFit="contain"
              /> */}
              <Text
                ml="12px"
                mt="2px"
                fontWeight="medium"
                fontSize="12px"
                color="#808191"
              >
                Education
              </Text>
            </Flex>
            <Box>
              <Text
                fontWeight="semibold"
                fontSize="16px"
                color="white"
                textAlign="left"
                lineHeight="26px"
                isTruncated
              >
                hello
              </Text>
              <Text
                mt="5px"
                fontSize="normal"
                color="#808191"
                textAlign="left"
                lineHeight="18px"
                isTruncated
              >
                hello
              </Text>
            </Box>
            <Flex justify="space-between" flexWrap="wrap" mt="15px" gap="2">
              <Box flexDir="column">
                <Text
                  fontWeight="semibold"
                  fontSize="14px"
                  color="#b2b3bd"
                  lineHeight="22px"
                >
                  $100
                </Text>
                <Text
                  mt="3px"
                  fontSize="12px"
                  color="#808191"
                  lineHeight="18px"
                  maxW="120px"
                  isTruncated
                >
                  Raised of $300
                </Text>
              </Box>
              <Box flexDir="column">
                <Text
                  fontWeight="semibold"
                  fontSize="14px"
                  color="#b2b3bd"
                  lineHeight="22px"
                >
                  33
                </Text>
                <Text
                  mt="3px"
                  fontSize="12px"
                  color="#808191"
                  lineHeight="18px"
                  maxW="120px"
                  isTruncated
                >
                  Days Left
                </Text>
              </Box>
            </Flex>
            <Flex align="center" mt="20px" gap="12px">
              <Box
                w="30px"
                h="30px"
                rounded="full"
                flex="justify-center"
                items="center"
                bg="#13131a"
              >
                <Image
                  src={"thirdweb.png"}
                  alt="user"
                  w="50%"
                  h="50%"
                  objectFit="contain"
                />
              </Box>
              <Text flex="1" fontSize="12px" color="#808191" isTruncated>
                by{" "}
                <Text as="span" color="#b2b3bd">
                  0xA667C6695A864c753274D1e26b1F8CF9227A3781
                </Text>
              </Text>
            </Flex>
          </Box>
        </Box>
        <Box
          ml={"25px"}
          mt={"30px"}
          cursor={"pointer"}
          w="full"
          maxW="288px"
          rounded="15px"
          bg="#1c1c24"
          _hover={{ boxShadow: "0 0 10px rgba(0,0,0,0.3)" }}
        >
          <Image
            src={"health and medical.png"}
            alt="fund"
            w="full"
            h="158px"
            objectFit="cover"
            rounded="10px"
          />
          <Box p={"4px"}>
            <Flex flexDir="column" mb="18px">
              {/* <Image
                src={"type.svg"}
                alt="tag"
                w="17px"
                h="17px"
                objectFit="contain"
              /> */}
              <Text
                ml="12px"
                mt="2px"
                fontWeight="medium"
                fontSize="12px"
                color="#808191"
              >
                Health
              </Text>
            </Flex>
            <Box>
              <Text
                fontWeight="semibold"
                fontSize="16px"
                color="white"
                textAlign="left"
                lineHeight="26px"
                isTruncated
              >
                hello
              </Text>
              <Text
                mt="5px"
                fontSize="normal"
                color="#808191"
                textAlign="left"
                lineHeight="18px"
                isTruncated
              >
                hello
              </Text>
            </Box>
            <Flex justify="space-between" flexWrap="wrap" mt="15px" gap="2">
              <Box flexDir="column">
                <Text
                  fontWeight="semibold"
                  fontSize="14px"
                  color="#b2b3bd"
                  lineHeight="22px"
                >
                  $100
                </Text>
                <Text
                  mt="3px"
                  fontSize="12px"
                  color="#808191"
                  lineHeight="18px"
                  maxW="120px"
                  isTruncated
                >
                  Raised of $300
                </Text>
              </Box>
              <Box flexDir="column">
                <Text
                  fontWeight="semibold"
                  fontSize="14px"
                  color="#b2b3bd"
                  lineHeight="22px"
                >
                  12
                </Text>
                <Text
                  mt="3px"
                  fontSize="12px"
                  color="#808191"
                  lineHeight="18px"
                  maxW="120px"
                  isTruncated
                >
                  Days Left
                </Text>
              </Box>
            </Flex>
            <Flex align="center" mt="20px" gap="12px">
              <Box
                w="30px"
                h="30px"
                rounded="full"
                flex="justify-center"
                items="center"
                bg="#13131a"
              >
                <Image
                  src={"thirdweb.png"}
                  alt="user"
                  w="50%"
                  h="50%"
                  objectFit="contain"
                />
              </Box>
              <Text flex="1" fontSize="12px" color="#808191" isTruncated>
                by{" "}
                <Text as="span" color="#b2b3bd">
                  0xA667C6695A864c753274D1e26b1F8CF9227A3781
                </Text>
              </Text>
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
}

export default HotProjects;
