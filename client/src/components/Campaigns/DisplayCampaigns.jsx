import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Heading, Text, Image, SimpleGrid } from "@chakra-ui/react";
import FundCard from "./FundCard";

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.pId}`, { state: campaign });
  };

  const renderCampaigns = () => {
    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center" width="100%">
          <Image
            src="/Loader.svg"
            alt="loader"
            boxSize="100px"
            objectFit="contain"
          />
        </Box>
      );
    }

    if (!campaigns || campaigns.length === 0) {
      return (
        <Text
          fontFamily="epilogue"
          fontWeight="semibold"
          fontSize="14px"
          lineHeight="30px"
          color="gray.500"
        >
          You have not created any campaigns yet.
        </Text>
      );
    }

    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {campaigns.map((campaign) => (
          <FundCard
            key={campaign.pId}
            {...campaign}
            handleClick={() => handleNavigate(campaign)}
          />
        ))}
      </SimpleGrid>
    );
  };

  return (
    <Box>
      <Heading
        as="h1"
        fontFamily="epilogue"
        fontWeight="semibold"
        fontSize="18px"
        color="black"
        textAlign="left"
        mb={6}
      >
        {title} ({campaigns ? campaigns.length : 0})
      </Heading>
      {renderCampaigns()}
    </Box>
  );
};

export default DisplayCampaigns;