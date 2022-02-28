import * as React from "react";
import {useEffect} from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import AllNews from "./components/AllNews";
import web3modal, {providerOptions} from "./helpers/web3modal";
import {useStore} from "./contexts/AuthContext";
import {providers} from "ethers";
import Layout from "./components/Layout";
import NewsPage from "./components/NewsPage";
import FormForAddNews from "./components/AddNewsForm/FormForAddNews";
import * as UAuthWeb3Modal from "@uauth/web3modal";

export default function App() {

    const {
        setWeb3Connect,
        setAddress,
        setNetwork,
        setChainId,
        setIsLoading,
        setSigner,
        setUser
    } = useStore()

    const init = async () => {
        await web3modal.connect().then((con) => {
            setWeb3Connect(con)
            setIsLoading(false)
            const provider = new providers.Web3Provider(con)
            const signer = provider.getSigner()
            setSigner(signer)
            signer.getAddress().then((data) => {
                setAddress(data)
            })
            signer.provider.getNetwork().then((data) => {
                setNetwork(data)
                setChainId(data.chainId)
            })
            const {package: uauthPackage, options: uauthOptions} =
                providerOptions["custom-uauth"];
            if (web3modal.cachedProvider === "custom-uauth") {
                UAuthWeb3Modal.getUAuth(uauthPackage, uauthOptions).user()
                    .then((user) => {
                        setUser(user)
                    })
            }
        })
    }

    useEffect(() => {
        init()
    }, [])

    return (
        <Layout>
            <Routes>
                <Route path={"/addNews"} element={<FormForAddNews/>}/>
                <Route path="/callback" element={<AllNews/>}/>
                <Route path="/news" element={<AllNews/>}/>
                <Route path={"/news/:id"} element={<NewsPage/>}/>
                <Route path="/" element={<AllNews/>}/>
                <Route path="*" element={<Navigate replace to="/"/>}/>
            </Routes>
        </Layout>
    );
}
