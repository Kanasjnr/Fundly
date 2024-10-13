import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../context/index";
import { ethers } from "ethers";
import {
  Box,
  Flex,
  Heading,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Alert,
  AlertIcon,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

const Profile = () => {
  const navigate = useNavigate();
  const { currentAccount, getCampaigns, contract } = useStateContext();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const tableHeaderBg = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        if (!contract) {
          console.log("Waiting for contract to initialize...");
          return;
        }
        const allCampaigns = await getCampaigns();
        setCampaigns(allCampaigns);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
        setError("Failed to fetch campaigns. Please try again later.");
        setLoading(false);
      }
    };

    if (contract) {
      fetchCampaigns();
    } else {
      const timer = setInterval(() => {
        if (contract) {
          clearInterval(timer);
          fetchCampaigns();
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [getCampaigns, contract]);

  const createdCampaigns = campaigns.filter(campaign => campaign.owner === currentAccount);
  const backedCampaigns = campaigns.filter(campaign => campaign.owner !== currentAccount);

  const formatAmount = (amount) => {
    try {
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount)) {
        return "0.0";
      }
      const amountInWei = ethers.utils.parseEther(numericAmount.toString());
      return ethers.utils.formatEther(amountInWei);
    } catch (error) {
      console.error("Error formatting amount:", error);
      return "0.0";
    }
  };

  const renderCampaignTable = (campaignList) => (
    <Table variant="simple">
      <Thead bg={tableHeaderBg}>
        <Tr>
          <Th>Name</Th>
          <Th>Status</Th>
          <Th>ETA (days)</Th>
          <Th>Balance (ETH)</Th>
          <Th>Payout Status</Th> 
        </Tr>
      </Thead>
      <Tbody>
        {campaignList.length === 0 ? (
          <Tr>
            <Td colSpan={5} textAlign="center">No campaigns found.</Td> 
          </Tr>
        ) : (
          campaignList.map((campaign) => (
            <Tr key={campaign.pId}>
              <Td>{campaign.title}</Td>
              <Td>{Date.now() > campaign.deadline ? "Ended" : "Active"}</Td>
              <Td>{Math.max(0, Math.ceil((campaign.deadline - Date.now()) / (1000 * 60 * 60 * 24)))}</Td>
              <Td>{formatAmount(campaign.amountCollected)} ETH</Td>
              <Td>{campaign.paidOut ? "Paid Out" : "Not Paid Out"}</Td> 
            </Tr>
          ))
        )}
      </Tbody>
    </Table>
  );

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" minHeight="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box bg={bgColor} minHeight="100vh" p={4}>
      <Flex justifyContent="space-between" alignItems="center" mb={8}>
        <Heading size="lg">Profile</Heading>
        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={() => navigate("/create-campaign")}>
          Create campaign
        </Button>
      </Flex>

      <Tabs>
        <TabList mb={4}>
          <Tab>Created</Tab>
          <Tab>Backed</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Heading size="md" mb={4}>Campaigns Created</Heading>
            {renderCampaignTable(createdCampaigns)}
          </TabPanel>
          <TabPanel>
            <Heading size="md" mb={4}>Campaigns Backed</Heading>
            {renderCampaignTable(backedCampaigns)}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Profile;
