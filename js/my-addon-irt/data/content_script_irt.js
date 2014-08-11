
var Task = {

    "imgSrcArray": [],
    "title": "",

    "nexturl": "",
    "isLastPage": false,
    "init": function() {
        //find imgSrcArray
        var imgNodeArray = document.getElementsByClassName("photo")[0].children;
        //console.log(imgNodeArray);

        for(i =0; i < imgNodeArray.length; i++)
        {
              this.imgSrcArray[i] = imgNodeArray[i].src
        }
        //console.log(this.imgSrcArray);

        //find title
        this.title = imgNodeArray[0].alt;
        //console.log(this.title);

        //find nextpage
        var pageno = document.getElementsByClassName("pageno")[0];
        //console.log(pageno);
        //var nexturl = pageno.children[pageno.children.length - 12];
        for (i = 0; i < pageno.children.length; i++)
        {
            if (pageno.children[i].innerHTML === "下一页")
            {
                this.nexturl = pageno.children[i].href;
                break;
            }
        }
        //console.log(this.nexturl);

        //islastpage
        this.isLastPage = (this.nexturl === document.location.href);
        //console.log(this.isLastPage);
    },

    "doTask": function() {
        var pageInfo = this.getPageInfo();
        console.log(pageInfo);
        self.port.emit("sendPageInfo", pageInfo);
        if (this.isLastPage === false) {
            self.port.emit("goToNextPage", this.getNextUrl());
        }
        else {
            self.port.emit("stopAndSendPageInfosToServer");
        }
    },
    "getNextUrl": function() {
        return this.nexturl;
    },
    "getPageInfo": function() {
        var pageInfoObj = {};
        pageInfoObj.imgSrcArray = this.imgSrcArray;
        pageInfoObj.title = this.title;
        return pageInfoObj;

    },
    "getCurrentTitle": function() {
        return this.title;
    }
};


Task.init();
self.port.on("start", function() {
    Task.doTask();
});

self.port.on("getTitleReq", function() {
    self.port.emit("getTitleResp", Task.getCurrentTitle());
});
