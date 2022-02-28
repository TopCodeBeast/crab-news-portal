import supportedChains from './chains'

export function getChainData(chainId) {
    if (!chainId)
        return null

    const chainData = supportedChains.filter(
        (chain) => chain.chain_id === chainId
    )[0]

    if (!chainData)
        return null

    return chainData
}

export function ellipseAddress(address = '', width = 7) {
    if (!address) {
        return ''
    }
    return `${address.slice(0, width)}...${address.slice(-width)}`
}
