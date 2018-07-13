import * as React from 'react';
class SectionBean {
    index:string;
    name:string;
    mtime:string;
}

export class Content extends React.Component<{}, {sectionList:Array<SectionBean>}> {
    constructor(props:{}) {
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

    componentDidMount() {
        this.fecthSectionList();        
    }

    render() {
        return <div className="Content">
            {this.state.sectionList.map((sectionBean: SectionBean, index: number) => {
                return <p key={index}>{sectionBean.name}</p>;
            })}
        </div>
    }
}