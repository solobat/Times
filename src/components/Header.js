import React, { PropTypes, Component } from 'react'
import TodoTextInput from './TodoTextInput'

class Header extends Component {
  handleSave(text, times) {
    if (text.length !== 0) {
      this.props.addTodo(text, times)
    }
  }

  render() {
    return (
      <header className="header">
          <h1>Times</h1>
          <TodoTextInput newTodo
                         onSave={this.handleSave.bind(this)}
                         placeholder="应该做点儿啥?" />
      </header>
    )
  }
}

Header.propTypes = {
  addTodo: PropTypes.func.isRequired
}

export default Header
