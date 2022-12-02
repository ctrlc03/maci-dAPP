import React, { useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap' 
import { useAccount } from 'wagmi'
import { toast } from 'react-toastify'
import MovieCard from '../components/movieCard/movieCard'
import MaciDetails from '../components/maciDetails/maciDetails';
import axios from 'axios'

import './home.css'

export default function Home() {

    // client to talk to the API
    const client = axios.create({
        baseURL: process.env.REACT_APP_API_URL
    });

    // get the account
    // used to only display the content if we are connected to a wallet
    const account = useAccount()

    const [ movies, setMovies ] = useState([])

    useEffect(() => {
        async function getMovies() {
            const resp = await client.get('movies')
            if (resp.status === 200) setMovies(resp.data)
        }

        getMovies().catch()
    }, [])


    const createMovieSubmission = async (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const formDataObject = Object.fromEntries(formData.entries())

        const title = formDataObject.title 
        const url = formDataObject.url 
        const imageUrl = formDataObject.image

        // submit to contract
        const resp = await client.post('movie', {
            title: title,
            url: url,
            imageUrl: imageUrl
        })

        if (resp.status === 200) toast.success(`Successfully submitted a movie`)
        else toast.warning('Failed to submit a new movie')

        location.reload()
    }

    const RenderMovies = () => {
        if (movies.length > 0) {
            return movies.map((item, index) => {
                return (
                    <MovieCard key={index} 
                    id={item.id}
                    image={item.imageUrl} 
                    title={item.title}
                    url={item.url} />
                )
            })
        }
    }

    return (
        <Container>
            <Row className="titleRow">
                <span className="title">MACI's christmas movie voting</span>
            </Row>
            {
                account.isConnected ?
                <>
                    <Row className='maciDetailsRow'>
                        <MaciDetails />
                    </Row>
                

                    <Row className="moviesRow">
                        <span className='rowIntro'>Available movies</span>
                    </Row>

                    <Row className="cardDisplay">
                        <RenderMovies />
                    </Row>
                    <Row className="addAMovieRow">
                        <span className="rowIntro">Propose your movie</span>
                        <form onSubmit={createMovieSubmission} className="formStyle">
                            <div>
                                <input type='text' name="title" className="formInput modalForm" placeholder='Title' />
                            </div>
                            <div>
                                <input type='text' name="url" className="formInput modalForm" placeholder='URL'/>
                            </div>
                            <div>
                                <input type='text' name="image" className="formInput modalForm" placeholder='Image URL'/>
                            </div>
                            <div>
                                <button type='submit' className="formButton">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </Row>
               </> :
               <Row style={{marginTop: '10%'}}>
                    <h4>Connect your wallet</h4>
               </Row>

            }    
        </Container>
    )
}