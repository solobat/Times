import { ADD_TODO, DELETE_TODO, EDIT_TODO, ADD_TIMES, COMPLETE_ALL, CLEAR_COMPLETED, RESET_TIMES } from '../constants/ActionTypes'

const initialState = [
  {
    text: '喝水',
    times: 8,
    dotimes: 0,
    completed: false,
    level: 0,
    id: 0
  }
]

function getLevelByTimes(all, cur) {
  if (!cur) {
    return 0
  }

  var ratio = all / cur

  if (ratio >= 4) {
    return 0
  }
  else if (ratio >= 3) {
    return 1
  }
  else if (ratio >= 2) {
    return 2
  }
  else if (ratio >= 1) {
    return 3
  }
  else if (ratio >= 0.5) {
    return 4
  }

  return 5
}

export default function todos(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        {
          id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
          completed: false,
          text: action.text,
          times: action.times,
          dotimes: 0,
          level: 0
        },
        ...state
      ]

    case DELETE_TODO:
      return state.filter(todo =>
        todo.id !== action.id
      )

    case EDIT_TODO:
      return state.map((todo) => {
        if (todo.id === action.id) {
          const level = getLevelByTimes(action.times, todo.dotimes)

          return Object.assign({}, todo, {
            level: level,
            times: action.times,
            completed: todo.dotimes >= action.times
          })
        } else {
          return todo
        }
      })

    case ADD_TIMES:
      return state.map((todo) => {
        if (todo.id === action.id) {
          const dotimes = todo.dotimes + 1
          const level = getLevelByTimes(todo.times, dotimes)

          return Object.assign({}, todo, {
            dotimes: todo.dotimes + 1,
            level: level,
            completed: todo.dotimes + 1 >= todo.times
          })
        } else {
          return todo
        }
      })

    case COMPLETE_ALL:
      const areAllMarked = state.every(todo => todo.completed)
      return state.map(todo => Object.assign({}, todo, {
        completed: !areAllMarked
      }))

    case CLEAR_COMPLETED:
      return state.filter(todo => todo.completed === false)

    case RESET_TIMES:
      return state.map(todo => Object.assign({}, todo, {
        dotimes: 0,
        level: 0,
        completed: false
      }))

    default:
      return state
  }
}
