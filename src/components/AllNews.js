import React, {useEffect} from 'react';
import NewsCard from "./NewsCard";
import {Box, Center, Flex, SimpleGrid, Spinner} from "@chakra-ui/react";
import {useStore} from "../contexts/AuthContext";
import {handlerFetchNews} from "../utils/handlers";

function AllNewsPage() {
    const {content, setContent, web3Connect, chainId} = useStore()

    const init = async () => {
        await handlerFetchNews(setContent)
    }

    useEffect(() => {
        init()
    }, [web3Connect, chainId])

    if (content.length == 0) {
        return <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
        />
    }
    return (<Flex height="full" alignItems={'center'} flexDirection={'column'}>
        {(content.length > 0)
            ? <>
                <i className="fas fa-sync-alt" style={{cursor: 'pointer'}} onClick={() => init()}/>
                <SimpleGrid mr={'40px'} rowGap={'0px'} columnGap={'60px'} columns={[1, 1, 2, 3, 4]}>
                    {content && content.map((item, index) => <Box w='110%' key={item.data.title + '_' + index}>
                        <NewsCard id={index}
                                  domainName={item.data?.domainName}
                                  position={item.data?.position}
                                  body={item.data?.body}
                                  title={item.data?.title}
                                  author={item.data.author}
                                  timestamp={item.data.timestamp}
                                  imageSrc={item.data?.images && item.data?.images[0]}
                        />
                    </Box>)}
                </SimpleGrid>
            </> : <Center fontWeight={'bold'} fontSize={'25px'}>NO NEWS</Center>}
    </Flex>)
}

export default AllNewsPage;
