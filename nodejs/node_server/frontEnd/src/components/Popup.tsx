import * as React from 'react';
import {Container} from './Container';

export class Popup extends React.Component<{container: Container}, {}> {

    password:string;

    constructor(props: {container: Container}) {
        super(props);
        this.password = "";
    }

    handleDivClick(e: React.MouseEvent) {
        this.props.container.updatePassword(this.password);
        this.props.container.closePopup();
    }

    handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.password = e.target.value;
    }

    render() {
        return (
            <div style={{
                position: 'absolute', 
                top:'50%', 
                left:'50%', 
                transform: 'translate(-50%, -50%)', 
                textAlign: 'center', 
                padding:'16px',
                paddingRight:'20px', 
                boxShadow: '10px 10px 5px #888888',
                backgroundColor:'lightblue'
            }}>
                <div>
                    <label >IN PUT YOUR PASSWORD</label>
                </div>
                <div>
                    <input 
                        type="password" 
                        style={{
                            width:"100%", 
                            outline:"none", 
                            padding:"1px", 
                            border:"1px", 
                            borderStyle:"solid", 
                            borderColor:"darkgray"
                        }} 
                        onChange={(e) => this.handleChange(e)}
                    />
                </div>
                <div>
                    <input type="submit" value='OK' onClick={(e) => this.handleDivClick(e)}/>
                </div>
            </div>
        ) ;
    }
}