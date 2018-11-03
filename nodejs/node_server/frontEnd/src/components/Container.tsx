import * as React from 'react';

import {SectionList} from './SectionList';
import {Content} from './Content';

export class Container extends React.Component<{}, {index: string}> {
    notifySectionClick(index: string) {
        this.setState({
            index: index
        });
    }

    constructor(props: {}) {
        super(props);
        this.state = {index: "0"};
    }

    render() {
        return <div className="Container">
            <Content index={this.state.index}/>
            <SectionList container={this}/>
        </div>
    }
}