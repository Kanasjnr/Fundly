import { Box } from '@chakra-ui/react'
import React from 'react'
import SidebarWithHeader from '../components/SidebarWithHeader'
import AdminVerificationPanel from '../components/AdminVerificationPanel'

const RequestVerificationPage = () => {
  return (
   <Box>
    <SidebarWithHeader>
        <AdminVerificationPanel/>
    </SidebarWithHeader>
   </Box>
  )
}

export default RequestVerificationPage
