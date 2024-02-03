import { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = ({ message, name }) => {
  if (message === null || name === null) {
    return null;
  }
  if (message === "add") {
    return (
      <div className='add'>
         {`Added ${name}`}
      </div>
    )
  }
  if (message === "remove") {
    return (
      <div className='remove'>
        {`Deleted ${name}`}
      </div>
    )
  }
  if (message === "update") {
    return (
      <div className='update'>
        {`Updated ${name}`}
      </div>
    )
  }
  if (message === "error") {
    return (
      <div className='error'>
        {`Information of ${name} has already been removed from server`}
      </div>
    )
  }
}

const Filter = (props) => {
  return (
    <form onSubmit={props.filterName}>
    <div>
      filter shown with <input
        value={props.newFilter}
        onChange={props.handleFiltering}
        />
    </div>
  </form>
  )
}

const Personform = (props) => {
  return (
    <form onSubmit={props.addName}>
    <div>
      name: <input 
        value={props.newName}
        onChange={props.handleNameAdding}
      />
    </div>
    <div>
      number: <input
        value={props.newNumber}
        onChange={props.handleNumberAdding}
      />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

const Persons = ({ filteredPersons, removePerson }) => {
  return (
    <div>
    {filteredPersons.map(person => (
      <p key={person.name}>
        {person.name} {person.number}
        <button onClick={() => removePerson(person.id, person.name)}>delete</button>
      </p>
    ))}
  </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notificationMessafe, setNotificationMessage] = useState(null)
  const [notificatioName, setNotificationName] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const removePersonOf = (id, name) => {
    const confirmRemoval = window.confirm(`Delete ${name}?`)

    if (confirmRemoval) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        setNotificationName(name)
        setNotificationMessage('remove')
        setTimeout(() => {
          setNotificationMessage(null)
          setNotificationName(null)
        }, 3000)
      }
  }

  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }
    if (!persons.some(person => person.name.toLowerCase() === newName.toLowerCase())) {
      personService
        .create(nameObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNotificationName(newName)
          setNewName('')
          setNewNumber('')
          setNotificationMessage('add')
          setTimeout(() => {
            setNotificationMessage(null)
            setNotificationName(null)
          }, 3000)
        })
    } else {
      const existingPerson = persons.find(person => person.name.toLowerCase()  === newName.toLowerCase())
      const confirmUpdate = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      
      if (confirmUpdate) {
        personService
          .update(existingPerson.id, nameObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
            setNotificationName(newName)
            setNotificationMessage('update')
            
         })
          .catch(error => {
            setNotificationName(newName)
            setNotificationMessage('error')
            setPersons(persons.filter(person => person.id !== existingPerson.id));
 
          })
          .finally(() => {
            setNewName('')
            setNewNumber('')
            setTimeout(() => {
              setNotificationMessage(null)
              setNotificationName(null)
            }, 3000)
          })
  
      } else {
        setNewName('')
        setNewNumber('')
      }
    }
  }

  const filterName = (event) => {
    event.preventDefault()
    console.log(event)
  }

  const handleNameAdding = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberAdding = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFiltering = (event) => {
    setNewFilter(event.target.value)
  }
  
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  );

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notificationMessafe} name={notificatioName}/>

      <Filter filterName={filterName} newFilter={newFilter} handleFiltering={handleFiltering} />

      <h2>add a new</h2>

      <Personform addName={addName} newName={newName} handleNameAdding={handleNameAdding} newNumber={newNumber} handleNumberAdding={handleNumberAdding} />

      <h2>Numbers</h2>

      <Persons 
        filteredPersons={filteredPersons}
        removePerson={removePersonOf}
      />
    </div>
  )

}

export default App