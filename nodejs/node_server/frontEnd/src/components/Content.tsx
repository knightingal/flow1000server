import * as React from 'react';
import {Container} from './Container';
class SectionDetail {
    dirName:string;
    picPage:string;
    pics:Array<string>;

    constructor() {
        this.dirName = "";
        this.picPage = "";
        this.pics = [];
    }
}

export class Content extends React.Component<{container: Container}, {sectionDetail:SectionDetail}> {
    constructor(props:{container: Container}) {
        super(props);
        props.container.content = this;
        this.state = {sectionDetail: new SectionDetail()};
    }

    fecthSectionList(index: string) {
        fetch(`/local1000/picContentAjax?id=${index}`)
        .then((resp: Response) => {
            return resp.json();
        })
        .then((json: any) => {
            const sectionDetail:SectionDetail = json;
            this.setState({
                sectionDetail:sectionDetail
            });
        });
    }

    componentDidMount() {
        this.fecthSectionList(this.props.container.state.index);        
    }

    render() {
        return <div className="Content">
            {this.state.sectionDetail.pics.map((pic: string, index: number) => {
                return <p key={index}>{pic}</p>;
            })}
        </div>
    }
}