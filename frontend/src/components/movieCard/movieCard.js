import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { voteMACI } from '../../utils/web3utils'

import './movieCard.css'

// A card to show a movie
export default function MovieCard(props) {

    // state variables
    const [ weight, setWeight ] = useState(0) // how many credits per vote
    const [ index, setIndex ] = useState(0) // the state index in the signup tree
    const [ pubKey, setPubKey ] = useState('')
    const [ privKey, setPrivKey ] = useState('')
    const [ nonce, setNonce ] = useState(0)
    const [ showModal, setShowModal ] = useState(false)

    // vote on the MACI contract
    const vote = async () => {
        // option, stateIndex, weight, nonce, publicKey, privateKey, salt
        await voteMACI(props.id, index, weight, nonce, pubKey.trim(), privKey.trim())
        setShowModal(false)
    }

    return (
        <div className="movieCard">
            <a href={props.url} target="_blank">
                <img className="cardImg" src={props.image} />
            </a>
            <div className="cardButtonRow">
                <button onClick={setShowModal} className="voteButton">
                    Vote
                </button>
            </div>
            <Modal 
            className="modalStyle text-center"
            onHide={() => setShowModal(false)}
            show={showModal}>
                <Modal.Header className="text-center">
                    <Modal.Title className="text-center">Vote</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <div>
                        <input type='number' max='99' className="formInput modalForm" placeholder='Weight (Voice credits)' onChange={(e) => setWeight(e.target.value)} />
                    </div>
                    <div>
                        <input type='number' className="formInput modalForm" placeholder='State index' onChange={(e) => setIndex(e.target.value)} />
                    </div>
                    <div>
                        <input type='number' className="formInput modalForm" placeholder='Nonce' onChange={(e) => setNonce(e.target.value)} />
                    </div>
                    <div>
                        <input type='text' className="formInput modalForm" placeholder='Public Key' onChange={(e) => setPubKey(e.target.value)} />
                    </div>
                    <div>
                        <input type='text' className="formInput modalForm" placeholder='Private Key' onChange={(e) => setPrivKey(e.target.value)} />
                    </div>
                    <div>
                        <button onClick={vote} className="modalButton">
                            Vote
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}