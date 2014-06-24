var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");
var Request = require("sdk/request").Request;

// Create a button
require("sdk/ui/button/action").ActionButton({
  id: "show-panel",
  label: "Show Panel",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: handleClick
});

var pageInfos = [];
// Show the panel when the user clicks the button.
function handleClick(state) {
  //text_entry.show();
    var tab = require("sdk/tabs").activeTab;  
    var worker = tab.attach({
        contentScriptFile: data.url("content_script.js")

    });

    var PageMod = pageMod.PageMod({
        include: "*",
        contentScriptFile: data.url("content_script.js"),
        onAttach: function(worker) {

            worker.port.on("sendPageInfo", function(pageInfo) {
                console.log(pageInfo);
                pageInfo.href = tab.url;
                pageInfos[pageInfos.length] = pageInfo;
            });

            worker.port.on("goToNextPage", function(nextUrl) {
                tab.url = nextUrl;
            });

            worker.port.on("stopAndSendPageInfosToServer", 
                function() {
                    console.log(pageInfos);
                    Request({
                        url: "http://127.0.0.1:8081/",
                        content: JSON.stringify(pageInfos),
                        contentType : "json",
                        onComplete: function(response) {
                            console.log("req return " + response);
                        }
                    }).post();
                    pageInfos = [];
                    PageMod.destroy();
                }
            );

            worker.port.emit("start");
        }
    });

    worker.port.on("sendPageInfo", function(pageInfo) {
        console.log(pageInfo);
        pageInfo.href = tab.url;
        pageInfos[pageInfos.length] = pageInfo;
    });

    worker.port.on("goToNextPage", function(nextUrl) {
        tab.url = nextUrl;
    });

    worker.port.on("stopAndSendPageInfosToServer", 
        function() {
            console.log(pageInfos);
            Request({
                url: "http://127.0.0.1:8081/",
                content: JSON.stringify(pageInfos),
                contentType : "json",
                onComplete: function(response) {
                    console.log("req return " + response);
                }
            }).post();
            pageInfos = [];
            PageMod.destroy();
        }
    );

    worker.port.emit("start");

}


