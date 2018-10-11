import React, { Component } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

import Terminal from './Terminal';

export default class App extends Component {
  state = {
    prefix: '',
    hideInput: true,
    terminput: {
      prefix: '',
      type: '',
    },
    /**
     * @type {JSX.Element[]}
     */
    rows: [],
  }

  componentDidMount() {
    this.initOS();
  }

  initOS = async () => {
    try {
      /*
      | Get session cookie
      */
      await axios.get('/identify');

      /*
      | Connect to the operating system 
      */
      this.socket = io('', {
        path: '/gateos',
      });

      this.socket.on('connect', () => {
        this.socket.emit('start', this.state.rows.length > 0);
      });

      this.socket.on('ready', () => {
        this.showInput();
      });

      this.socket.on('row', content => {
        this.addRow(content);
      });

      this.socket.on('input', (prefix, type) => {
        this.setState({ terminput: { prefix, type } });
        this.showInput();
      });

      this.socket.on('update prefix', prefix => {
        this.setState({ prefix });
      });

      this.socket.on('linejump', this.addLineJump);

      this.socket.on('end', () => {
        this.setState({ terminput: { prefix: '', type: '' } });
        this.showInput();
        this.scrollDown();
      });
    } catch (e) {

    }
  }

  /**
   * @param {string | string[]} content
   */
  addRow = content => {
    if (!content) return;

    if (Array.isArray(content)) {
      this.pushRowJSX(
        <div>
          {
            content.map((part, i) => (
              <span key={i}>{part} </span>
            ))
          }
        </div>
      );
    } else {
      const newRows = String(content).split('\n');

      newRows.forEach((row, i) => {
        row = row.trim();

        if (!row && i < newRows.length) {
          this.pushRowJSX(<br />);
        } else {
          this.pushRowJSX(<div>{row}</div>);
        }
      });
    }

    this.scrollDown();
  }

  addLineJump = () => {
    this.pushRowJSX(<br />)

    this.scrollDown();
  }

  /**
   * @param {JSX.Element} row
   */
  pushRowJSX = row => {
    const rows = this.state.rows;

    const key = rows.length;
    rows.push(React.cloneElement(row, { key }));

    this.setState({ rows });
  }

  scrollDown = () => {
    window.scrollTo(0, document.body.scrollHeight);
  }

  hideInput = () => this.setState({ hideInput: true });
  showInput = () => this.setState({ hideInput: false });

  pushInputLine = command => {
    const stateClass = this.state.terminput.prefix ? " color-inherit" : "";

    if (this.state.terminput.type === 'password' || !command) {
      this.pushRowJSX(
        <div>
          <span className={"terminal-prefix" + stateClass}>{this.state.terminput.prefix || this.state.prefix} </span>
        </div>
      );
    } else {
      this.pushRowJSX(
        <div>
          <span className={"terminal-prefix" + stateClass}>{this.state.terminput.prefix || this.state.prefix} </span>
          <span>{command}</span>
        </div>
      );
    }
  }

  sendCommand = (command = '') => {
    this.hideInput();

    this.pushInputLine(command);

    this.socket.emit('command', command);
  }

  sendControl = (key, command) => {
    this.pushInputLine(command);

    this.socket.emit('control', key);
  }

  render() {
    return (
      <div className="app">
        <Terminal
          prefix={this.state.terminput.prefix || this.state.prefix}
          prefixNoColor={String(this.state.terminput.prefix).length > 0}
          inputType={this.state.terminput.type}
          sendCommand={this.sendCommand}
          onControl={this.sendControl}
          hideInput={this.state.hideInput}
        >
          {this.state.rows.length <= 0 ? <div>Fetching data...</div> : null}
          {
            this.state.rows.map(row => row)
          }
        </Terminal>
      </div>
    )
  }
}