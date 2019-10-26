import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

export default class Main extends Component {
    state = {
        newRepo: '',
        repositories: [],
        loading: false,
        errorRequest: false
    }

    componentDidMount() {
        const repositories = localStorage.getItem('repositories');

        if (repositories) {
            this.setState({
                repositories: JSON.parse(repositories)
            })
        }
    }

    componentDidUpdate(_,prevState) {
        const { repositories } = this.state;

        if (prevState.repositories !== repositories) {
            localStorage.setItem('repositories',JSON.stringify(repositories))
        }
    }

    handleInputChange = e => {
        this.setState({
            newRepo: e.target.value,
        })
    }

    handleSubmit = async e => {
        e.preventDefault();

        try {
            this.setState({ loading: true })

            const { newRepo, repositories } = this.state;
    
            const response = await api.get(`/repos/${newRepo}`)
    
            const data = {
                name: response.data.full_name,
            };

            if (repositories.some(e => e.name === newRepo)) {
                throw new Error('Repositório duplicado');
            }
    
            this.setState({
                repositories: [...repositories,data],
                newRepo: '',
                loading: false,
                errorRequest: false,
            })
    
        } catch (e) {
            this.setState({
                errorRequest: true
            })
            console.log('deu ruim', e);
        }
        
        this.setState({
            loading: false
        })
    }

    render() {
        const { newRepo, repositories, loading, errorRequest } = this.state;
        return (
        <Container>
            <h1>
                <FaGithubAlt />
                Repositorios
            </h1>

            <Form onSubmit={this.handleSubmit} errorRequest={errorRequest}>
                <input
                    type="text"
                    placeholder="Add repository"
                    value={newRepo}
                    onChange={this.handleInputChange}
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
}
