import React, {PropTypes} from 'react';
import  '../css/Pagination.css';

export default class Pagination extends React.Component {
  render() {
    const {currentQuestion, questionsLength} = this.props;
    return (
      <div className="pagination">
          {currentQuestion +1 }/{questionsLength}
      </div>
    );
  }
}

Pagination.propTypes = {
  currentQuestion : PropTypes.number.isRequired,
  questionsLength : PropTypes.number.isRequired,
};
