import React, {  PropTypes} from 'react';
import  '../css/TestQuiz.css';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import LeftIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import RightIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

export default class ActionButtonsBar extends React.Component {
  render() {
    const {handlePreviousQuestion, handleNextQuestion, disabledNext, disabledPrevious} = this.props;
    return (
      <div className="top-button-bar">
          <div className="left-button">
              <FloatingActionButton onClick={handlePreviousQuestion} disabled={disabledPrevious}>
                  <LeftIcon />
              </FloatingActionButton>
          </div>

          <div className="right-button">
              <FloatingActionButton onClick={handleNextQuestion} disabled={disabledNext}>
                  <RightIcon />
              </FloatingActionButton>
          </div>
      </div>
    );
  }
}

ActionButtonsBar.propTypes = {
  disabledPrevious: PropTypes.bool,
  disabledNext: PropTypes.bool,
  handlePreviousQuestion: PropTypes.func,
  handleNextQuestion: PropTypes.func,
}
