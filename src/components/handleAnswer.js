import React from 'react';
import { Button } from 'semantic-ui-react'

export default function handleAnswer(userGuess = null, testing = null){
  let ans = this.state.quizGuesses;
  let cor = this.state.quizAnswers;
  let idx = this.state.activeQuestionNum;
  let text, nextButton, divContent;

  if(userGuess) {
    let correctAlpha = this.state.quizAnswers[this.state.activeQuestionNum]
    let answer, result;

    answer = this.state.geographyPaths
        .find(geo => geo.properties.alpha3Code === correctAlpha )
        .properties;
    
    if(testing === "name") {
      answer = answer.spellings;
      result = answer.some(name => userGuess.toLowerCase() === name.toLowerCase())
    } else {
      answer = answer.capital;
      result = userGuess.toLowerCase() === answer.toLowerCase()
    }

    text = `${userGuess} is ${result ? "correct!":"incorrect!"}`;
    this.handleMapRefresh({quizGuesses: [...this.state.quizGuesses, result]})
  } else {
    text = ans[idx] ? "That is correct!":"That is incorrect!";
  }

  if(idx === cor.length){
    var score = ans.reduce((total, x, i) => total += x*1, 0);
    divContent = <p>Your score is {score} / {cor.length} or {Math.round(score/cor.length*100)}%</p>
  } else {
    nextButton = <Button 
      autoFocus
      onClick={ () => {
        this.setState( prevState => 
          ({
            viewInfoDiv: false,
            activeQuestionNum: prevState.activeQuestionNum + 1,
          })
          , () => { 
            setTimeout(() => {
              this.handleMapRefresh({ selectedProperties: ""})
            }, this.state.infoDuration)
          }
        )
      }
    }>NEXT</Button>;

    divContent = <div><p>{text}</p>{nextButton}</div>
  }

  return (
    <div>
      {divContent}
    </div>
  )
}
