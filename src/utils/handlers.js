import {Contract, ethers} from "ethers";
import {ABI, CONTRACT, IPFS_GET_LINK, CRAB_CHAIN_ID, CRAB_RPC} from "./Constants";
import axios from "axios";

export const convertNestedObjectToArray = (nestedObj) => Object.keys(nestedObj).map((key) => nestedObj[key]);

export const convertBytesToKB = (bytes) => Math.round(bytes / 1000);

export const handlerDeleteNews = async ({id, signer}) => {
    const myContract = new Contract(CONTRACT, ABI, signer);
    let position = ethers.utils.formatBytes32String(id)
    while (position.length < 66) position += '0';
    try {
        await myContract.deleteNewsByPosition(id).then((sendHash) => {
            console.log('txnHash is ' + sendHash);
        })
    } catch (e) {
        console.log("payment fail!");
        console.log(e);
    }
}

export const handlerFetchNews = async (setContent) => {
    const array = [];
    const ethersProvider = new ethers.providers.JsonRpcProvider(CRAB_RPC);
    const myContract = new Contract(CONTRACT, ABI, ethersProvider);
    const totalCount = await myContract.getCount()
    let j = 1;
    for (let i = totalCount; i >= 1; --i) {
        let response = await myContract.getNewsByPosition(i)
        const link = response[0]
        if (link) {
            let object = await axios.get(IPFS_GET_LINK + link)
            object.data.id = parseInt(j);
            object.data.author = response[1];
            object.data.position = parseInt(i);
            object.data.timestampMs = response[2];
            object.data.timestamp = new Date(response[2] * 1000)
                .toISOString()
                .slice(0, 16)
                .replace('T', ' ')
            j = j + 1
            array.push(object)
        }
        setContent([...array])
    }
}

export const onSubmitNews = ({data, chainId, setIsLoading, files, user, signer, client, navigate}) => {
    if (chainId === CRAB_CHAIN_ID) {
        setIsLoading(true)
        let ipfsSecretKey = '';
        const dataObject = {title: data.title, body: data.body, images: [], domainName: user?.sub ? user?.sub : ''}
        ;(async function () {
            let array = convertNestedObjectToArray(files);
            for (let i = 0; i < array.length; i++) {
                let {path} = await client.add(array[i])
                dataObject.images.push(IPFS_GET_LINK + path)
            }
            const {path} = await client.add(JSON.stringify(dataObject))
            ipfsSecretKey = path
        })().then(() => {
            let myContract = new Contract(CONTRACT, ABI, signer);
            ;(async () => {
                try {
                    myContract.addNews(ipfsSecretKey)
                        .then((sendHash) => {
                            setIsLoading(false)
                            console.log('txnHash is ' + sendHash);
                            navigate('/');
                        }).catch(() => {
                        setIsLoading(false)
                    });
                } catch (e) {
                    console.log("payment fail!");
                    console.log(e);
                }
            })()
        })
    }
}
