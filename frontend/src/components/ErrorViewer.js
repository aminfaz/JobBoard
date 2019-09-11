import React from "react";

function ErrorViewer(props) {
  console.error(props.error);
  let message = props.error.message ? props.error.message : props.error;
  return (
    <div className="container errorContainer">
      <div>{message}</div>
    </div>
  );
}

export default ErrorViewer;