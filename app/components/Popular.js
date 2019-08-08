import React from 'react'
import PropTypes from 'prop-types'
import { fetchPopularRepos } from '../utils/api'

function LangaugesNav (props) {
  const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python']

  return (
    <ul className='flex-center'>
      {languages.map((language) => (
        <li key={language}>
          <button
            className='btn-clear nav-link'
            style={language === props.selected ? { color: 'rgb(187, 46, 31)' } : null}
            onClick={() => props.onUpdateLanguage(language)}>
            {language}
          </button>
        </li>
      ))}
    </ul>
  )
}

LangaugesNav.propTypes = {
  selected: PropTypes.string.isRequired,
  onUpdateLanguage: PropTypes.func.isRequired
}

export default class Popular extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedLanguage: 'All',
      repos: {},                                   //make it object to iterate over it the keys which will be languages //also for caching
      error: null,
    }

    this.updateLanguage = this.updateLanguage.bind(this)
    this.isLoading = this.isLoading.bind(this)
  }
  componentDidMount () {
    this.updateLanguage(this.state.selectedLanguage)
  }
  updateLanguage (selectedLanguage) {
    this.setState({
        selectedLanguage:selectedLanguage,
        error: null,
        // repos: null                                    // Cannot be null anymore because it might have data fetched from previous state
      })

    if (!this.state.repos[selectedLanguage]) {         // if that selected language does not exist in repo, then only fetch them.

        fetchPopularRepos(selectedLanguage)
          .then((data) => {
            this.setState(({repos}) => ({             //destructure repo so that you can merge new data in
              repos: {
                repos,                                              // now the repo will have current repos + selected language fetched data
                [selectedLanguage]: data
              }
          }))
        })
        .catch(() => {
          console.warn('Error fetching repos: ', error)

          this.setState({
            error: `There was an error fetching the repositories.`
          })
        })
        // fetchPopularRepos(selectedLanguage)
        // .then((data) => this.setState({
        //   repos:data,
        //   error: null,
        // }))
        
    }
  }

  isLoading() {
    const {selectedLanguage, repos, error} = this.state
    return !repos[selectedLanguage] && error === null                       // if repo for selected language does not exist
    }

  render() {
    const { selectedLanguage, repos, error } = this.state

    return (
      <React.Fragment>
        <LangaugesNav
          selected={selectedLanguage}
          onUpdateLanguage={this.updateLanguage}
        />

        {this.isLoading() && <p>LOADING</p>}

        {error && <p>{error}</p>}

        {repos && <pre>{JSON.stringify(repos[selectedLanguage], null, 2)}</pre>}
      </React.Fragment>
    )
  }
}