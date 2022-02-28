import React, {useEffect, useState} from 'react';
import {
    Box,
    Flex,
    Heading,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    SimpleGrid,
    Spinner,
    Text,
    Tooltip,
    useColorModeValue,
    useDisclosure
} from "@chakra-ui/react";
import {useParams} from "react-router-dom";
import {useStore} from "../contexts/AuthContext";
import {handlerFetchNews} from "../utils/handlers";

function NewsPage() {
    let {id} = useParams()
    const {isOpen, onOpen, onClose} = useDisclosure()

    const {
        content,
        setContent,
        web3Connect,
        chainId,
        address
    } = useStore()

    const [currentModalImage, setCurrentModalImage] = useState('')

    const init = async () => {
        await handlerFetchNews(setContent)
    }

    useEffect(() => {
        init()
    }, [])

    const handlerOpenModal = (image) => {
        onOpen()
        setCurrentModalImage(image)
    }

    if (!content[id]?.data.images) {
        return <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
        />
    }

    return (
        // eslint-disable-next-line react-hooks/rules-of-hooks
        <Flex color={useColorModeValue('gray.600', 'gray.400')}
              rounded={'8px'} w={[450, 650, 850]}
              flexDirection={'column'}
              height="full">
            <Box>
                <Heading mb={'15px'}
                         textAlign={'center'}
                         textTransform={'uppercase'}>
                    {content[id]?.data && content[id].data.title}
                </Heading>
                <Flex mb={'25px'}
                      bg={'#4848483d'}
                      rounded={'10px'}
                      direction={'column'}
                      justifyContent={'space-between'} p={'20px'}>
                    {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
                    <Flex color={useColorModeValue('gray.800', 'gray.300')}
                          justifyContent={'space-between'}
                          flexWrap={'wrap'}
                          gap={'10px'}
                          mb={'15px'}>
                        {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
                        <Text bg={useColorModeValue('gray.100', 'gray.700')}
                              rounded={'25px'}
                              pl={'10px'}
                              pr={'10px'}>
                            <Tooltip maxW={'100%'}
                                     fontSize={'15px'}
                                     label={content[id]?.data.author}>
                                <Flex>
                                    <Text>
                                        <b>Create by: </b>
                                        {
                                            content[id]?.data.author.substr(0, 6)
                                            + "..."
                                            + content[id]?.data.author.substr(content[id]?.data.author.length - 10)
                                        }
                                    </Text>
                                    {content[id]?.data?.domainName &&
                                        <Text>
                                            &nbsp;[<u>{content[id]?.data?.domainName}</u>]
                                        </Text>
                                    }
                                </Flex>
                            </Tooltip>
                        </Text>
                        {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
                        <Text bg={useColorModeValue('gray.100', 'gray.700')}
                              rounded={'25px'}
                              pl={'10px'}
                              pr={'10px'}>
                            <b>Date:</b> {content[id]?.data.timestamp}
                        </Text>
                    </Flex>
                    <Text whiteSpace={'pre-wrap'}>
                        {content[id]?.data && content[id].data.body}
                    </Text>
                </Flex>
            </Box>
            {content[id]?.data.images.length !== 0 &&
                <SimpleGrid p={5}
                            w={'full'}
                            rounded={'10px'}
                            spacing={'40px'}
                            color={'gray.400'}
                            overflow={'hidden'}
                            alignItems={'center'}
                            justifyItems={'center'}
                            columns={content[id]?.data.images.length === 1 ? [1] : [1, 2, 3, 4]}>
                    {content[id]?.data.images.map((image, index) =>
                        <Image p={0}
                               src={image}
                               rounded={'10px'}
                               cursor={'pointer'}
                               key={image + '_' + index}
                               onClick={() => handlerOpenModal(image)} w={'150px'}/>)
                    }
                </SimpleGrid>
            }
            <Modal p={0}
                   isCentered
                   isOpen={isOpen}
                   onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalCloseButton color="teal"/>
                    <ModalBody p={0}>
                        <Image src={currentModalImage}/>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    );
}

export default NewsPage;
