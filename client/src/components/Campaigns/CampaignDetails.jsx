import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStateContext } from "../../context";
import { calculateBarPercentage, daysLeft } from "../../utils";
import Loader from "../Loader";
import {
  Box,
  Image,
  Text,
  Input,
  Flex,
  Card,
  Button,
  useToast,
} from "@chakra-ui/react";

const CampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { donate, getDonations, contract, currentAccount, payout } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [donators, setDonators] = useState([]);
  const toast = useToast();

  const remainingDays = state && state.deadline ? daysLeft(state.deadline) : 0;

  const fetchDonators = async () => {
    const data = await getDonations(state.pId);
    setDonators(data);
  };

  useEffect(() => {
    if (contract) fetchDonators();
  }, [contract, currentAccount]);

  const handleDonate = async () => {
    try {
      setIsLoading(true);
      await donate(state.pId, amount);
      toast({
        title: "Donation Successful",
        description: "Thank you for your donation!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Donation Failed",
        description: "There was an error processing your donation.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Donation failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayout = async () => {
    try {
      setIsLoading(true);
      await payout(state.pId);
      toast({
        title: "Payout Successful",
        description: "The payout was successful.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      console.log("Payout was successful");
    } catch (error) {
      toast({
        title: "Payout Failed",
        description: "There was an error processing the payout.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Payout failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex flexDirection="column">
      {isLoading && <Loader />}
      <Flex m="50px" flexWrap="wrap" justifyContent="center">
        <Box
          bg="#1c1c24"
          width={{ base: "100%", md: "1100px" }}
          maxWidth="1100px"
          height="auto"
          borderRadius="20px"
          p="20px"
          mb="20px"
        >
          <Flex flexWrap="wrap">
            <Image
              width={{ base: "100%", md: "800px" }}
              height="400px"
              src={state && state.image ? state.image : ""}
              borderRadius="15px"
              m="10px"
            />
            <Flex flexDirection="column" ml={{ base: "0px", md: "20px" }}>
              <Card
                width="200px"
                height="90px"
                p="10px 48px"
                mt="10px"
                bg="#1DAA97"
                mb="10px"
              >
                <Flex flexDirection="column" gap="10px">
                  <Text
                    alignItems="center"
                    textAlign="center"
                    fontSize={{ base: "l", md: "l", lg: "xl" }}
                    fontWeight={600}
                    color="white"
                  >
                    {remainingDays}
                  </Text>
                  <span className="text4">days left</span>
                </Flex>
              </Card>
              <Card
                width="200px"
                height="90px"
                p="10px 48px"
                mt="10px"
                bg="#1DAA97"
                mb="10px"
              >
                <Flex flexDirection="column" gap="10px">
                  <Text
                    alignItems="center"
                    textAlign="center"
                    fontSize={{ base: "l", md: "l", lg: "xl" }}
                    fontWeight={600}
                    color="white"
                  >
                    {state && state.amountCollected
                      ? `$${state.amountCollected}`
                      : ""}
                  </Text>
                  <span className="text4">{`Raised of $${
                    state && state.target ? state.target : ""
                  }`}</span>
                </Flex>
              </Card>
              <Card
                width="200px"
                height="90px"
                p="10px 48px"
                mt="10px"
                bg="#1DAA97"
              >
                <Flex flexDirection="column" gap="10px">
                  <Text
                    alignItems="center"
                    textAlign="center"
                    fontSize={{ base: "l", md: "l", lg: "xl" }}
                    fontWeight={600}
                    color="white"
                  >
                    {donators.length}
                  </Text>
                  <Text className="text4">Backers</Text>
                </Flex>
              </Card>
            </Flex>
          </Flex>

          <Box pos="relative" w="100%" h="3" bg="#1a1a1a" mt="2" rounded="md">
            {state && state.target && state.amountCollected && (
              <Box
                pos="absolute"
                h="full"
                bg="#38a169"
                style={{
                  width: `${
                    calculateBarPercentage(state.target, state.amountCollected)
                      .percentage
                  }%`,
                  maxWidth: "100%",
                }}
              />
            )}
          </Box>

          <Box mt="30px">
            <Flex align="center" gap={7}>
              <Box
                w="12"
                h="12"
                flex="none"
                display="flex"
                justifyContent="center"
                alignItems="center"
                rounded="full"
                bg="#4a5568"
                cursor="pointer"
              ></Box>
              <Box>
                <Text
                  fontWeight="semibold"
                  color="white"
                  overflowWrap="break-word"
                >
                  {state && state.owner ? state.owner : "Owner Not Available"}
                </Text>
                <Text color="gray.400"> Campaign</Text>
              </Box>
            </Flex>

            <Box mt={4}>
              <Text fontWeight="semibold" color="white">
                Story
              </Text>
              <Text color="gray.400" leading="7">
                {state && state.description
                  ? state.description
                  : "Description Not Available"}
              </Text>
            </Box>

            <Box mt={4}>
              <Text fontWeight="semibold" color="white">
                Donators
              </Text>
              <Box mt={2}>
                {donators.length > 0 ? (
                  donators.map((item, index) => (
                    <Flex
                      key={`${item.donator}-${index}`}
                      justify="space-between"
                      align="center"
                    >
                      <Text color="gray.500" overflowWrap="break-word">
                        {index + 1}. {item.donator}
                      </Text>
                      <Text color="gray.400">{item.donations}</Text>
                    </Flex>
                  ))
                ) : (
                  <Text color="gray.400">
                    No donators yet. Be the first one!
                  </Text>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        <Box ml={{ base: "0px", md: "20px" }} mt={{ base: "20px", md: "0px" }}>
          <Flex direction="column" spacing={6}>
            <Text fontWeight="semibold" color="white">
              Fund
            </Text>
            <Card p={4} bg="#2d3748" rounded="lg">
              <Text
                fontSize="xl"
                fontWeight="medium"
                color="white"
                textAlign="center"
                mb={6}
              >
                Fund the campaign
              </Text>
              <Input
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                w="full"
                px={4}
                py={2}
                border="1px"
                borderColor="#4a5568"
                bg="gray.700"
                color="white"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <Box my={6} p={4} bg="gray.700" rounded="md">
                <Text fontWeight="semibold" fontSize="sm" color="white" mb={2}>
                  Back it because you believe in it.
                </Text>
                <Text color="black">
                  Support the project for no reward, just because it speaks to
                  you.
                </Text>
              </Box>
              <Button
                type="button"
                width="full"
                bg="#1DAA97"
                color="black"
                _hover={{ bg: "white", color: "#1DAA97" }}
                onClick={handleDonate}
              >
                Fund Campaign
              </Button>
            </Card>
            {/* 
            {address === state.owner && ( */}
            <Button
              mt={4}
              width="full"
              bg="#1DAA97"
              color="black"
              _hover={{ bg: "white", color: "#1DAA97" }}
              onClick={handlePayout}
            >
              Payout
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};

export default CampaignDetails;
