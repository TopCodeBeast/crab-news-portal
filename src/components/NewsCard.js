import React from 'react';
import {
    Avatar,
    Badge,
    Tooltip,
    Box,
    Center,
    Flex,
    Heading,
    Image,
    Stack,
    Text,
    useColorModeValue
} from '@chakra-ui/react';
import AvatarLogo from '../assets/images/AvatarLogo.png'
import {useNavigate} from "react-router-dom";
import DefaultNewsLogo from '../assets/images/DefaultNewsLogo.png'
import {handlerDeleteNews} from "../utils/handlers";
import {useStore} from "../contexts/AuthContext";
import {CONTRACT_OWNER, CRAB_CHAIN_ID} from "../utils/Constants";

export default function NewsCard({timestamp, domainName, position, author, id, imageSrc, title, body}) {
    const navigate = useNavigate()
    const {signer, address, chainId} = useStore()

    const onClickDelete = (id) => {
        handlerDeleteNews({id, signer})
            .then(() => {
                console.log(position, "SUCCESS")
                navigate('/news')
            })
    }

    return (
        <Center py={6}>
            <Box p={6}
                 w={'full'}
                 rounded={'md'}
                 maxW={'445px'}
                 boxShadow={'2xl'}
                 overflow={'hidden'}
                 bg={useColorModeValue('white', 'gray.900')}>
                <Box mb={6}
                     mt={-6}
                     mx={-6}
                     w='auto'
                     h='185px'
                     pos={'relative'}
                     bgColor={'white'}
                     cursor={'pointer'}
                     bgPosition={'center'}
                     onClick={() => navigate('/news/' + id)}>
                    <Image w={'100%'}
                           h={'200px'}
                           pb={'15px'}
                           objectFit={'cover'}
                           src={imageSrc ? imageSrc : DefaultNewsLogo}
                    />
                </Box>
                <Stack>
                    <Heading
                        fontSize={'xl'}
                        cursor={'pointer'}
                        fontFamily={'body'}
                        display={'contents'}
                        textTransform={'uppercase'}
                        onClick={() => navigate('/news/' + id)}
                        color={useColorModeValue('gray.700', 'white')}>
                        {title}
                    </Heading>
                    <Text color={'gray.500'}>
                        {body.substr(0, 40) + (body.length >= 40 ? ' ...' : '')}
                    </Text>
                </Stack>
                <Flex alignItems={'center'} justifyContent={'space-between'}>
                    <Stack mt={6}
                           spacing={4}
                           align={'center'}
                           direction={'row'}>
                        <Avatar
                            w={'35px'}
                            h={'35px'}
                            alt={'Author'}
                            src={AvatarLogo}
                            cursor={'pointer'}
                        />
                        <Stack spacing={0}
                               fontSize={'sm'}
                               direction={'column'}>
                            <Text fontWeight={600}>
                                {domainName && <Badge color={'orange'}>{domainName}</Badge>}
                                <Tooltip label={author}>
                                    <Badge color={'green'}>
                                        {author.substr(0, 6) + "..." + author.substr(author.length - 6)}
                                    </Badge>
                                </Tooltip>
                            </Text>
                            <Text color={'gray.500'}>
                                {timestamp}
                            </Text>
                        </Stack>
                    </Stack>
                    {(address?.toLowerCase() === CONTRACT_OWNER?.toLowerCase()) &&
                        (chainId === CRAB_CHAIN_ID) &&
                        <i className="fas fa-trash-alt" style={{cursor: 'pointer'}}
                           onClick={() => onClickDelete(position)}/>
                    }
                </Flex>
            </Box>
        </Center>
    );
}
