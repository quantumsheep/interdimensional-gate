import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import './gate.css';

import App from './components/App';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
