import { useSelector, useDispatch } from 'react-redux'
import Filter from './components/Filter'
import Notification from "./components/Notification"
import {  searchFilterChange } from './reducers/filterReducer'
import {  createAnecdote,  voteAnecdote } from './reducers/anecdoteReducer';
import { showNotification } from './reducers/notification.reducer';
import ancedoteService from "./services/anecdotes"



const App = () => {
  const anecdotes = useSelector(state => {
    if(!state.filter.search) return state.anecdotes
    return state.anecdotes.filter(a => {
      const filterSanitized = state.filter.search.toLowerCase();
      return a.content.toLowerCase().includes(filterSanitized);
    });
  });
  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes);
  const dispatch = useDispatch()

  const vote = (anecdote) => {
    const id = anecdote.id;
    console.log('vote', id);
    dispatch(voteAnecdote({id}));
   dispatch(showNotification(`Voted for anecdote: ${anecdote.content}.`));
  }

  const addNewNote = async (event) => {
    event.preventDefault();
    const content = event.target.content.value;
    const anecdote = await ancedoteService.createNew(content);
    dispatch(createAnecdote(anecdote));
    dispatch(showNotification(`Created new anecdote: ${content}.`));
        event.target.content.value = "";
  }



  return (
    <div>
      <h2>Anecdotes</h2>
      <Filter onFilterChange={(filter) => dispatch(searchFilterChange(filter))} />
      <Notification />
      {sortedAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
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