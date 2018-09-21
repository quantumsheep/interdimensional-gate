import { Component } from 'react';
import io from 'socket.io-client';
import Head from 'next/head';
import Terminal from '../components/Terminal';

export default class extends Component {
    state = {
        prefix: 'guess@gate',
        hideInput: true,
        /**
         * @type {JSX.Element[]}
         */
        rows: [],
    }

    componentDidMount() {
        this.socket = io();

        this.socket.on('connect', () => {
            this.socket.emit('start', this.state.rows.length > 0);
        });

        this.socket.on('ready', () => {
            this.showInput();
        });

        this.socket.on('row', content => {
            this.addRow(content);
        });

        this.socket.on('linejump', this.addLineJump);

        this.socket.on('end', () => {
            this.showInput();
        });
    }

    addRow = content => {
        if (!content) return;

        const rows = this.state.rows;
        const key = rows.length;

        if (Array.isArray(content)) {
            rows.push(
                <div key={key}>{content.map((part, i) => <span key={i}>{part}</span>)}</div>
            );
        } else {
            rows.push(<div key={key}>{content}</div>);
        }

        this.setState({ rows });
    }

    addLineJump = () => {
        const rows = this.state.rows;
        const key = rows.length;

        rows.push(<br key={key} />);
        this.setState({ rows });
    }

    hideInput = () => this.setState({ hideInput: true });
    showInput = () => this.setState({ hideInput: false });

    sendCommand = command => {
        this.hideInput();

        this.addRow(`${this.state.prefix}> ${command}`);

        this.socket.emit('command', command);
    }

    render() {
        return (
            <div>
                <Head>
                    <title>Interdimensional Gate</title>
                    <link href="/static/css/normalize/normalize.min.css" rel="stylesheet" />
                    <link href="/static/css/gate.css" rel="stylesheet" />
                </Head>
                <Terminal prefix={this.state.prefix} sendCommand={this.sendCommand} hideInput={this.state.hideInput}>
                    {this.state.rows.length <= 0 ? <div>Fetching data...</div> : null}
                    {
                        this.state.rows.map(row => row)
                    }
                </Terminal>
            </div>
        )
    }
}