import React from "react";
import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Image,
  Flex,
} from "@chakra-ui/react";

const Footer = () => {
  return (
    <>
      <Box bg={"#232733"} color={"white"} mt={70}>
        <Container maxW={"6xl"} py={10}>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
            <Stack align={"flex-start"}>
              <Text as={"h1"} fontSize={"lg"} fontWeight={600}>
                About-Us
              </Text>
              <Box>
                <Text as={"h1"} fontSize={"sm"} fontWeight={600}>
                  Fundraising Ideas
                </Text>
                <Text as={"h1"} fontSize={"sm"} fontWeight={600}>
                  Privacy Policy
                </Text>
              </Box>
            </Stack>

            <Stack align={"flex-start"}>
              <Text as={"h1"} fontSize={"lg"} fontWeight={600}>
                Support
              </Text>
              <Box>
                <Text as={"h1"} fontSize={"sm"} fontWeight={600}>
                  About
                </Text>
              </Box>
            </Stack>

            <Stack align={"flex-start"}>
              <Text as={"h1"} fontSize={"lg"} fontWeight={600}>
                FAQ
              </Text>
              <Box>
                <Text as={"h1"} fontSize={"sm"} fontWeight={600}>
                  Contact
                </Text>
              </Box>
            </Stack>

            <Stack align={"flex-start"}>
              <Flex gap={5} justify={{ base: "center", md: "flex-start" }}>
                <Image src="/instagram.png" width={10} height={10} />
                <Image src="/Facebook.png" width={10} height={10} />
                {/* <Image src="/link.png" width={10} height={10} /> */}
                <Image src="/Twitter.png" width={10} height={10} />
              </Flex>
            </Stack>
          </SimpleGrid>
        </Container>

        <Box borderTopWidth={1} borderStyle={"solid"} borderColor={"black"}>
          <Container
            maxW={"6xl"}
            py={4}
            textAlign={"center"}
          >
            <Text>© Copyright Fundly 2024. All Rights Reserved.</Text>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default Footer;
