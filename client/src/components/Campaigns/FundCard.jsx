import React from "react";
import { Box, Image, Text, Flex } from "@chakra-ui/react";

import { daysLeft } from "../../utils";

const FundCard = ({
  owner,
  title,
  description,
  target,
  deadline,
  amountCollected,
  image,
  // category,
  handleClick,
}) => {
  const remainingDays = daysLeft(deadline);

  return (
    <Box
      cursor="pointer" 
      marginLeft="25px"
      marginTop="30px"
      w="full"
      maxW="288px"
      rounded="15px"
      bg="#1c1c24"
      _hover={{ boxShadow: "0 0 10px rgba(0,0,0,0.3)" }}
      onClick={handleClick} // Call handleClick directly
    >
      <Image
        src={image}
        alt="fund"
        w="full"
        h="158px"
        objectFit="cover"
        rounded="10px"
      />

      <Box p="4">
        <Flex flexDir="column" mb="18px">
        
          <Text
            ml="12px"
            mt="2px"
            fontWeight="medium"
            fontSize="12px"
            color="#808191"
          >
            charity
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
            {title}
          </Text>
          <Text
            mt="5px"
            fontSize="normal"
            color="#808191"
            textAlign="left"
            lineHeight="18px"
            isTruncated
          >
            {description}
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
              {amountCollected}
            </Text>
            <Text
              mt="3px"
              fontSize="12px"
              color="#808191"
              lineHeight="18px"
              maxW="120px"
              isTruncated
            >
              Raised of {target}
            </Text>
          </Box>
          <Box flexDir="column">
            <Text
              fontWeight="semibold"
              fontSize="14px"
              color="#b2b3bd"
              lineHeight="22px"
            >
              {remainingDays === 0
                ? "0 days left"
                : `${remainingDays} days left`}
            </Text>
            <Text
              mt="3px"
              fontSize="12px"
              color="#808191"
              lineHeight="18px"
              maxW="120px"
              isTruncated
            >
              Completed
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
              {owner}
            </Text>
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default FundCard;