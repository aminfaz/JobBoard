import React from 'react';
import PropTypes from "prop-types";
import JobCard from './JobCard';

function JobList(props) {
  function renderJobCard(job) {
    return (
      <JobCard
        id={job.id}
        title={job.title} 
        location={job.location} 
        date={job.date} 
        isSelected={props.selectedJobId===job.id}
        key={job.id}
        jobCardClickHandler={props.jobCardClickHandler}/>
    )
  }

  return (
    <div className="overflow-auto jobList">
      {props.jobs.map(renderJobCard)}
    </div>
  );
}

const locationShape = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired
};

const jobShape = {
  title: PropTypes.string.isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  date: PropTypes.string.isRequired
};

JobList.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.shape(jobShape)).isRequired,
  selectedJobId: PropTypes.number,
  jobCardClickHandler: PropTypes.func.isRequired
};

export default JobList;
