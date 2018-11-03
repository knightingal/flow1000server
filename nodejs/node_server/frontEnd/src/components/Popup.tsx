import * as React from 'react';
import {Container} from './Container';

export class Popup extends React.Component<{container: Container}, {}> {

    constructor(props: {container: Container}) {
        super(props);
    }

    handleDivClick(e: React.MouseEvent) {
        this.props.container.closePopup();
    }

    render() {
        return <div >
            <label >IN PUT YOUR PASSWORD</label>
            <input type="password" />
            <input type="submit" value='OK' onClick={(e) => this.handleDivClick(e)}/>
        </div>;
    }
}