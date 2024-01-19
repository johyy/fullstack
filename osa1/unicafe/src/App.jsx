import { useState } from 'react'

const Header = (props) => {
  return (
    <div>
      <h1>{props.header}</h1>
    </div>
  )
}

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Average = (props) => {
  if (props.all === 0) {
    return (0) 
  }
  return (
    (props.good + (props.bad*-1))/props.all 
  )
}

const Positive = ({ good, all }) => {
  if (all === 0) {
    return (0)
  }
  return (
    ((good/all)*100)  
  )
}

const Statistics = (props) => {
  if (props.all === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return (
    <table>
      <tbody>
      <Statisticline text="good" value={props.good}/>
      <Statisticline text="neutral" value={props.neutral}/>
      <Statisticline text="bad" value={props.bad}/>
      <Statisticline text="all" value={props.all}/>
      <Statisticline text="average" value={<Average good={props.good} bad={props.bad} all={props.all} />}/>
      <Statisticline text="positive" value={Positive({ good: props.good, all: props.all }).toString() + " %"} />
      </tbody>
    </table>
  )
}

const Statisticline = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)

  const handleGoodClick = () => {
    const newGood = good + 1
    setGood(newGood)
    setAll(newGood + neutral + bad)
  }

  const handleNeutralClick = () => {
    const newNeutral = neutral + 1
    setNeutral(newNeutral)
    setAll(good + newNeutral + bad)
  }

  const handleBadCLick = () => {
    const newBad = bad + 1
    setBad(newBad)
    setAll(good + neutral + newBad)
  }


  return (
    <div>
      <Header header='give feedback'/>
      <Button handleClick={handleGoodClick} text='good' />
      <Button handleClick={handleNeutralClick} text='neutral' />
      <Button handleClick={handleBadCLick} text='bad' />
      <Header header='statistics'/>
      <Statistics good={good} neutral={neutral} bad={bad} all={all} />
    </div>
  )
}

export default App