import { Box, Container, Flex } from '@chakra-ui/react'
import React from 'react'
import { Route } from 'Routes/helpers'

import { Header } from './Header/Header'
import { LeftSidebar } from './LeftSidebar'
import { RightSidebar } from './RightSidebar'

export const Layout = ({ route }: { route: Route }) => {
  return (
    <>
      <Header route={route} />
      <Container
        paddingBottom='0'
        paddingInlineStart='0'
        paddingInlineEnd='0'
      >
        <Box display={{ base: 'block', md: 'flex' }} >
          <Box flex={1}>
            <Box id='content' >
              <Flex
                maxWidth={{ base: 'auto', '2xl': '1464px' }}
                px={{ base: 0, lg: 4 }}
              >
                {route?.leftSidebar && <LeftSidebar>{route.leftSidebar}</LeftSidebar>}
                {route.main}
                {route?.rightSidebar && <RightSidebar>{route.rightSidebar}</RightSidebar>}
              </Flex>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  )
}
