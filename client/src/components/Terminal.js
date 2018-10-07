import React, { Component } from 'react';
import TerminalContent from './TerminalContent';

export default class Terminal extends Component {
  state = {
    /** @type {HTMLInputElement} */
    input: {
      focus: () => { },
      value: '',
      selectionStart: '',
    },
  }

  history = [];
  selected = -1;

  activeKeys = {};

  componentDidUpdate(prevProps) {
    if (prevProps.children[1].length !== this.props.children[1].length && this.state.input.value) {
      this.eraseInput();
    }
  }

  eraseInput = () => {
    const input = this.state.input;
    input.value = '';

    this.setState({ input });
  }

  focusInput = () => {
    if (this.state.input) {
      this.state.input.focus();
    }
  }

  updateInput = e => {
    const input = this.state.input;
    input.value = e.target.value;

    this.setState({
      input: this.state.input
    });
  }

  handleInputKeyDown = e => {
    this.activeKeys[e.key.toUpperCase()] = true;

    const input = this.state.input;

    if (this.activeKeys['CONTROL'] && e.key !== 'Control') {
      const acceptable = new Set([
        'C'
      ]);

      if(acceptable.has(e.key.toUpperCase())) {
        this.props.onControl(e.key, this.state.input.value);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();

      this.selected++;

      if (this.selected >= this.history.length) {
        this.selected = this.history.length - 1;
      } else {
        input.value = this.history[this.history.length - 1 - this.selected] || '';
        this.setState({ input });
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();

      this.selected--;

      if (this.selected < -1) {
        this.selected = -1;
      } else {
        input.value = this.history[this.history.length - 1 - this.selected] || '';
        this.setState({ input });
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      input.selectionStart = e.target.selectionStart;
      this.setState({ input });
    }
  }

  handleInputKeyUp = e => {
    this.activeKeys[e.key.toUpperCase()] = false;

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const input = this.state.input;

      input.selectionStart = e.target.selectionStart;
      this.setState({ input });
    }
  }

  sendCommand = e => {
    e.preventDefault();

    const input = this.state.input;
    input.value = input.value.trim();

    if (this.props.sendCommand) {
      this.props.sendCommand(this.state.input.value);
    }

    if (input.type !== 'password' && input.value && this.history[this.history.length - 1] !== input.value) {
      this.history.push(input.value);
    }

    this.selected = -1;
    input.value = '';

    this.setState({
      input
    });
  }

  render() {
    const { children, prefix = '', prefixNoColor = false, inputType = null, hideInput = false } = this.props;

    return (
      <form onSubmit={this.sendCommand} className="terminal" onClick={this.focusInput}>
        <div>
          {children}
        </div>
        <div className={hideInput ? ' invisible' : ''}>
          <span className={"terminal-prefix" + (prefixNoColor ? " color-inherit" : "")}>{prefix} </span>
          <TerminalContent
            selectionStart={inputType === 'password' ? 0 : this.state.input.selectionStart}
            content={inputType === 'password' ? '' : this.state.input.value}
          />
        </div>
        <input
          // eslint-disable-next-line
          ref={input => this.state.input = input}
          type={inputType || 'text'}
          className="input-hidden"
          value={this.state.input.value}
          onChange={this.updateInput}
          onKeyDown={this.handleInputKeyDown}
          onKeyUp={this.handleInputKeyUp}
          autoComplete="off"
          autoFocus={true}
        />
        <button className="hidden" type="submit"></button>
      </form>
    )
  }
}