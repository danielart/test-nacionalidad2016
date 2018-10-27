import React, {  PropTypes} from 'react';
import  AnswerList  from './AnswerList.js';

import '../css/Question.css';

import Paper from 'material-ui/Paper';


export default class Question extends React.Component {

    render() {
        return (
            <Paper zDepth={1} className="Question-box" >
                <p className="Question-text">{this.props.questionId} - {this.props.text}</p>
                <AnswerList
                    className="Question-answers"
                    answers={this.props.answers}
                    name={this.props.questionId}
                    answer={this.props.answer}
                    questionId={this.props.questionId}
                    onAnswerChange={this.props.onAnswerChange}  />
            </Paper>
        );
    }
}

Question.propTypes = {
    text: PropTypes.string.isRequired,
    questionId: PropTypes.string.isRequired,
    answers: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired
    }))
};
