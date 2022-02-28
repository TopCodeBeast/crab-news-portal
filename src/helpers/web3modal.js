import * as UAuthWeb3Modal from '@uauth/web3modal'
import Web3Modal from 'web3modal'

export const providerOptions = {}

export const web3modal = new Web3Modal({network: 'mainnet', cacheProvider: true, providerOptions, theme: "dark"})

UAuthWeb3Modal.registerWeb3Modal(web3modal)

export default web3modal
