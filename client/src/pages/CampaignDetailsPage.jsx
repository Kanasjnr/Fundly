import { Box } from '@chakra-ui/react'
import React from 'react'
// import Header from '../components/Header'
import CampaignDetails from '../components/Campaigns/CampaignDetails'
import SidebarWithHeader from '../components/SidebarWithHeader'

const CampaignDetailsPage = () => {
  return (
    <Box>
      {/* <Header>
        <CampaignDetails/>
      </Header> */}
 <SidebarWithHeader>
        <CampaignDetails/>
      </SidebarWithHeader> 
    </Box>
  )
}

export default CampaignDetailsPage
