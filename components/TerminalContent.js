import { Component } from 'react';
import PropTypes from 'prop-types';

export default class TerminalContent extends Component {
    static defaultProps = {
        content: '',
        selectionStart: 0,
    }

    render() {
        const { content, selectionStart, ...others } = this.props;

        const color = content[selectionStart] ? '#000000' : '#ffffff';

        return (
            <span className="terminal-input-content">
                <span>{content.slice(0, selectionStart)}</span>
                <span className="terminal-selector" style={{ color }}>{content[selectionStart] || 'x'}</span>
                <span>{content.slice(selectionStart + 1, content.length)}</span>
            </span>
        )
    }
}