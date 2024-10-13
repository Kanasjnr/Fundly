import React from "react";
import { Box, Text } from "@chakra-ui/react";

const CountBox = ({ title, value }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="full"
      bg="#1DAA97"
      roundedTop="15px"
      h="auto"
    >
      <Text
        fontSize="30px"
        fontWeight="bold"
        color="white"
        p="3"
        roundedTop="15px"
        w="full"
        textAlign="center"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {value}
      </Text>
      <Text
        fontSize="16px"
        fontWeight="semibold"
        color="#1c1c1c"
        bg="white"
        px="3"
        py="2"
        w="full"
        roundedBottom="15px"
        textAlign="center"
      >
        {title}
      </Text>
    </Box>
  );
};

export default CountBox;
