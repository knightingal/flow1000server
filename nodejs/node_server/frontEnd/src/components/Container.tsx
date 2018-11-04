import * as React from 'react';

import {SectionList} from './SectionList';
import {Content} from './Content';
import {Popup} from './Popup';

export class Container extends React.Component<{}, {popup: boolean ,index: string}> {
    notifySectionClick(index: string) {
        this.setState({
            index: index
        });
    }

    constructor(props: {}) {
        super(props);
        this.state = {index: "0", popup: true};
    }

    closePopup() {
        this.setState({
            popup: false
        });
    }

    updatePassword(password: string) {
        // TODO: notify password to decrypto function
    }

    render() {
        if (this.state.popup == true) {
            return <Popup container={this}/>
        } else {
            return <div className="Container">
                <Content index={this.state.index}/>
                <SectionList container={this}/>
            </div>
        }
   }
}