import * as React from 'react';
import {Container} from './Container';

export class Popup extends React.Component<{container: Container}, {transform:string}> {

    password:string;

    constructor(props: {container: Container}) {
        super(props);
        this.password = "";
        this.state = {
            transform: 'translate(-50%, -50%) scale(0.5)',
        }
    }

    handleDivClick(e: React.MouseEvent) {
        this.props.container.updatePassword(this.password);
        this.props.container.closePopup();
    }

    handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.password = e.target.value;
    }

    componentDidMount() {
        setInterval(() => this.popup(), 1);
    }

    popup() {
        this.setState({
            transform:'translate(-50%, -50%)'
        });
    }

    render() {
        return (
            <div style={{
                position: 'absolute', 
                top:'50%', 
                left:'50%', 
                transform: this.state.transform,
                textAlign: 'center', 
                padding:'16px',
                paddingRight:'20px', 
                boxShadow: '10px 10px 5px #888888',
                width:'230px',
                backgroundColor:'lightblue',
                transition:'all 0.1s linear',
            }}>
                <div 
                    style={{
                    }}
                >
                    <label 
                        style={{
                            height:'19px',
                            fontSize:'16px',
                            fontFamily:'ubuntu',
                            display:'block'
                        }}
                    >IN PUT YOUR PASSWORD</label>
                </div>
                <div>
                    <input 
                        type="password" 
                        style={{
                            width:"100%", 
                            height:'19px',
                            outline:"none", 
                            padding:"1px", 
                            border:"1px", 
                            borderStyle:"solid", 
                            borderColor:"darkgray",
                            marginTop: '8px',
                            marginBottom: '8px'
                        }} 
                        onChange={(e) => this.handleChange(e)}
                    />
                </div>
                <div>
                    <input 
                        type="submit" 
                        value='OK' 
                        onClick={(e) => this.handleDivClick(e)} 
                        style={{
                            height:'19px',
                            border: '1px',
                            background: 'center',
                            borderStyle: 'solid',
                            borderColor: 'darkgray'
                        }}
                    />
                </div>
            </div>
        ) ;
    }
}