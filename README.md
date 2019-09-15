# Job Board

## Description
The Application is parsing a list of jobs and applicants from a remote server in csv format and render it in a page.
[Demo](https://job-board.fazl.guru)

* The application will load the CSV file only at start-up and stores it in a relational database. (assumption: applicant names are unique). 
* Users is able to view a list of jobs with title, location and date.
* Users is able to click on a job to view more details about it.


## Setup
* Install [Docker](https://docs.docker.com/get-started/)
* Build: `docker-compose build`
* Run: `docker-compose up`

## Development
* React frontend: http://localhost
* Node backend: http://localhost:8080
