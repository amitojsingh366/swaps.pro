import { ArrowBackIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  HStack,
  IconButton, Image,
  Portal,
  Stack,
  useColorModeValue,
  useMediaQuery
} from '@chakra-ui/react'
import { FoxIcon } from 'components/Icons/FoxIcon'
import SWAPS_ICON from 'assets/png/thorchain.png'
import { Link as RouterLink } from 'react-router-dom'
import { pathTo, Route } from 'Routes/helpers'
import { breakpoints } from 'theme/theme'

import { NavBar } from './NavBar/NavBar'
import { WalletButton } from './NavBar/WalletButton'
import React from "react";

export const HeaderContent = ({ route }: { route: Route }) => {
  const [isLargerThanMd] = useMediaQuery(`(min-width: ${breakpoints['md']})`)
  const navbarBg = useColorModeValue('white', 'gray.700')
  const navShadow = useColorModeValue('lg', 'dark-lg')
  return (
    <Flex px={6} width='full' justifyContent='space-between'>
      <Flex width='full' h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Box display='flex' alignItems='center' flex={2}>
          {pathTo(route).map((crumb, index, breadcrumbs) => (
            <div key={index} className='item'>
              {index < breadcrumbs.length - 1 && crumb.path && (
                <IconButton
                  icon={<ArrowBackIcon />}
                  aria-label={crumb.label}
                  as={RouterLink}
                  to={crumb.path}
                  size='md'
                  isRound
                  mr={2}
                />
              )}
            </div>
          ))}
          <Image
            boxSize='24px'
            loading='lazy'
            // showBorder={false}
            objectFit='contain'
            bg='transparent'
            src={SWAPS_ICON}
          /><h3>swaps.pro</h3>
        </Box>
        <FoxIcon
          w={{ base: '30px', lg: '40px' }}
          h={{ base: '30px', lg: '40px' }}
          display={{ base: 'block', md: 'none' }}
          justifySelf='flex-end'
        />
        <NavBar display={{ base: 'none', md: 'flex' }} />
        <Flex alignItems='center' justifyContent='flex-end' flex={2}>
          <HStack alignItems={'center'}>
            <WalletButton />
          </HStack>
        </Flex>
      </Flex>

      {isLargerThanMd ? null : (
        <Portal>
          <Box
            position='fixed'
            p={1}
            bottom={4}
            left='50%'
            transform='translateX(-50%)'
            display='inline-block'
            bg={navbarBg}
            borderRadius='full'
            boxShadow={navShadow}
          >
            <Stack as={'nav'} spacing={4}>
              <NavBar />
            </Stack>
          </Box>
        </Portal>
      )}
    </Flex>
  )
}
