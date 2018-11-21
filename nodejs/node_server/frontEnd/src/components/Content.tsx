import * as React from 'react';
import {ImgComponent} from './ImgComponent';
class SectionDetail {
    dirName:string;
    picPage:string;
    pics:Array<ImgDetail>;

    constructor() {
        this.dirName = "";
        this.picPage = "";
        this.pics = [];
    }
}

class ImgDetail {
    name:string;
    width:number;
    height:number;

    constructor(name:string, width:number, height:number) {
        this.name = name;
        this.width = width;
        this.height = height;
    }
}

export class Content extends React.Component<{index:string, password:string}, {sectionDetail:SectionDetail}> {

    heightStep: Array<number> = [];

    currentTopPicIndex: number = null;
    currentButtonPicIndex: number = null;

    divRefs:React.RefObject<HTMLDivElement>;

    constructor(props:{index: string, password:string}) {
        super(props);
        this.state = {sectionDetail: new SectionDetail()};
        this.divRefs = React.createRef();
    }

    fecthSectionList(index: string) {
        if (index === "0") {
            return;
        }
        fetch(`/local1000/picDetailAjax?id=${index}`)
        .then((resp: Response) => {
            return resp.json();
        })
        .then((json: any) => {
            const sectionDetail:SectionDetail = json;
            const heights: Array<number> = sectionDetail.pics.map((pic) => {return pic.height});
            this.heightStep = heights.map((height, index, heights) => {
                if (index === 0) {
                    return 0;
                }
                return heights.slice(0, index).reduce((height, current) => height + current);
            });
            this.divRefs.current.scrollTo(0, 0);
            this.currentTopPicIndex = 0;
            this.currentButtonPicIndex = this.checkPostionInPic(this.divRefs.current.clientHeight);
            this.setState({
                sectionDetail:sectionDetail
            });
        });
    }

    componentDidMount() {
        this.fecthSectionList(this.props.index);        
    }

    checkPostionInPic(postion: number): number {
        return this.heightStep.filter((height) => {
            return height < postion;
        }).length - 1;
    }

    componentDidUpdate(prevProps: {index:string}) {
        if (this.props.index !== prevProps.index) {
            this.fecthSectionList(this.props.index);        
        }

    }

    scrollHandler(e : React.UIEvent) {
        const scrollTop: number = (e.target as HTMLDivElement).scrollTop;
        const scrollHeight: number = (e.target as HTMLDivElement).scrollHeight;
        const clientHeight: number = (e.target as HTMLDivElement).clientHeight;
        // console.log(`${scrollTop} / ${scrollHeight}: ${clientHeight}: ${scrollTop * 100 / (scrollHeight - clientHeight)}%`);
        let update = false;
        if (this.checkPostionInPic(scrollTop) !== this.currentTopPicIndex) {
            this.currentTopPicIndex = this.checkPostionInPic(scrollTop);
            console.log(`change top to pic index: ${this.currentTopPicIndex}`);
            update = true;
        }
        if (this.checkPostionInPic(scrollTop + clientHeight) !== this.currentButtonPicIndex) {
            this.currentButtonPicIndex = this.checkPostionInPic(scrollTop + clientHeight);
            console.log(`change button to pic index: ${this.currentButtonPicIndex}`);
            update = true;
        }
        if (update) {
            this.setState(this.state);
        }

    }

    render() {
        return <div className="Content" onScroll={(e) => this.scrollHandler(e)}  ref={this.divRefs}>
            {this.state.sectionDetail.pics.map((pic: ImgDetail, index: number) => {
                const displayImg = index >= this.currentTopPicIndex - 1 && index <= this.currentButtonPicIndex + 1; 
                return displayImg ? 
                    <ImgComponent 
                        width={pic.width} 
                        height={pic.height} 
                        key={index} 
                        src={`/static/encrypted/${this.state.sectionDetail.dirName}/${pic.name}.bin`} 
                        password={this.props.password} 
                    /> :
                    <div key={index} style={{width:`${pic.width}px`, height:`${pic.height}px`}} />
            })}
        </div>
    }
}