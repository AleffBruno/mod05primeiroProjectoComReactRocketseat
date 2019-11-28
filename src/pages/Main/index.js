import React, { useState, useEffect } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

export default function Main() {
    // state = {
    //     newRepo: '',
    //     repositories: [],
    //     loading: false,
    //     errorRequest: false
    // }

    const [newRepo, setNewRepo] = useState('');
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorRequest, setErrorRequest] = useState(false);

    useEffect(() => {
        const repositories = localStorage.getItem('repositories');

        if (repositories) {
            setRepositories(JSON.parse(repositories))
            // this.setState({
            //     repositories: JSON.parse(repositories)
            // })
        }
    }, [])

    // componentDidMount() {
    //     const repositories = localStorage.getItem('repositories');

    //     if (repositories) {
    //         this.setState({
    //             repositories: JSON.parse(repositories)
    //         })
    //     }
    // }

    useEffect(() => {
        localStorage.setItem('repositories',JSON.stringify(repositories))
    }, [repositories])

    // componentDidUpdate(_,prevState) {
    //     const { repositories } = this.state;

    //     if (prevState.repositories !== repositories) {
    //         localStorage.setItem('repositories',JSON.stringify(repositories))
    //     }
    // }

    function handleInputChange(e) {
        setNewRepo(e.target.value)
        // this.setState({
        //     newRepo: e.target.value,
        // })
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            // this.setState({ loading: true })
            setLoading(true);

            // const { newRepo, repositories } = this.state;
    
            const response = await api.get(`/repos/${newRepo}`)
    
            const data = {
                name: response.data.full_name,
            };

            if (repositories.some(e => e.name === newRepo)) {
                throw new Error('Repositório duplicado');
            }
    
            setRepositories([...repositories,data]);
            setNewRepo('');
            setLoading(false);
            setErrorRequest(false);
            // this.setState({
            //     repositories: [...repositories,data],
            //     newRepo: '',
            //     loading: false,
            //     errorRequest: false,
            // })
    
        } catch (e) {
            setErrorRequest(true);
            // this.setState({
            //     errorRequest: true
            // })
            console.log('deu ruim', e);
        }
        
        setLoading(false);
        // this.setState({
        //     loading: false
        // })
    }

    
    // const { newRepo, repositories, loading, errorRequest } = this.state;
    return (
    <Container>
        <h1>
            <FaGithubAlt />
            Repositorios
        </h1>

        <Form onSubmit={handleSubmit} errorRequest={errorRequest}>
            <input
                type="text"
                placeholder="Add repository"
                value={newRepo}
                onChange={handleInputChange}
            />
            
            <SubmitButton loading={loading}>
                { loading ? (
                    <FaSpinner color="#FFF" size={14}></FaSpinner>
                ) : (
                    <FaPlus color="#FFF" size={14}></FaPlus>
                )}
                
            </SubmitButton>
        </Form>

        <List>
            {repositories.map(repository => (
                <li key={repository.name}>
                    <span>{repository.name}</span>
                    <Link to={`/repository/${encodeURIComponent(repository.name)}`}>Detalhes</Link>
                </li>
            ))}
        </List>
    </Container>
    )
    
}
