import { CopyIcon, ViewIcon } from '@chakra-ui/icons'
import {
    Box,
    Button,
    Circle,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useColorModeValue
} from '@chakra-ui/react'
import { Card } from 'components/Card'
import { QRCode } from 'components/QRCode/QRCode'
import { RawText, Text } from 'components/Text'
import { useModal } from 'context/ModalProvider/ModalProvider'
import { useTranslate } from 'react-polyglot'
import {useWallet} from "../../../context/WalletProvider/WalletProvider";

export const Select = () => {
    const { pioneer, state } = useWallet()

    const translate = useTranslate()
    const modal = useModal()
    return (
        <Modal isOpen={modal.select} onClose={() => modal.close('select')} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign='center'>
                    <h2>Select asset Exchange: {}</h2>
                    <h2>Select asset</h2>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody alignItems='center' justifyContent='center'>
                    <Card variant='inverted' width='auto' borderRadius='xl'>
                        <h2>Select access</h2>
                    </Card>
                </ModalBody>
                <ModalFooter flexDir='column'>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
