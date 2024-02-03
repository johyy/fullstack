const Course = ({ course }) => {
    return (
      <div>
        <Header course={course} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
  }
  
  const Header = (props) => {
    return (
      <div>
        <h2>{props.course.name}</h2>
      </div>
    )
  }
  
  const Content = ({ parts }) => {
    return (
      <div>
        {parts.map((part, index) => (
          <Part key={index} part={part.name} exercises={part.exercises} />
        ))}
      </div>
    )
  }
  
  const Total = ({ parts }) => {
    const total = parts.reduce( (s, p) => s + p.exercises, 0)
  
    return (
      <div>
        <p><b>Number of exercises {total}</b></p>
      </div>
    )
  }
  
  const Part = (props) => {
    return (
      <p>
        {props.part} {props.exercises}
      </p>
    )
  }
 
  export default Course