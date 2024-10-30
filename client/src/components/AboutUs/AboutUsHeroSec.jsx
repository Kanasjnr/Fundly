import { Card, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";

const AboutUsHeroSec = () => {
  return (
    <>
      <Flex width={"auto"}>
        <Flex
          height={{ base: "auto", md: "750px" }}
          bg={"#1DAA97"}
          width={"full"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={"20px"}
          mt={40}
        >
          <Flex textAlign={"center"} flexDir={"column"} gap={15} px={4}>
            <Text
              mt={{ base: "20px", md: "40px" }}
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              fontWeight={600}
            >
              World’s Petition Platform
            </Text>
            <Text className="text">
              Morem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
              vulputate libero et velit interdum, ac aliquet odio mattis.
            </Text>

            <Image
              width={{ base: "full", md: "750px" }}
              height={{ base: "auto", md: "540px" }}
              mt={{ base: "20px", md: "40px" }}
              justifyContent={"center"}
              alignItems={"center"}
              src="About.png"
              objectFit="contain"
            />
          </Flex>
        </Flex>
      </Flex>
      <Flex
        flexDirection={"column"}
        mt={{ base: "40px", md: "70px" }}
        alignItems={"center"}
        justifyContent={"center"}
        px={4}
      >
        <Flex flexDirection={"column"} gap={"30px"} mx={"30px"} mb={"40px"}>
          <Text
            textAlign={"center"}
            fontSize={{ base: "xl", md: "xl", lg: "3xl" }}
            fontWeight={750}
          >
            Who uses This Platform?
          </Text>
          <Text className="text">
            We believe that when everyone speaks out the problem of society and
            action together, the world will become a better place.
          </Text>
        </Flex>

        <Flex
          pt={{ base: "20px", md: "42px" }}
          alignItems={"flex-start"}
          gap={{ base: "20px", md: "30px" }}
          flexDirection={{ base: "column", md: "row" }}
        >
          <Card
            alignItems={"center"}
            justifyContent={"center"}
            p={"11px 28px 45px 28px"}
            boxShadow={"0px 4px 4px 0px rgba(0, 0, 0, 0.25)"}
            width={{ base: "200px", md: "280px" }}
            height={{ base: "auto", md: "280px" }}
            gap={5}
            borderRadius={"15px"}
            margin={{ md: "0 20px" }}
            _hover={{ boxShadow: 'lg', transform: 'scale(1.05)' }} // Add hover effect
        transition="transform 0.2s, box-shadow 0.2s"
          >
            <Image width={"80px"} height={"80px"} mt={3} src="Activies.png" />
            <Text
              fontSize={{ base: "l", md: "l", lg: "xl" }}
              fontWeight={750}
              textAlign={"center"}
            >
              Activists
            </Text>
            <Text className="text2">
              Social activists can start social movements and connect
              supporters in their communities.
            </Text>
          </Card>

          <Card
            alignItems={"center"}
            justifyContent={"center"}
            p={"11px 28px 45px 28px"}
            boxShadow={"0px 4px 4px 0px rgba(0, 0, 0, 0.25)"}
            width={{ base: "200px", md: "280px" }}
            height={{ base: "auto", md: "280px" }}
            gap={5}
            borderRadius={"15px"}
            margin={{ md: "0 20px" }}
            _hover={{ boxShadow: 'lg', transform: 'scale(1.05)' }} // Add hover effect
        transition="transform 0.2s, box-shadow 0.2s"
          >
            <Image width={"80px"} height={"80px"} mt={3} src="Legislators.png" />
            <Text
              fontSize={{ base: "xl", md: "2xl", lg: "xl" }}
              fontWeight={750}
              textAlign={"center"}
            >
              Legislators
            </Text>
            <Text className="text2">
              Decision-makers at the highest levels of government are engaging
              with their constituents.
            </Text>
          </Card>

          <Card
            alignItems={"center"}
            justifyContent={"center"}
            p={"11px 28px 45px 28px"}
            boxShadow={"0px 4px 4px 0px rgba(0, 0, 0, 0.25)"}
            width={{ base: "200px", md: "280px" }}
            height={{ base: "auto", md: "280px" }}
            gap={5}
            borderRadius={"15px"}
            margin={{ md: "0 20px" }}
            _hover={{ boxShadow: 'lg', transform: 'scale(1.05)' }} // Add hover effect
        transition="transform 0.2s, box-shadow 0.2s"
          >
            <Image
              width={"80px"}
              height={"80px"}
              mt={3}
              src="Organizations.png"
            />
            <Text
              fontSize={{ base: "l", md: "l", lg: "xl" }}
              fontWeight={750}
              textAlign={"center"}
            >
              Organizations
            </Text>
            <Text className="text2">
              Leading organizations are advancing their causes and mobilizing
              new supporters.
            </Text>
          </Card>

          <Card
            alignItems={"center"}
            justifyContent={"center"}
            p={"11px 28px 45px 28px"}
            boxShadow={"0px 4px 4px 0px rgba(0, 0, 0, 0.25)"}
            width={{ base: "200px", md: "280px" }}
            height={{ base: "auto", md: "280px" }}
            gap={5}
            borderRadius={"15px"}
            margin={{ md: "0 20px" }}
            _hover={{ boxShadow: 'lg', transform: 'scale(1.05)' }} // Add hover effect
        transition="transform 0.2s, box-shadow 0.2s"
          >
            <Image width={"80px"} height={"80px"} mt={3} src="Reporters.png" />
            <Text
              fontSize={{ base: "l", md: "l", lg: "xl" }}
              fontWeight={750}
              textAlign={"center"}
            >
              Reporters
            </Text>
            <Text className="text2">
              Journalists are sourcing powerful stories and covering campaigns
              hundreds of times a day.
            </Text>
          </Card>
        </Flex>

        <Flex
          mt={{ base: "70px", md: "40px" }}
          width={"full"}
          justifyContent={"center"}
          alignItems={"center"}
          px={4}
        >
          <Flex
            flexDirection={"column"}
            width={"full"}
            maxWidth={"1200px"}
            gap={20}
          >
            <Text
              fontSize={{ base: "xl", md: "xl", lg: "3xl" }}
              fontWeight={750}
              textAlign={"center"}
            >
              Our values
            </Text>
            <Flex gap={5} flexDirection={{ base: "column", md: "row" }}>
              <Flex flexDirection={{ base: "column", md: "column" }} gap={2}>
                <Text
                  fontSize={{ base: "l", md: "l", lg: "3xl" }}
                  fontWeight={700}
                >
                  01
                </Text>
                <Text className="text3">Make more value, not money.</Text>
                <Text className="text2">
                  We focus on creative and delivering value to people across the
                  world.
                </Text>
              </Flex>
              <Flex flexDirection={{ base: "column", md: "column" }} gap={2}>
                <Text
                  fontSize={{ base: "l", md: "l", lg: "3xl" }}
                  fontWeight={700}
                >
                  02
                </Text>
                <Text className="text3">Make it simple, not stressful.</Text>
                <Text className="text2">
                  We make everything simple, clearly and accessible to everyone.
                </Text>
              </Flex>
              <Flex flexDirection={{ base: "column", md: "column" }} gap={2}>
                <Text
                  fontSize={{ base: "l", md: "l", lg: "3xl" }}
                  fontWeight={700}
                >
                  03
                </Text>
                <Text className="text3">Be human, not devil.</Text>
                <Text className="text2">
                  We do the right things with love and sincerity to create
                  sustainability.
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default AboutUsHeroSec;
