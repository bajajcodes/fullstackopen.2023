const RECUER_STATES = {
  'VOTE': 'VOTE',
  'RESET': 'RESET',
  'NEW_ANECDOTE':'NEW_ANECDOTE'
}


const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)
  
const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

const reducer = (state = initialState, action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch(action.type){
    case RECUER_STATES.VOTE:
      const id = action.payload.id;
      const anecdoteToVote = state.find(a => a.id === id);
      const anecdoteToChange = {...anecdoteToVote, votes: anecdoteToVote.votes + 1}
      return state.map(a => a.id === id ? anecdoteToChange : a);
    case RECUER_STATES.NEW_ANECDOTE:
      return [...state, asObject(action.payload.content)]
    case RECUER_STATES.RESET:
        return initialState
    default: return state;

  }

}

export function voteAnecdote(id){
  return {
    type: RECUER_STATES.VOTE,
    payload: {id}
  }
}

export function reset(){
  return {
    type: RECUER_STATES.RESET
  }
}

export function createAnecdote(content){
  return {
    type: RECUER_STATES.NEW_ANECDOTE,
    payload: {content}
  }
}

export default reducer