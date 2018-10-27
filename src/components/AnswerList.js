import React, { PropTypes } from 'react';

import RadioButton from 'material-ui/RadioButton/RadioButton.js';
import RadioButtonGroup from 'material-ui/RadioButton/RadioButtonGroup.js';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const muiTheme = getMuiTheme();
const styles = {
        label: {
            textAlign: 'left',
        },
    };

export default class AnswerList extends React.Component {
    handleChange = (event,value) => {
        this.props.onAnswerChange(value);
    };

    render() {
        const { questionId, answer, name } = this.props;
        return (
            <MuiThemeProvider muiTheme={muiTheme}>

                <RadioButtonGroup valueSelected={answer}  name={name} onChange={this.handleChange}>
                    {
                        this.props.answers.map(function(answerObject) {
                            return (
                                <RadioButton
                                    value={answerObject.value}
                                    label={answerObject.text}
                                    labelStyle={styles.label}
                                    key={questionId + '-' + answerObject.id}
                                />
                            );
                        })
                    }
                </RadioButtonGroup>
            </MuiThemeProvider>
        );
    }
}

AnswerList.propTypes = {
    name: PropTypes.string.isRequired,
    questionId: PropTypes.string,
    answers: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
    }))
};
