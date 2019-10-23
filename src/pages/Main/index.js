import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';

import api from '../../services/api';

import { Container, Form, SubmitButton } from './styles';

export default class Main extends Component {
    state = {
        newRepo: '',
    }

    handleInputChange = e => {
        this.setState({
            newRepo: e.target.value,
            repositories: [],
            loading: false
        })
    }

    handleSubmit = async e => {
        e.preventDefault();

        this.setState({ loading: true })

        const { newRepo, repositories } = this.state;

        const response = await api.get(`/repos/${newRepo}`)

        const data = {
            name: response.data.full_name,
        };

        this.setState({
            repositories: [...repositories,data],
            newRepo: '',
            loading: false
        })

        console.log(this.state);
    }

    render() {
        const { newRepo, loading } = this.state;
        return (
        <Container>
            <h1>
                <FaGithubAlt />
                Repositorios
            </h1>

            <Form onSubmit={this.handleSubmit}>
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
        </Container>
        )
    }  
}
