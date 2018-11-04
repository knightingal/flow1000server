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
        return (
            <div style={{width:"100%", textAlign:"center"}}>
                <div>
                    <label >IN PUT YOUR PASSWORD</label>
                </div>
                <div>
                    <input type="password" />
                </div>
                <div>
                    <input type="submit" value='OK' onClick={(e) => this.handleDivClick(e)}/>
                </div>
            </div>
        ) ;
    }
}