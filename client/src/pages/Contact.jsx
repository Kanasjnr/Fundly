import React from "react";
import Nav from "../components/Home/Nav";
import {
  Box,
  Button,
  Card,
  Flex,
  Image,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import Footer from "../components/Home/Footer";

const Contact = () => {
  return (
    <>
      <Nav position={"sticky"} zIndex={9999} top={0} />
      <VStack bg={"#FFF"} spacing={10} px={{ base: 4, md: 8, lg: 16 }}>
        <Flex
          justifyContent={"space-between"}
          pt={"100px"}
          width={"100%"}
          flexWrap="wrap"
        >
          <Flex flex={1} flexDirection={"column"} gap={8}>
            <Text fontSize={{ base: "3xl", md: "3xl", lg: "4xl" }} fontWeight={600}>
              Hola, What’s up?
            </Text>
            <Text fontSize={{ base: "l", md: "l", lg: "xl" }} fontWeight={400}>
              Qorem ipsum dolor sit amet, consectetur adipiscing elit. <br />{" "}
              Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
            </Text>
            <Flex flexDirection={"column"} gap={"40px"}>
              <Flex alignItems="center">
                <Image src="address.png" />
                <Text fontSize={{ base: "sm", md: "20px" }} fontWeight={600} ml={2}>
                  Address <br />
                  <span className="text">
                    Jorem ipsum dolor sit amet, consectetur
                  </span>
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Image src="email.png" />
                <Text fontSize={{ base: "sm", md: "20px" }} fontWeight={600} ml={2}>
                  Email <br />
                  <span className="text">Fundly@gmail.com</span>
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Image src="phone number.png" />
                <Text fontSize={{ base: "sm", md: "20px" }} fontWeight={600} ml={2}>
                  Phone Number <br />
                  <span className="text">+234 7055561191</span>
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex flex={1} justifyContent="center">
            <Image
              display={{ base: "none", md: "block" }}
              height="590px"
              maxWidth="90%"
              src="contact.png"
              alt="Contact"
            />
          </Flex>
        </Flex>

        <Flex flexDirection={"column"} mt={70} alignItems="center" width="100%">
          <Text fontSize={{ base: "sm", md: "5xl" }} fontWeight={600}>
            Got A Question?
          </Text>
          <Text className="text">Contact one of our departments to solve your problem.</Text>
          <Flex
            flexDirection={{ base: "column", md: "row" }}
            gap={10}
            mt={20}
            justifyContent="center"
            alignItems="center"
            width="100%"
            
          >
            <Card
              alignItems={"center"}
              justifyContent={"center"}
              p={{ base: 4, md: 6 }}
              boxShadow={"0px 4px 4px 0px rgba(0, 0, 0, 0.25)"}
              width={{ base: "90%", md: "100%" }}
              maxWidth={{ base: "250px", md: "none" }}
              gap={5}
              borderRadius={"15px"}
              _hover={{ boxShadow: 'lg', transform: 'scale(1.05)' }} // Add hover effect
        transition="transform 0.2s, box-shadow 0.2s"
            >
              <Image width={"90px"} height={"90px"} src="support.png" />
              <Text fontSize={{ base: "3xl", md: "3xl", lg: "3xl" }} fontWeight={700}>
                Support
              </Text>
              <span className="text">We’re here to answer any questions about our product</span>
            </Card>
            <Card
              alignItems={"center"}
              justifyContent={"center"}
              p={{ base: 4, md: 6 }}
              boxShadow={"0px 4px 4px 0px rgba(0, 0, 0, 0.25)"}
              width={{ base: "90%", md: "100%" }}
              maxWidth={{ base: "250px", md: "none" }}
              gap={5}
              borderRadius={"15px"}
              _hover={{ boxShadow: 'lg', transform: 'scale(1.05)' }} // Add hover effect
        transition="transform 0.2s, box-shadow 0.2s"
            >
              <Image width={"90px"} height={"90px"} src="media.png" />
              <Text fontSize={{ base: "3xl", md: "3xl", lg: "3xl" }} fontWeight={700}>
                Media
              </Text>
              <span className="text">Get our news, info, and media resources</span>
            </Card>
            <Card
              alignItems={"center"}
              justifyContent={"center"}
              p={{ base: 4, md: 6 }}
              boxShadow={"0px 4px 4px 0px rgba(0, 0, 0, 0.25)"}
              width={{ base: "90%", md: "100%" }}
              maxWidth={{ base: "250px", md: "none" }}
              gap={5}
              borderRadius={"15px"}
              _hover={{ boxShadow: 'lg', transform: 'scale(1.05)' }} // Add hover effect
        transition="transform 0.2s, box-shadow 0.2s"
            >
              <Image width={"90px"} height={"90px"} src="payment.png" />
              <Text fontSize={{ base: "3xl", md: "3xl", lg: "3xl" }} fontWeight={700}>
                Payment
              </Text>
              <span className="text">Let's talk about how we can work together</span>
            </Card>
          </Flex>
        </Flex>

        <Box
          w={{ base: "100%", md: "50%", lg: "60%" }}
          mx="auto"
          mt={10}
          pb={{ base: 10, md: 15, lg: 10 }}
        >
          <Flex flexDirection="column" alignItems="center">
            <Text fontSize={{ base: "3xl", md: "3xl", lg: "3xl" }} fontWeight={600}>
              Send Us A Message
            </Text>
            <Text className="text" mb={5}>
              We would love to hear from you!
            </Text>
          </Flex>
          <Flex flexDirection="column" gap={5}>
            <Input
              type="text"
              placeholder="First name"
              size="lg"
              mb={{ base: "20px", md: 5 }}
            />
            <Input
              type="text"
              placeholder="Last name"
              size="lg"
              mb={{ base: "20px", md: 5 }}
            />
            <Input
              type="email"
              placeholder="Email"
              size="lg"
              mb={{ base: "20px", md: 5 }}
            />
            <Input
              type="text"
              placeholder="Phone number"
              size="lg"
              mb={{ base: "20px", md: 5 }}
            />
            <Textarea
              placeholder="Your message"
              size="lg"
              mb={{ base: "20px", md: 5 }}
            />
            <Button
              bg={"#1DAA97"}
              color={"#f5f5f5"}
              _hover={{ bg: "#1D8E80" }}
              size="lg"
              borderRadius={"8px"}
            >
              Send Message
            </Button>
          </Flex>
        </Box>
      </VStack>
      <Footer />
    </>
  );
};

export default Contact;










