import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Keypair } from 'maci-domainobjs'
import { signup } from '../../utils/web3utils'

import './maciDetails.css'

// Sections to signup, and generate keys 
export default function MaciDetails() {

    // state variables
    const [ pubKey, setPubKey ] = useState('')
    const [ privateKey, setPrivateKey ] = useState('')
    const [ signUpKey, setSignUpKey ] = useState('')

    // generate a new keyapir
    const createMaciKey = async () => {
        const keyPair = new Keypair()
        setPubKey(keyPair.pubKey.serialize())
        setPrivateKey(keyPair.privKey.serialize())
    }

    // signup to the MACI instance
    const signUp = async () => {
        await signup(signUpKey)
    }

    return (
        <div className="maciDetails">
            <Row className="colRow">
                <Col>
                    <div className="box">
                        <div>
                            <span>Create maci key</span>
                        </div>
                        <div className="buttonRow">
                            <button className="createButton" onClick={createMaciKey}>Create</button>
                        </div>
                    </div>
                </Col>
                <Col>
                    <div className="box">
                        <div>
                            <input 
                            className="signUpInput"
                            onChange={(e) => setSignUpKey(e.target.value)}
                            type='text' placeholder='public key' />
                        </div>
                        <div className="buttonRow">
                            <button className="createButton" onClick={signUp}>Sign up</button>
                        </div>
                    </div>
                </Col>
                <Col>
                    <div className="box">
                        <div>
                            <span>Voice Credits</span>
                        </div>
                        <div>
                            100 - Use them wisely
                        </div>
                    </div>
                </Col>
                {
                    privateKey && pubKey &&
                    <div className="keys">
                        <div>
                            <span className="coordinatorKey">Private Key: {privateKey.toString()}</span>
                        </div>
                        <div>
                            <span className="coordinatorKey">Public Key: {pubKey.toString()}</span>
                        </div>
                    </div>
                }
            </Row>
        </div>
    )
}