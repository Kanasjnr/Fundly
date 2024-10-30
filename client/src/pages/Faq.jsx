import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Image,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { FiMinus } from "react-icons/fi";
import { IoAdd } from "react-icons/io5";
import NavBar from "../components/Home/Nav";
import Footer from "../components/Home/Footer";

const Faq = () => {
  return (
    <>
      <NavBar position={"sticky"} zIndex={9999} top={0} />

      <Flex
        flexDirection={{ base: "column", md: "row" }}
        padding={{ base: "20px", md: "40px" }}
      >
        <Flex
          alignItems={"center"}
          width={"full"}
          justifyContent={"space-between"}
          pt={{ base: "20px", md: "70px" }}
          flexDirection={{ base: "column", md: "row" }}
        >
          <Flex
            alignItems={{ base: "center", md: "flex-start" }}
            gap={"10px"}
            flexDirection={"column"}
            textAlign={{ base: "center", md: "left" }}
            marginRight={{ base: 0, md: "20px" }}
            mb={{ base: "30px", md: "20px" }}
          >
            <Text
              fontSize={{ base: "3xl", md: "3xl", lg: "4xl" }}
              fontWeight={700}
            >
              The answers for your question
            </Text>
            <span className="text4">
              Here is a collection of frequently asked questions from users
            </span>
            <Button
              width={{ base: "full", md: "200px" }}
              bg={"#1DAA97"}
              borderRadius={"12px"}
              height={"40px"}
              _hover={{ bg: "#1D8E80" }}
            >
              Ask a question
            </Button>
          </Flex>
          <Image
            src="FAQ.png"
            w={{ base: "100%", md: "auto" }}
            h={{ base: "auto", md: "500px" }}
            objectFit="contain"
          />
        </Flex>
      </Flex>

      <Flex
        mt={"100px"}
        alignItems={"center"}
        gap={"50px"}
        textAlign={"center"}
        justifyContent={"center"}
        flexDirection={{ base: "column", md: "row" }}
      >
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Text
            fontSize={{ base: "3xl", md: "3xl", lg: "4xl" }}
            fontWeight={600}
          >
            General questions
          </Text>
          <Flex
            justifyContent={"center"}
            align={"center"}
            py={{ base: 8, md: 70 }}
            px={{ base: 8, md: 72 }}
          >
            <Flex justifyContent={"center"} alignItems={"center"} p={"auto"}>
              <Accordion defaultIndex={[0]} allowMultiple>
                <AccordionItem
                  bg={"#fff"}
                  boxShadow={"0px 6px 16px 0px rgba(74, 58, 255, 0.19)"}
                  borderRadius={10}
                  width={{ base: "90%", md: "auto" }}
                  mb={4}
                >
                  {({ isExpanded }) => (
                    <>
                      <h2>
                        <AccordionButton>
                          <Box
                            flex="1"
                            textAlign="left"
                            pr={{ base: 8, md: 15 }}
                            fontWeight={{ base: 550, md: 500 }}
                            fontSize={{ base: "md", md: "lg", lg: "2xl" }}
                          >
                            Unsubscribe or Update email Notification Settings
                          </Box>
                          {isExpanded ? (
                            <Box borderRadius={"full"} bg={"#2970FF"}>
                              <FiMinus color="#fff" size={20} />
                            </Box>
                          ) : (
                            <Box borderRadius={"full"} bg={"#2970FF"}>
                              <IoAdd color="#fff" size={20} />
                            </Box>
                          )}
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <span className="text1">
                          Hates inbox clutter as much as you do. You can easily
                          choose when you get an email from us by visiting
                          Unsubscribe after logging into your account. You can
                          also manage your email settings, or unsubscribe, from
                          the links at the bottom of the latest received email.
                        </span>
                      </AccordionPanel>
                    </>
                  )}
                </AccordionItem>
                <AccordionItem
                  bg={"#fff"}
                  boxShadow={"0px 6px 16px 0px rgba(74, 58, 255, 0.19)"}
                  borderRadius={10}
                  width={{ base: "90%", md: "auto" }}
                  mb={4}
                >
                  {({ isExpanded }) => (
                    <>
                      <h2>
                        <AccordionButton>
                          <Box
                            flex="1"
                            textAlign="left"
                            pr={{ base: 8, md: 15 }}
                            fontWeight={{ base: 550, md: 500 }}
                            fontSize={{ base: "md", md: "lg", lg: "2xl" }}
                          >
                            Promoted Petitions FAQs
                          </Box>
                          {isExpanded ? (
                            <Box borderRadius={"full"} bg={"#2970FF"}>
                              <FiMinus color="#fff" size={20} />
                            </Box>
                          ) : (
                            <Box borderRadius={"full"} bg={"#2970FF"}>
                              <IoAdd color="#fff" size={20} />
                            </Box>
                          )}
                        </AccordionButton>
                      </h2>
                      <AccordionPanel>
                        <span className="text1">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Officiis harum quo eligendi sequi reprehenderit
                          beatae quibusdam error nam maxime, necessitatibus sunt
                          debitis nostrum quisquam magni eos corrupti optio quam
                          cumque!
                        </span>
                      </AccordionPanel>
                    </>
                  )}
                </AccordionItem>

                <AccordionItem
                  bg={"#fff"}
                  boxShadow={"0px 6px 16px 0px rgba(74, 58, 255, 0.19)"}
                  borderRadius={10}
                  width={{ base: "90%", md: "auto" }}
                  mb={4}
                >
                  {({ isExpanded }) => (
                    <>
                      <h2>
                        <AccordionButton>
                          <Box
                            flex="1"
                            textAlign="left"
                            pr={{ base: 8, md: 15 }}
                            fontWeight={{ base: 550, md: 500 }}
                            fontSize={{ base: "md", md: "lg", lg: "2xl" }}
                          >
                            I forgot my password. What do I do?
                          </Box>
                          {isExpanded ? (
                            <Box borderRadius={"full"} bg={"#2970FF"}>
                              <FiMinus color="#fff" size={20} />
                            </Box>
                          ) : (
                            <Box borderRadius={"full"} bg={"#2970FF"}>
                              <IoAdd color="#fff" size={20} />
                            </Box>
                          )}
                        </AccordionButton>
                      </h2>
                      <AccordionPanel>
                        <span className="text1">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Officiis harum quo eligendi sequi reprehenderit
                          beatae quibusdam error nam maxime, necessitatibus sunt
                          debitis nostrum quisquam magni eos corrupti optio quam
                          cumque!
                        </span>
                      </AccordionPanel>
                    </>
                  )}
                </AccordionItem>

                <AccordionItem
                  bg={"#fff"}
                  boxShadow={"0px 6px 16px 0px rgba(74, 58, 255, 0.19)"}
                  borderRadius={10}
                  width={{ base: "90%", md: "auto" }}
                  mb={4}
                >
                  {({ isExpanded }) => (
                    <>
                      <h2>
                        <AccordionButton>
                          <Box
                            flex="1"
                            textAlign="left"
                            pr={{ base: 8, md: 15 }}
                            fontWeight={{ base: 550, md: 500 }}
                            fontSize={{ base: "md", md: "lg", lg: "2xl" }}
                          >
                            How to Report Content
                          </Box>
                          {isExpanded ? (
                            <Box borderRadius={"full"} bg={"#2970FF"}>
                              <FiMinus color="#fff" size={20} />
                            </Box>
                          ) : (
                            <Box borderRadius={"full"} bg={"#2970FF"}>
                              <IoAdd color="#fff" size={20} />
                            </Box>
                          )}
                        </AccordionButton>
                      </h2>
                      <AccordionPanel>
                        <span className="text1">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Officiis harum quo eligendi sequi reprehenderit
                          beatae quibusdam error nam maxime, necessitatibus sunt
                          debitis nostrum quisquam magni eos corrupti optio quam
                          cumque!
                        </span>
                      </AccordionPanel>
                    </>
                  )}
                </AccordionItem>
              </Accordion>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex flexDirection={{ base: "column-reverse", md: "row" }}>
        <Flex
          bg={"#F5EFE0"}
          width={"full"}
          justifyContent={"space-between"}
          alignItems={"center"}
          borderRadius={"10px"}
          mb={10}
          mt={"20px"}
          height={"400px"}
          flexDirection={{ base: "column", md: "row" }}
        >
          <Flex
            flexDirection={"column"}
            alignItems={{ base: "center", md: "flex-start" }}
            ml={{ base: "20px", md: "20px" }}
            gap={"14px"}
            justifyContent={"center"}
            textAlign={{ base: "center", md: "left" }}
          >
            <Text
              fontWeight={{ base: 500, md: 600 }}
              fontSize={{ base: "md", md: "lg", lg: "3xl" }}
            >
              No question I need here?
            </Text>
            <span className="text4">
              Can’t find the question you need, contact us for your new
              question.
            </span>
          </Flex>
          <Image src="Questions.png" w={{ base: "100%", md: "auto" }} />
        </Flex>
      </Flex>
      <Footer />
    </>
  );
};

export default Faq;
