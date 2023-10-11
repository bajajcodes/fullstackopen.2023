import { useSelector, useDispatch } from 'react-redux'
import { createAnecdote, voteAnecdote } from './reducers/anecdoteReducer'
import Filter from './components/Filter'
import { searchFilterChange } from './reducers/filterReducer'

const App = () => {
  const anecdotes = useSelector(state => {
    if(!state.filter.search) return state.anecdotes
    return state.anecdotes.filter(a => a.content.includes(state.filter.search));
  });
  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes);
  const dispatch = useDispatch()

  const vote = (id) => {
    console.log('vote', id);
    dispatch(voteAnecdote(id));
  }

  const addNewNote = (event) => {
    event.preventDefault();
    const content = event.target.content.value;
    dispatch(createAnecdote(content))
    event.target.content.value = "";
  }


  return (
    <div>
      <h2>Anecdotes</h2>
      <Filter onFilterChange={(filter) => dispatch(searchFilterChange(filter))} />
      {sortedAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
      <h2>create new</h2>
      <form onSubmit={addNewNote}>
        <div><input name="content" /></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default App