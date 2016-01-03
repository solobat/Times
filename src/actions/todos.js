import * as types from '../constants/ActionTypes'

export function addTodo(text, times) {
  return { type: types.ADD_TODO, text, times }
}

export function deleteTodo(id) {
  return { type: types.DELETE_TODO, id }
}

export function editTodo(id, text, times) {
  return { type: types.EDIT_TODO, id, text, times }
}

export function addTimes(id) {
  return { type: types.ADD_TIMES, id }
}

export function completeAll() {
  return { type: types.COMPLETE_ALL }
}

export function clearCompleted() {
  return { type: types.CLEAR_COMPLETED }
}
