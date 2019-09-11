import React from 'react';
import PropTypes from "prop-types";
import { Container, Row, Col } from 'react-bootstrap';

function JobCard(props) {
  const containerClasses = ['jobCard'];
  if (props.isSelected) {
    containerClasses.push('jobCard-Selected');
  }
  
  return (
    <Container onClick={()=>{props.jobCardClickHandler(props.id)}} className={containerClasses.join(" ")}>
      <Row>
        <Col className="jobTitle">{props.title}</Col>
      </Row>
      <Row>
        <Col className="jobLocation">{props.location.name}</Col>
        <Col className="jobDate">{props.date}</Col>
      </Row>
    </Container>
  );
}

const locationShape = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired
};

JobCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  date: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  jobCardClickHandler: PropTypes.func.isRequired
};

export default JobCard;
