import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Heading, Text, Image } from "@chakra-ui/react";
import FundCard from "./FundCard";

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };

  const renderCampaigns = () => {
    if (isLoading) {
      return (
        <Image
          src={"loader.svg"}
          alt="loader"
          boxSize="100px"
          objectFit="contain"
        />
      );
    } else if (!campaigns || campaigns.length === 0) {
      return (
        <Text
          as="p"
          fontFamily="epilogue"
          fontWeight="semibold"
          fontSize="14px"
          lineHeight="30px"
          color="#818183"
        >
          You have not created any campaigns yet.
        </Text>
      );
    } else {
      return campaigns.map((campaign) => {
        return (
          <FundCard
            key={campaign.id}
            {...campaign}
            handleClick={() => handleNavigate(campaign)}
          />
        );
      });
    }
  };

  return (
    <Box>
      <Heading
        as="h1"
        fontFamily="epilogue"
        fontWeight="semibold"
        fontSize="18px"
        color="Black"
        textAlign="left"
        ml="15px"
        mb="30px"
      >
        {title} ({campaigns ? campaigns.length : 0})
      </Heading>
      <Box
        display="flex"
        flexWrap="wrap"
        mt="20px"
        gap="26px"
        flexDirection={{ base: "column", md: "row" }}
        alignItems={"center"}
        justifyContent={"center"}
      >
        {renderCampaigns()}
      </Box>
    </Box>
  );
};

export default DisplayCampaigns;