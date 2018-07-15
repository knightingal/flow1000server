import * as React from 'react';
import {Container} from './Container';
class SectionBean {
    index:string;
    name:string;
    mtime:string;
}

export class SectionList extends React.Component<{container: Container}, {sectionList:Array<SectionBean>}> {
    constructor(props:{container: Container}) {
        super(props);
        this.state = {sectionList:[]};
    }

    fecthSectionList() {
        fetch("/local1000/picIndexAjax")
        .then((resp: Response) => {
            return resp.json();
        })
        .then((json: any) => {
            const sectionList:Array<SectionBean> = json;
            this.setState({
                sectionList: sectionList
            });
        });
    }

    handleSectionClick(e: React.MouseEvent, index: string) {
        this.props.container.notifySectionClick(index);
    }

    componentDidMount() {
        this.fecthSectionList();        
    }

    render() {
        return <div className="SectionList">
            {this.state.sectionList.map((sectionBean: SectionBean, index: number) => {
                return <p key={index} onClick={(e) => this.handleSectionClick(e, sectionBean.index)}>{sectionBean.name}</p>;
            })}
        </div>
    }
}