import { Box } from '@chakra-ui/react'
import React from 'react'
import Nav from '../components/Home/Nav'
import HeroSection from '../components/Home/HeroSection'
import HotProjects from '../components/Home/HotProjects'
import Categories from '../components/Home/Categories'
import Content from '../components/Home/Content'
import Section from '../components/Home/Section'
import Footer from '../components/Home/Footer'

const HomePage = () => {
  return (
    <Box>
      <Nav position={"sticky"} zIndex={9999} top={0}/>
      <HeroSection/>
      {/* <HotProjects/> */}
      {/* <Categories/> */}
      <Content/>
      <Section/>
      <Footer/>
    </Box>
  )
}

export default HomePage
