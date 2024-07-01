import React from 'react'
import SidebarWithHeader from '../components/SidebarWithHeader'
import { Box } from '@chakra-ui/react'
import Profile from '../components/Profile'

const ProfilePage = () => {
  return (
   <Box>
    <SidebarWithHeader>
        <Profile/>
    </SidebarWithHeader>
   </Box>
  )
}

export default ProfilePage