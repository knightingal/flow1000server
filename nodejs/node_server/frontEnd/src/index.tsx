import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {SectionList} from './components/SectionList';
import {Content} from './components/Content';

ReactDOM.render(
    <div className="Container">
    <Content />
    <SectionList />
    </div>,
    document.getElementById('root')
)