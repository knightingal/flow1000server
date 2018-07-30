import * as React from 'react';
import {ImgComponent} from './ImgComponent';
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

export class Content extends React.Component<{index:string}, {sectionDetail:SectionDetail}> {
    constructor(props:{index: string}) {
        super(props);
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
        this.fecthSectionList(this.props.index);        
    }

    componentDidUpdate(prevProps: {index:string}) {
        if (this.props.index !== prevProps.index) {
            this.fecthSectionList(this.props.index);        
        }

    }

    render() {
        return <div className="Content">
            {this.state.sectionDetail.pics.map((pic: string, index: number) => {
                return <ImgComponent  key={index} src={`/static/encrypted/${this.state.sectionDetail.dirName}/${pic}.bin`} />
            })}
        </div>
    }
}