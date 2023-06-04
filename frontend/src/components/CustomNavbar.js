import React from "react"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const CustomNavbar = () => {

    const access = sessionStorage.getItem('access_token')
    return (
        <>
                        {access ? (
                <Navbar bg="dark" variant="dark">
                    <Container>
                        <Navbar.Brand href="/">Navbar</Navbar.Brand>
                        <Nav className="me-auto">
                            <Nav.Link href="/friends">Friends</Nav.Link>
                            <Nav.Link href="/chats">Chats</Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>
            ) : (
                <Navbar bg="dark" variant="dark">
                    <Container>
                        <Nav className="me-auto">
                            <Nav.Link href="/logout">Logout</Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>
            )
            }

        </>
    )
};
export default CustomNavbar