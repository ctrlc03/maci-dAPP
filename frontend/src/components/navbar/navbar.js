import React from 'react'
import { Container, Navbar } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify'
import Wallet from '../wallet/wallet'

import 'react-toastify/dist/ReactToastify.css';
import './navbar.css'

export default function NavBarMACI() {
    return (
        <Navbar className="navbarStyle" expand="lg">
        <Container>
            <ToastContainer
            position="top-right"
            autoClose={5000}
            theme="dark"
            />
            <Navbar.Brand className="navTitle">MACI</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                <Wallet />
            </Navbar.Collapse>
        </Container>
        </Navbar>
    )
}
