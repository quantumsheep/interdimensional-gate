import React, { Component } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

import Terminal from './Terminal';

export default class App extends Component {
    state = {
        prefix: '',
        terminput: {
            prefix: '',
            type: '',
        },
        hideInput: true,
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

    addRow = content => {
        if (!content) return;

        const rows = this.state.rows;

        if (Array.isArray(content)) {
            const key = rows.length;

            rows.push(
                <div key={key}>{content.map((part, i) => <span key={i}>{part}</span>)}</div>
            );

            this.setState({ rows });
        } else {
            const newRows = String(content).split('\n');

            newRows.forEach((row, i) => {
                const key = rows.length;

                row = row.trim();

                if (!row && i < newRows.length) {
                    rows.push(
                        <br key={key} />
                    );
                } else {
                    rows.push(
                        <div key={key}>{row}</div>
                    );
                }

                this.setState({ rows });
            });
        }

        this.scrollDown();
    }

    addLineJump = () => {
        const rows = this.state.rows;
        const key = rows.length;

        rows.push(<br key={key} />);
        this.setState({ rows });

        this.scrollDown();
    }

    scrollDown = () => {
        window.scrollTo(0, document.body.scrollHeight);
    }

    hideInput = () => this.setState({ hideInput: true });
    showInput = () => this.setState({ hideInput: false });

    sendCommand = command => {
        this.hideInput();

        if (this.state.terminput.prefix) {
            this.addRow(`${this.state.terminput.prefix} ${this.state.terminput.type !== 'password' ? command : ''}`);
        } else {
            this.addRow(`${this.state.prefix} ${command}`);
        }

        this.socket.emit('command', command);
    }

    render() {
        return (
            <div className="app">
                <Terminal
                    prefix={this.state.terminput.prefix || this.state.prefix}
                    inputType={this.state.terminput.type}
                    sendCommand={this.sendCommand}
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