import {
    ModalBody,
    ModalHeader,
    Stack,
    Button,
    Image,
    useClipboard,
    ModalContent,
    ModalCloseButton, ModalFooter, Box, HStack, useColorModeValue, Circle
} from '@chakra-ui/react'
import {RawText, Text} from 'components/Text'
import React, {useEffect} from 'react'
import {Card} from "../../../components/Card";
import {QRCode} from "../../../components/QRCode/QRCode";
import {CopyIcon, ViewIcon} from "@chakra-ui/icons";
import {useTranslate} from "react-polyglot";

export const entries = ['/send/details', '/send/confirm']

export const Receive = ({ }: any) => {
    const translate = useTranslate()
    return (
        <>
            <ModalHeader>Receive</ModalHeader>
            <ModalBody>
                <ModalHeader textAlign='center'>
                    {translate('modals.receive.receiveAsset', { asset: "foobar" })}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody alignItems='center' justifyContent='center'>
                    <Card variant='inverted' width='auto' borderRadius='xl'>
                        <Card.Body>
                            <QRCode text="Hi there" />
                        </Card.Body>
                        <Card.Footer textAlign='center' pt={0}>
                            <RawText></RawText>
                        </Card.Footer>
                    </Card>
                </ModalBody>
                <ModalFooter flexDir='column'>
                    <Box>
                        <Text
                            translation={['modals.receive.onlySend', { asset: 'Bitcoin', symbol: 'BTC' }]}
                            color='gray.500'
                            textAlign='center'
                        />
                    </Box>
                    <HStack my={6} spacing={8}>
                        <Button
                            color='gray.500'
                            flexDir='column'
                            role='group'
                            variant='link'
                            _hover={{ textDecoration: 'none', color: useColorModeValue('gray.900', 'white') }}
                        >
                            <Circle
                                bg={useColorModeValue('gray.100', 'gray.700')}
                                mb={2}
                                size='40px'
                                _groupHover={{ bg: 'blue.500', color: 'white' }}
                            >
                                <CopyIcon />
                            </Circle>
                            <Text translation='modals.receive.copy' />
                        </Button>
                        <Button
                            color='gray.500'
                            flexDir='column'
                            role='group'
                            variant='link'
                            _hover={{ textDecoration: 'none', color: useColorModeValue('gray.900', 'white') }}
                        >
                            <Circle
                                bg={useColorModeValue('gray.100', 'gray.700')}
                                mb={2}
                                size='40px'
                                _groupHover={{ bg: 'blue.500', color: 'white' }}
                            >
                                <CopyIcon />
                            </Circle>
                            <Text translation='modals.receive.setAmount' />
                        </Button>
                        <Button
                            color='gray.500'
                            flexDir='column'
                            role='group'
                            variant='link'
                            _hover={{ textDecoration: 'none', color: useColorModeValue('gray.900', 'white') }}
                        >
                            <Circle
                                bg={useColorModeValue('gray.100', 'gray.700')}
                                mb={2}
                                size='40px'
                                _groupHover={{ bg: 'blue.500', color: 'white' }}
                            >
                                <ViewIcon />
                            </Circle>
                            <Text translation='modals.receive.verify' />
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalBody>
        </>
    )
}
