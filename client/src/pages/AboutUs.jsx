import { Box } from '@chakra-ui/react'
import React from 'react'
import AboutUsHeroSec from '../components/AboutUs/AboutUsHeroSec'
import Nav from '../components/Home/Nav'
import OurStory from '../components/AboutUs/OurStory'
import Footer from '../components/Home/Footer'

const AboutUsPage = () => {
  return (
    <Box>
        <Nav position={"sticky"} zIndex={9999} top={0}/>
      <AboutUsHeroSec/>
      <OurStory/>
      <Footer/>
    </Box>
  )
}

export default AboutUsPage
