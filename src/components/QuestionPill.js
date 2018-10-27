import React, {PropTypes} from 'react';
import  '../css/ResumeAnswers.css';


export default class QuestionPill extends React.Component {

    componentWillmount
    render(){
      const {moveToQuestion, currentQuestionPill, questionNumber, completedPill} = this.props;
      var classes = "questionPill";

      if(completedPill) {
        classes += " completedPill";
      }

      if(currentQuestionPill) {
        classes += " currentQuestionPill";
      }

      return (
        <div onClick={() => moveToQuestion(Number(questionNumber))} className={classes} >{Number(questionNumber)+1}</div>
      )
    }
}

QuestionPill.propTypes = {
  moveToQuestion: PropTypes.func,
  questionNumber: PropTypes.number,
  completedPill: PropTypes.bool,
  currentQuestionPill: PropTypes.bool
}
