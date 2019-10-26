import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';

import Container from '../../components/Container';
import { Loading, Owner, IssueList, StyledButton } from './styles';

export default class Repository extends Component {
    static propTypes = {
        match: PropTypes.shape({
            params: PropTypes.shape({
                repository: PropTypes.string,
            }),
        }).isRequired
    };

    state = {
        repository: {},
        issues: [],
        loading: true,
        issueStatus: 'all',
        page: 1,
        disablePrevButton: true
    }
    
    async componentDidMount() {
        const { match } = this.props;

        const repoName = decodeURIComponent(match.params.repository);
        
        const [repository, issues] = await Promise.all([
            api.get(`repos/${repoName}`),
            api.get(`repos/${repoName}/issues`,{
                params: {
                    status: 'open',
                    per_page: 30,
                    page: 1
                }
            })
        ]);

        this.setState({
            repository: repository.data,
            issues: issues.data,
            loading: false,
        })

    }

    componentDidUpdate(_,prevState) {
        const { disablePrevButton, page } = this.state;

        if(page <= 1) {
            console.log("DESATIVE")
        }
        // if (prevState.repositories !== repositories) {
        //     localStorage.setItem('repositories',JSON.stringify(repositories))
        // }
    }


    issuesRequest = async (state, page) => {
    
        let newPage = this.state.page;
        if(page === 'prev') {
            newPage = newPage-1;
        } else {
            newPage = newPage+1;
        }

        let { match } = this.props;

        let repoName = decodeURIComponent(match.params.repository);

        let [repository, issues] = await Promise.all([
            api.get(`repos/${repoName}`),
            api.get(`repos/${repoName}/issues`,{
                params: {
                    status: state,
                    per_page: 30,
                    page: newPage
                }
            })
        ]);

        this.setState({
            repository: repository.data,
            issues: issues.data,
            loading: false,
            issueStatus: state,
            page: newPage,
            disablePrevButton: newPage <= 1 ? true : false
        })
    }

    render() {
        const { repository, issues, loading, page, issueStatus, disablePrevButton } = this.state;
        // console.log(disablePrevButton);

        if (loading) {
            return <Loading>Carregando</Loading>
        }

        return (
            <Container>
                <Owner>
                    <Link to="/"> Voltar aos repositorios </Link>
                    <img src={repository.owner.avatar_url} alt={repository.owner.login} />
                    <h1>{repository.name}</h1>
                    <p>{repository.description}</p>
                </Owner>

                <StyledButton onClick={() => {this.issuesRequest('all',page)}} >
                    Todos
                </StyledButton>

                <StyledButton onClick={() => {this.issuesRequest('open',page)}} >
                    Abertos
                </StyledButton>

                <StyledButton onClick={() => {this.issuesRequest('closed',page)}} >
                    Fechados
                </StyledButton>

                <StyledButton disablePrevButton={disablePrevButton} onClick={() => {this.issuesRequest(issueStatus,'prev')}}>
                    prev
                </StyledButton>

                <StyledButton onClick={() => {this.issuesRequest(issueStatus,'next')}}>
                    next
                </StyledButton>

                <IssueList>
                    {issues.map(issue => (
                        <li key={String(issue.id)}>
                            <img src={issue.user.avatar_url} alt={issue.user.login} />
                            <div>
                                <strong>
                                    <a href={issue.html_url}> {issue.title} </a>
                                    {issue.labels.map(label => (
                                        <span key={String(label.id)}>{label.name}</span>
                                    ))}
                                </strong>
                                <p>{issue.user.login}</p>
                            </div>
                        </li>
                    ))}
                </IssueList>
            </Container>
        )
    }
    
}
