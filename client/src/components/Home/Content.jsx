import { Card, Flex, Image, Text, Box } from "@chakra-ui/react";
import React from "react";

const Content = () => {
  return (
    <Flex
      mt={70}
      alignItems="center"
      justifyContent="center"
      gap={10}
      flexDirection="column"
      px={{ base: 4, md: 8 }}
    >
      <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight={600} textAlign="center">
        Get started in a few minutes
      </Text>
      <Flex
        pt={{ base: "20px", md: "42px" }}
        flexWrap="wrap"
        justifyContent="center"
        gap={{ base: "20px", md: "40px", lg: "80px" }}
      >
        <Flex alignItems="center" justifyContent="center">
          <Card
            alignItems="center"
            justifyContent="center"
            p="20px"
            boxShadow="0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
            width="280px"
            height="auto"
            gap={5}
            borderRadius="20px"
            textAlign="center"
            _hover={{ boxShadow: 'lg', transform: 'scale(1.05)' }} // Add hover effect
        transition="transform 0.2s, box-shadow 0.2s"
          >
            <Image width="50px" height="50px" src="volunteer.png" />
            <Text fontSize={{ base: "md", md: "lg", lg: "xl" }} fontWeight={750}>
              Become a Volunteer
            </Text>
            <Box fontSize={{ base: "sm", md: "md" }}>
              Worem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
            </Box>
          </Card>
        </Flex>
        <Flex alignItems="center" justifyContent="center">
          <Card
            alignItems="center"
            justifyContent="center"
            p="20px"
            boxShadow="0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
            width="280px"
            height="auto"
            gap={5}
            borderRadius="20px"
            textAlign="center"
            _hover={{ boxShadow: 'lg', transform: 'scale(1.05)' }} // Add hover effect
        transition="transform 0.2s, box-shadow 0.2s"
          >
            <Image width="50px" height="50px" src="fundraising.png" />
            <Text fontSize={{ base: "md", md: "lg", lg: "xl" }} fontWeight={750}>
              Quick Fundraising
            </Text>
            <Box fontSize={{ base: "sm", md: "md" }}>
              Worem ipsum dolor sit amet, consectetur adipiscing elit.
            </Box>
          </Card>
        </Flex>
        <Flex alignItems="center" justifyContent="center">
          <Card
            alignItems="center"
            justifyContent="center"
            p="20px"
            boxShadow="0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
            width="280px"
            height="auto"
            gap={5}
            borderRadius="20px"
            textAlign="center"
            _hover={{ boxShadow: 'lg', transform: 'scale(1.05)' }} // Add hover effect
        transition="transform 0.2s, box-shadow 0.2s"
          >
            <Image width="50px" height="50px" src="donating.png" />
            <Text fontSize={{ base: "md", md: "lg", lg: "xl" }} fontWeight={750}>
              Start Donating
            </Text>
            <Box fontSize={{ base: "sm", md: "md" }}>
              Worem ipsum dolor sit amet, consectetur adipiscing elit.
            </Box>
          </Card>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Content;
