/* eslint-disable react/prop-types */
import { useState } from 'react'
import {Routes, Route, Link, useMatch, useNavigate} from "react-router-dom";
import { useFields} from "./hooks"

const padding = {
  paddingRight: 5
}

const menuItems = [
  {
    to: "/anecdotes",
    text: "anecdotes",
  },
  {
    to: "/create",
    text: "create new",
  },
  {
    to: "/about",
    text: "about",
  },
]

const formFields = [
  {name: "content", type: "text", label: "content"}, 
  {name: "author", type: "text", label: "author"}, 
  {name: "info", type: "text", label: "url for more info"}
];


const Menu = () => {
  return (
    <div>
      {
        menuItems.map(item => (<Link key={item.text} to={item.to} style={padding}>{item.text}</Link>))
      }
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => <li key={anecdote.id} ><Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link></li>)}
    </ul>
  </div>
)

const Anecdote = ({anecdote}) => (
  <div>
    <div>
      <h2>{anecdote.content}</h2>
      <div>{anecdote.author}</div>
      <div>Votes: <strong>{anecdote.votes}</strong></div>
      <div>for more info see <Link to={anecdote.info}>{anecdote.info}</Link></div>
    </div>
  </div>
)

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is ``a story with a point.``</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = (props) => {
  const {fields, values, onChange, reset} = useFields(formFields);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAnecdote = formFields.reduce((acc, {name}) => ({...acc, [name]: values[name] || ""}), {votes: 0});
    props.addNew(newAnecdote)
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        {
          fields.map(({label, ...field}) => (
            <div key={field.name}>
            {label}
            <input {...field} onChange={onChange} value={values[field.name]}  />
          </div>
          ) )
        }
        <button type="submit">create</button>
        <button onClick={() => reset()} type="button">reset</button>
      </form>
    </div>
  )

}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ]);
  const navigate = useNavigate();

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote));
    setNotification(`Succesfully created anecodte: ${anecdote.content}`);
    setTimeout(() => setNotification(''), 5000);
    navigate("/anecdotes");
  }

  // const vote = (id) => {
  //   const anecdote = anecdoteById(id)

  //   const voted = {
  //     ...anecdote,
  //     votes: anecdote.votes + 1
  //   }

  //   setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  // }

  const match = useMatch("/anecdotes/:id");
  const anecdote = match ? anecdotes.find(anecdote => anecdote.id === Number(match.params.id)) : null;
  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      {
        notification && <h3>{notification}</h3>
      }
      <Routes>
        <Route path="/anecdotes/:id" element={<Anecdote anecdote={anecdote} />} />
        <Route path="/anecdotes" element={<AnecdoteList anecdotes={anecdotes} />} />
        <Route path='/create' element={<CreateNew addNew={addNew} />} />
        <Route path="/about" element={<About />} />
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
