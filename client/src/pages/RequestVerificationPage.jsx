import { Box } from '@chakra-ui/react'
import React from 'react'
import SidebarWithHeader from '../components/SidebarWithHeader'
import RequestVerification from '../components/RequestVerification'

const RequestVerificationPage = () => {
  return (
   <Box>
    <SidebarWithHeader>
        <RequestVerification/>
    </SidebarWithHeader>
   </Box>
  )
}

export default RequestVerificationPage
