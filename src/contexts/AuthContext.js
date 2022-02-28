import React, {useContext, useMemo, useState} from 'react'

const AuthContext = React.createContext();

export function useStore() {
    return useContext(AuthContext)
}

export function AuthProvider({children}) {
    const [signer, setSigner] = useState("")
    const [chainId, setChainId] = useState("")
    const [web3Provider, setWeb3Provider] = useState({})
    const [network, setNetwork] = useState('')
    const [address, setAddress] = useState(undefined)
    const [web3Connect, setWeb3Connect] = useState({})
    const [uauth, setUauth] = useState(null)
    const [user, setUser] = useState(null)
    const [content, setContent] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    if (address) {
        ;(async () => {
            web3Connect.on("accountsChanged", (accounts) => {
                console.log(accounts);
                setAddress(accounts[0])
            });
            web3Connect.on("chainChanged", (chainId) => {
                console.log(chainId);
                setChainId(parseInt(chainId, 16))
            });
            web3Connect.on("connect", (info) => {
                console.log(info);
            });
            web3Connect.on("disconnect", (error) => {
                console.log(error);
            });
        })()
    }

    const value = useMemo(() => ({
        address,
        setAddress,
        chainId,
        setChainId,
        web3Provider,
        setWeb3Provider,
        web3Connect,
        setWeb3Connect,
        network,
        setNetwork,
        signer,
        setSigner,
        uauth,
        setUauth,
        user,
        setUser,
        content,
        setContent,
        isLoading, setIsLoading
    }), [
        isLoading,
        setIsLoading,
        address,
        uauth,
        user,
        content,
        chainId,
        web3Provider,
        web3Connect,
        signer,
        network
    ])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
