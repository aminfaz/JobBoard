import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import JobList from './components/JobList';
import JobDetails from './components/JobDetails';
import ErrorViewer from './components/ErrorViewer';
import JobsAPI from './api/JobsAPI';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      jobs: null,
      error: null,
      seletedId: null
    };
  }

  jobCardClickHandler = (id) => {
    this.setState({
      seletedId: id
    });
  }

  async componentDidMount() {
    try {
      let jobs = await JobsAPI.getJobs();
      this.setState({
        jobs
      });
    } catch (ex) {
      let error = {
        message: "Could not load jobs",
        inner: ex
      };
      this.setState({
        error
      });
    }
  }

  render() {
    const { jobs, error, seletedId } = this.state;

    if (error) {
      return <ErrorViewer error={error} />;
    }

    if (!jobs) {
      return (
        <div className="loadingContainer">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Job Board</h1>
        </header>
        <Container className="App-content">
          <Row>
            <Col md={4} lg={4}>
              <JobList
                jobs={jobs}
                selectedJobId={seletedId}
                jobCardClickHandler= {this.jobCardClickHandler}
              />
            </Col>
            <Col className="shadow-sm">
              <JobDetails id={seletedId} key={seletedId} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
