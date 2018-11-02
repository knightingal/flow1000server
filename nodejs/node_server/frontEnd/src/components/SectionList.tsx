import * as React from 'react';
import {Container} from './Container';
class SectionBean {
    index:string;
    name:string;
    mtime:string;
}

export class SectionList extends React.Component<{container: Container}, {sectionList:Array<SectionBean>}> {
    url:URL;
    constructor(props:{container: Container}) {
        super(props);
        this.state = {sectionList:[]};
        this.url = new URL(document.URL);
    }

    fecthSectionList() {
        let fetchUrl:string;
        if (this.url.pathname.indexOf("battleships.html") >= 0) {
            fetchUrl = "/local1000/picIndexAjax?album=BattleShips";
        } else {
            fetchUrl = "/local1000/picIndexAjax";
        }
        console.log("fetchUrl is " + fetchUrl);
        fetch(fetchUrl)
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
                return (<div key={index} onClick={(e) => this.handleSectionClick(e, sectionBean.index)}>
                    <a className="SectionListItem">{sectionBean.name}</a>
                </div>);
            })}
        </div>
    }
}