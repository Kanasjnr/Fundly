import { Box } from '@chakra-ui/react'
import React from 'react'
import SidebarWithHeader from '../components/SidebarWithHeader'
import CreateCampaign from '../components/Campaigns/CreateCampaign'

const CreateCampaignPage = () => {
  return (
    <Box>
        <SidebarWithHeader>
            <CreateCampaign/>
        </SidebarWithHeader>
      
    </Box>
  )
}

export default CreateCampaignPage
