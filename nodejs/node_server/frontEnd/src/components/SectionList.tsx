import * as React from 'react';
import {Container} from './Container';
class SectionBean {
    index:string;
    name:string;
    mtime:string;
}

export class SectionList extends React.Component<{container: Container}, {sectionList:Array<SectionBean>, selectedIndex: string}> {
    url:URL;
    constructor(props:{container: Container}) {
        super(props);
        this.state = {sectionList:[], selectedIndex: null};
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
        this.setState({
            selectedIndex: index
        });
    }

    componentDidMount() {
        this.fecthSectionList();        
        const ws = new WebSocket("ws://127.0.0.1:8000/updateListenerWs");

        ws.onmessage = (event: MessageEvent) => {
            const data = event.data;
            const section: SectionBean = JSON.parse(data);
            this.setState({
                sectionList: this.state.sectionList.concat(section)
            });
        }
    }

    render() {
        return <div className="SectionList">
            {this.state.sectionList.map((sectionBean: SectionBean, index: number) => {
                return (<div key={index} onClick={(e) => this.handleSectionClick(e, sectionBean.index)} style={{backgroundColor: (sectionBean.index === this.state.selectedIndex ? 'yellow' : 'white')}}>
                    <a className="SectionListItem">{sectionBean.name}</a>
                </div>);
            })}
        </div>
    }
}