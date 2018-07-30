import * as React from 'react';
import {decryptArray} from '../lib/decryptoArray';


export class ImgComponent extends React.Component<{src: string}, {url: string}> {
    constructor(props:{src: string}) {
        super(props);
        this.state = {
            url:null
        }
    }

    fetchImgByUrl(url: string) {
        fetch(url).then(response => {
            return response.arrayBuffer();
        }).then(arrayBuffer => {
            const decrypted = decryptArray(arrayBuffer);
            const objectURL = URL.createObjectURL(new Blob([decrypted]));
            this.setState({
                url: objectURL,
            });
        });
    }

    componentDidMount() {
        this.fetchImgByUrl(this.props.src);
    }

    componentDidUpdate(prevProps: {src: string}) {
        if (this.props.src !== prevProps.src) {
            this.fetchImgByUrl(this.props.src);
        }

    }

    render() {
        return <img src={this.state.url}/>
    }
}