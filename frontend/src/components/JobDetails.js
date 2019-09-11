import React from 'react';
import PropTypes from 'prop-types';
import ErrorViewer from './ErrorViewer';
import JobsAPI from '../api/JobsAPI';
import { Spinner } from 'react-bootstrap';

class JobDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      job: null,
      id: props.id,
      error: null
    };
  }

  async componentDidMount() {
    const id = this.state.id;
    if (isNaN(id) || id < 1) {
      return;
    }
    try {
      let job = await JobsAPI.getJob(id);
      this.setState({
        job
      });
    } catch (ex) {
      let error = {
        message: 'Could not load job',
        inner: ex
      };
      this.setState({
        error
      });
    }
  }

  renderApplicants(applicant) {
    return (
      <li key={applicant.id}>{applicant.name}</li>
    )
  }

  render() {
    const { job, id, error } = this.state;

    if (error) {
      return <ErrorViewer error={error} />;
    }

    if (!id){
      return (<div className="jobDetails loadingContainer">Please select</div>)
    }

    if (!job) {
      return (
        <div className="jobDetails loadingContainer">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      );
    }
    
    return (
      <div className="jobDetails">
        <p><strong>{job.title}</strong></p>
        <p>
          <strong>Description: </strong>
          {job.description}
        </p>
        <p>
          <strong>Location: </strong>
          {job.location.name}
        </p>
        <p>
          <strong>Date: </strong>
          {job.date}
        </p>
        <div>
          <strong>Applicants: </strong>
          <ul>
            {job.applicants.map(this.renderApplicants)}
          </ul>
        </div>
      </div>
    );
  }
}

JobDetails.propTypes = {
  id: PropTypes.number
};

export default JobDetails;
