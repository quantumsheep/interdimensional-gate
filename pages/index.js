import { Component } from 'react';
import io from 'socket.io-client';
import Head from 'next/head';
import Terminal from '../components/Terminal';

export default class extends Component {
    componentDidMount() {
        this.socket = io();
        this.socket.on('test', ({ message, action }) => {
            console.log(message);
        });
    }

    sendCommand = command => {
        console.log(command);
    }

    render() {
        return (
            <div>
                <Head>
                    <title>Interdimensional Gate</title>
                    <link href="/static/css/normalize/normalize.min.css" rel="stylesheet" />
                    <link href="/static/css/gate.css" rel="stylesheet" />
                </Head>
                <Terminal sendCommand={this.sendCommand}>
                    <div>Linux gate 4.9.0-7-amd64 #1 SMP Gate 4.9.110-3+deb9u2 (2018-08-13) x86_64</div>
                    <br />
                    <div>The programs included with the Interdimensional Gate system are free software;</div>
                    <div>the exact distribution terms for each program are described in the</div>
                    <div>individual files in /usr/share/doc/*/copyright.</div>
                    <br />
                    <div>Interdimensional Gate comes with ABSOLUTELY NO WARRANTY, to the extent</div>
                    <div>permitted by applicable law.</div>
                    <div>Last login: Fri Sep 14 14:13:12 2018 from 1.2.3.4</div>
                </Terminal>
            </div>
        )
    }
}