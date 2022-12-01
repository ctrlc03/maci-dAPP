import React from 'react'
import { chain, useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

export default function Wallet() {

    const { isConnected } = useAccount()
    const { connect } = useConnect({
      connector: new InjectedConnector({
        chains: [chain.arbitrumGoerli]
      }),
    })
    const { disconnect } = useDisconnect()
   
    if (isConnected)
      return (
          <button className="connectButton" onClick={() => disconnect()}>Disconnect</button>
      )
    return <button className="connectButton" onClick={() => connect()}>Connect</button>
}