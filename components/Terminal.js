import { Component } from 'react';
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

    handleInputKey = e => {
        const input = this.state.input;

        if (e.key === 'ArrowUp') {
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

    sendCommand = e => {
        e.preventDefault();

        if (this.props.sendCommand) {
            this.props.sendCommand(this.state.input.value);
        }

        const input = this.state.input;
        input.value = '';

        this.setState({
            input
        });
    }

    render() {
        const { children, prefix = '', hideInput = false, ...others } = this.props;

        return (
            <form onSubmit={this.sendCommand} className="terminal" onClick={this.focusInput}>
                <div>
                    {children}
                </div>
                <div className={hideInput ? 'invisible' : ''}><span>{prefix}></span> <TerminalContent selectionStart={this.state.input.selectionStart} content={this.state.input.value} /></div>
                <input
                    ref={input => this.state.input = input}
                    className={hideInput ? 'invisible' : ''}
                    type="text" className="input-hidden"
                    value={this.state.input.value}
                    onChange={this.updateInput}
                    onKeyDown={this.handleInputKey}
                    onKeyUp={this.handleInputKey}
                    autoComplete="off"
                    autoFocus={true}
                />
                <button className="hidden" type="submit"></button>
            </form>
        )
    }
}