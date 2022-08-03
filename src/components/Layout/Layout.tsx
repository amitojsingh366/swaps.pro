import { Box, Container, Flex } from '@chakra-ui/react'
import React from 'react'
import { Route } from 'Routes/helpers'

import { Header } from './Header/Header'
import { LeftSidebar } from './LeftSidebar'
import { RightSidebar } from './RightSidebar'

export const Layout = ({ route }: { route: Route }) => {
  return (
    <div style={{ width: "100%" }}>
      <Header route={route} />
      <Container
        paddingBottom='0'
        paddingInlineStart='0'
        paddingInlineEnd='0'
        maxW="100%"
      >
        <Box display={{ base: 'block', md: 'flex' }} width="100%">
          <Box id='content' width="100%" >
            <Flex
              px={{ base: 0, lg: 4 }}
              width="100%"
            >
              {route?.leftSidebar && <LeftSidebar>{route.leftSidebar}</LeftSidebar>}
              {route.main}
              {route?.rightSidebar && <RightSidebar>{route.rightSidebar}</RightSidebar>}
            </Flex>
          </Box>
        </Box>
      </Container>
    </div>
  )
}
