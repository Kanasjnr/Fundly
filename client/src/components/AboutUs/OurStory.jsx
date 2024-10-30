import { Flex, Text } from "@chakra-ui/react";
import React from "react";

const OurStory = () => {
  return (
    <Flex
      mt={{ base: 20, md: 100 }}
      justifyContent={"center"}
      flexWrap="wrap"
      px={{ base: 4, md: 8 }}
    >
      <Flex
        flexDirection="column"
        width={{ base: "90%", md: "80%", lg: "60%", xl: "50%" }}
        mx="auto"
      >
        <Text
          fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
          fontWeight={700}
          mb={{ base: 6, md: 10 }}
          textAlign="center"
        >
          Our Story
        </Text>
        <Text fontSize={{ base: "md", md: "lg", lg: "xl" }} textAlign="center">
          Qorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
          vulputate libero et velit interdum, ac aliquet odio mattis. Class
          aptent taciti sociosqu ad litora torquent per conubia nostra, per
          inceptos himenaeos. Curabitur tempus urna at turpis condimentum
          lobortis. Ut commodo efficitur neque. Ut diam quam, semper iaculis
          condimentum ac, vestibulum eu nisl. Qorem ipsum dolor sit amet,
          consectetur adipiscing elit. Nunc vulputate libero et velit interdum,
          ac aliquet odio mattis. Class aptent taciti sociosqu ad litora
          torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus
          urna at turpis condimentum lobortis. Ut commodo efficitur neque. Ut
          diam quam, semper iaculis condimentum ac, vestibulum eu nisl. Qorem
          ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate
          libero et velit interdum, ac aliquet odio mattis. Class aptent taciti
          sociosqu ad litora torquent per conubia nostra, per inceptos
          himenaeos. Curabitur tempus urna at turpis condimentum lobortis. Ut
          commodo efficitur neque. Ut diam quam, semper iaculis condimentum ac,
          vestibulum eu nisl. Qorem ipsum dolor sit amet, consectetur
          adipiscing
        </Text>
      </Flex>
    </Flex>
  );
};

export default OurStory;
