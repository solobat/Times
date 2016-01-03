import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import TodoTextInput from './TodoTextInput'
import { TODO_LEVELS } from '../constants/TodoLevel.js'

class TodoItem extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      editing: false
    }
  }

  handleDoubleClick() {
    this.setState({ editing: true })
  }

  handleSave(id, text, times) {
    if (text.length === 0) {
      this.props.deleteTodo(id)
    } else {
      this.props.editTodo(id, text, times)
    }
    this.setState({ editing: false })
  }

  render() {
    const { todo, addTimes, deleteTodo } = this.props

    let element
    if (this.state.editing) {
      element = (
        <TodoTextInput text={todo.text}
                       times={todo.times}
                       editing={this.state.editing}
                       onSave={(text, times) => this.handleSave(todo.id, text, times)} />
      )
    } else {
      element = (
        <div className="view" data-level={TODO_LEVELS[todo.level]}>
          <input className="add-times"
                 type="button"
                 value="+"
                 onClick={() => addTimes(todo.id)} />
          <div className="view-con" onDoubleClick={this.handleDoubleClick.bind(this)}>
            <label>
              {todo.text}
            </label>
            <label>
              {todo.dotimes}/{todo.times}
            </label>
            <button className="destroy"
                    onClick={() => deleteTodo(todo.id)} />
          </div>
        </div>
      )
    }

    return (
      <li className={classnames({
        completed: todo.completed,
        editing: this.state.editing
      })}>
        {element}
      </li>
    )
  }
}

TodoItem.propTypes = {
  todo: PropTypes.object.isRequired,
  editTodo: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  addTimes: PropTypes.func.isRequired
}

export default TodoItem
