import { Button, Card, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";

const HeroSec = () => {
  return (
    <Flex
      flexDir={"column"}
      alignItems={"center"}
      textAlign={"center"}
      width={"full"}
      mt={{ base: "40px", md: "100px" }}
    >
      <Flex
        flexDir={"column"}
        textAlign={"center"}
        mb={{ base: "20px", md: "40px" }}
      >
        <Text
          fontSize={{ base: "3xl", md: "4xl", lg: "4xl" }}
          fontWeight={600}
          mb={{ base: "15px", md: "20px" }}
        >
          Make an impact to the world.
        </Text>
        <Text fontSize={{ base: "xl", md: "2xl", lg: "3xl" }} fontWeight={300}>
          We offer complete solution to launch your social movements.
        </Text>
      </Flex>

      <Flex
        flexDir={{ base: "column", md: "row" }}
        gap={{ base: "10px", md: "20px" }}
        width={"full"}
        position="relative"
        // justifyContent="center"
        // alignItems="center"
      >
        <Image
          src="hero.png"
          width={{ base: "100%", md: "auto" }}
          mb={{ base: "20px", md: 0 }}
          position="absolute"
        />{" "}
        
        <Image
          src="rectangle.png"
          width={{ base: "100%", md: "full" }}
          top={{ base: "20px", md: "initial" }}
          my={{ base: "10px", md: "initial" }}
          objectFit="cover"
        />
      </Flex>

      <Flex
        flexDir={"column"}
        alignItems={"center"}
        gap={{ base: "50px", md: "100px" }}
        mt={{ base: "20px", md: "40px" }}
      >
        <Text
          fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
          fontWeight={600}
          textAlign={"center"}
        >
          What We Have Achieved So Far
        </Text>
        <Flex
          flexDir={{ base: "column", md: "row" }}
          gap={{ base: "20px", md: "70px" }}
          justifyContent="center"
        >
          <Card
            p={"60px 60px"}
            bg={"#1DAA97"}
            borderRadius={"20px"}
            textAlign={"center"}
            minWidth={{ base: "150px", md: "200px" }} 
            _hover={{ boxShadow: 'lg', transform: 'scale(1.05)' }} // Add hover effect
        transition="transform 0.2s, box-shadow 0.2s"
          >
            <Text
              fontSize={{ base: "xl", md: "3xl", lg: "4xl" }}
              fontWeight={700}
            >
              109
            </Text>
            <span className="text3">Donors</span>
          </Card>
          <Card
             p={"60px 60px"}
            bg={"#1DAA97"}
            borderRadius={"20px"}
            textAlign={"center"}
            minWidth={{ base: "150px", md: "200px" }}
            _hover={{ boxShadow: 'lg', transform: 'scale(1.05)' }} // Add hover effect
        transition="transform 0.2s, box-shadow 0.2s"
          >
            <Text
              fontSize={{ base: "xl", md: "3xl", lg: "4xl" }}
              fontWeight={700}
              textAlign={"center"}
            >
              4
            </Text>
            <span className="text3">Projects</span>
          </Card>
          <Card
           p={"60px 60px"}
            bg={"#1DAA97"}
            borderRadius={"20px"}
            textAlign={"center"}
            minWidth={{ base: "150px", md: "200px" }}
            _hover={{ boxShadow: 'lg', transform: 'scale(1.05)' }} // Add hover effect
        transition="transform 0.2s, box-shadow 0.2s"
            
          >
            <Text
              fontSize={{ base: "xl", md: "3xl", lg: "4xl" }}
              fontWeight={700}
              textAlign={"center"}
            >
              $90m
            </Text>
            <span className="text3">Dollars</span>
          </Card>
          <Card
            p={"60px 60px"}
            bg={"#1DAA97"}
            borderRadius={"20px"}
            textAlign={"center"}
            minWidth={{ base: "150px", md: "200px" }}
            _hover={{ boxShadow: 'lg', transform: 'scale(1.05)' }} // Add hover effect
        transition="transform 0.2s, box-shadow 0.2s"
          >
            <Text
              fontSize={{ base: "xl", md: "3xl", lg: "4xl" }}
              fontWeight={700}
              textAlign={"center"}
            >
              2
            </Text>
            <span className="text3">Countries</span>
          </Card>
        </Flex>
      </Flex>
      <Flex pl={"60px"} gap={"100px"} flexDir={"column"} mt={"50px"}>
        <Text
          fontSize={{ base: "xl", md: "3xl", lg: "3xl" }}
          fontWeight={600}
          textAlign={"center"}
        >
          Start your campaign today
        </Text>

        <Flex flexDir={"row"} gap={"200px"}>
          <Flex flexDir={"column"} gap={"50px"}  >
            <Flex>
              <Image height={"50px"} width={"50px"} src="Manage Campaign.png" />
              <Text
                ml={5}
                fontSize={{ base: "l", md: "l", lg: "2xl" }}
                fontWeight={600}
              >
                Manage your campaigns <br />
                <span className="text2">
                  Track how many people signed the petition by week, month,
                  year.
                </span>
              </Text>
            </Flex>
            <Flex>
              <Image
                height={"50px"}
                width={"50px"}
                src="collect donation.png"
                
              />
              <Text
                ml={5}
                fontSize={{ base: "l", md: "l", lg: "2xl" }}
                fontWeight={600}
              >
                Collecting donation <br />
                <span className="text2">
                  Campaign owners can set up donations to receive donations from
                  supporters.
                </span>
              </Text>
            </Flex>
            <Flex>
              <Image
                height={"50px"}
                width={"50px"}
                src="export signature.png"
              />
              <Text
                ml={5}
                fontSize={{ base: "l", md: "l", lg: "2xl" }}
                fontWeight={600}
              >
                Export Signature <br />
                <span className="text2">
                  Download the signatures of supporters and submit to the
                  decision makers.
                </span>
              </Text>
            </Flex>
          </Flex>

          <Flex>
            <Image   display={{base:"none", md:"block"}} src="todayicon.png" />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default HeroSec;