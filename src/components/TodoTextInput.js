import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

class TodoTextInput extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      text: this.props.text || '',
      times: this.props.times || 1
    }
  }

  handleSubmit() {
    const text = this.refs.todoText.value.trim()
    const times = this.refs.todoTimes.value

    this.props.onSave(text, times)
    if (this.props.newTodo) {
      this.setState({ text: '', times: 1 })
    }
  }

  handleTextChange(e) {
    this.setState({ text: e.target.value })
  }

  handleTimesChange(e) {
    this.setState({ times: e.target.value })
  }

  render() {
    return (
      <div>
      <input className={
        classnames({
          edit: this.props.editing,
          'new-todo': this.props.newTodo
        })}
        type="text"
        placeholder={this.props.placeholder}
        autoFocus="true"
        value={this.state.text}
        ref="todoText"
        onChange={this.handleTextChange.bind(this)}
        />
      <input className="todo-times"
        type="number"
        value={this.state.times}
        ref="todoTimes"
        onChange={this.handleTimesChange.bind(this)}
        />
      <input className="confirm"
        type="button"
        value="确定"
        onClick={this.handleSubmit.bind(this)}
        />
    </div>
    )
  }
}

TodoTextInput.propTypes = {
  onSave: PropTypes.func.isRequired,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  editing: PropTypes.bool,
  newTodo: PropTypes.bool
}

export default TodoTextInput
