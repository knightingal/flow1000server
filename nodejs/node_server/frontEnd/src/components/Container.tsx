import * as React from 'react';

import {SectionList} from './SectionList';
import {Content} from './Content';

export class Container extends React.Component<{}, {index: string}> {
    notifySectionClick(index: string) {
        this.setState({
            index: index
        });

        this.content.fecthSectionList(index);
    }

    content:Content = null;

    constructor(props: {}) {
        super(props);
        this.state = {index: "1"};
    }

    render() {
        return <div className="Container">
            <Content container={this}/>
            <SectionList container={this}/>
        </div>
    }
}