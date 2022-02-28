import React, {useCallback, useEffect} from "react";
import {
    Box,
    Button,
    Flex,
    HStack,
    IconButton,
    Image,
    Stack,
    Tag,
    Tooltip,
    useColorMode,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import {CloseIcon, HamburgerIcon, MoonIcon, SunIcon} from '@chakra-ui/icons';
import ListNews from '../assets/images/NavbarListOfNewsIcon.png'
import AddNews from '../assets/images/NavbarAddNewsIcon.png'
import {useNavigate} from "react-router-dom";
import {useStore} from "../contexts/AuthContext";
import web3modal, {providerOptions} from "../helpers/web3modal";
import {providers} from "ethers";
import * as UAuthWeb3Modal from "@uauth/web3modal";
import {ellipseAddress} from "../utils/utilities";

export default function Layout({children}) {
    let navigate = useNavigate();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const {colorMode, toggleColorMode} = useColorMode();

    const {
        address, setAddress, setNetwork, chainId, setChainId, setSigner, user, setUser, web3Connect
    } = useStore()

    const handlerOnClose = (uri) => {
        onClose()
        navigate(uri)
    }

    const handleLogin = useCallback(async function () {
        const con = await web3modal.connect()
        const provider = new providers.Web3Provider(con)
        const signer = await provider.getSigner()
        const addr = await signer.getAddress()
        const netw = await provider.getNetwork()
        setSigner(signer)
        setAddress(addr)
        setNetwork(netw)
        setChainId(netw.chainId)

        if (web3modal.cachedProvider === "custom-uauth") {
            const {package: uauthPackage, options: uauthOptions} = providerOptions["custom-uauth"];
            await UAuthWeb3Modal.getUAuth(uauthPackage, uauthOptions).user()
                .then((user) => {
                    setUser(user)
                })
        }
    }, [])

    const handleLogout = useCallback(
        async function () {
            await web3modal.clearCachedProvider()
            if (web3Connect?.disconnect && typeof web3Connect.disconnect === 'function') {
                await web3Connect.disconnect()
            }
            localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER')
            localStorage.removeItem('username')
            localStorage.removeItem('request')
            localStorage.removeItem('uauth-default-username')
            setUser(null)
            setAddress(undefined)
        },
        [web3Connect]
    )

    return (
        <>
            <Box bg={useColorModeValue('gray.200', 'gray.900')}>
                <Box px={4}>
                    <Flex h={16}
                          alignItems={'center'}
                          justifyContent={'space-between'}>
                        <IconButton size={'md'}
                                    display={{md: 'none'}}
                                    aria-label={'Open Menu'}
                                    onClick={isOpen ? onClose : onOpen}
                                    icon={isOpen ? <CloseIcon/> : <HamburgerIcon/>}
                        />
                        <HStack spacing={8}
                                alignItems={'center'}>
                            <HStack as={'nav'}
                                    spacing={4}
                                    display={{base: 'none', md: 'flex'}}>
                                <Button bg='transparent'
                                        onClick={() => navigate("/news")}
                                        rightIcon={<Image src={ListNews} htmlWidth={'20px'}/>}>
                                    News
                                </Button>
                                <Button bg='transparent'
                                        onClick={() => navigate("/addNews")}
                                        rightIcon={<Image src={AddNews} htmlWidth={'20px'}/>}>
                                    Add News
                                </Button>
                            </HStack>
                        </HStack>
                        <Flex alignItems={'center'}>
                            {chainId && address &&
                                <Tooltip maxW={'100%'}
                                         label={address}>
                                    <Tag pt={'7px'}
                                         pb={'7px'}
                                         mr={'10px'}
                                         fontSize={'0.875rem'}
                                         lineHeight={'1.2rem'}>
                                        {user ? user.sub : ellipseAddress(address)}
                                    </Tag>
                                </Tooltip>
                            }
                            {!address &&
                                <Button colorScheme='teal'
                                        onClick={handleLogin}
                                        disabled={false}>
                                    Connect Wallet
                                </Button>
                            }
                            {address &&
                                <Button colorScheme='teal'
                                        onClick={handleLogout}
                                        disabled={false}>
                                    Logout
                                </Button>
                            }
                            <Button h={'40px'}
                                    w={'40px'}
                                    ml={'20px'}
                                    rounded={'50%'}
                                    onClick={toggleColorMode}>
                                {colorMode === 'light' ? <MoonIcon/> : <SunIcon/>}
                            </Button>
                        </Flex>
                    </Flex>
                    {isOpen &&
                        <Box pb={4}
                             display={{md: 'none'}}>
                            <Stack as={'nav'}
                                   spacing={4}>
                                <Button rightIcon={<Image htmlWidth={'20px'} src={ListNews}/>}
                                        onClick={() => handlerOnClose("/news")} key={"News"}>
                                    News
                                </Button>
                                <Button rightIcon={<Image htmlWidth={'20px'} src={AddNews}/>}
                                        onClick={() => handlerOnClose("/addNews")} key={"Add News"}>
                                    Add News
                                </Button>
                            </Stack>
                        </Box>
                    }
                </Box>
            </Box>
            <Box p={4}
                 display={'flex'}
                 justifyContent={'center'}>
                {children}
            </Box>
        </>
    );
}
