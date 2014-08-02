var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");
var Request = require("sdk/request").Request;

var dialog_page = require("sdk/panel").Panel({
    contentURL: data.url("dialog.html"),
    contentScriptFile: data.url("dialog.js")
});

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
                        url: "http://127.0.0.1:8081/startDownload/",
                        content: JSON.stringify(pageInfos),
                        contentType : "json",
                        onComplete: function(response) {
                            console.log(response);
                        }
                    }).post();
                    pageInfos = [];
                    PageMod.destroy();
                }
            );

            worker.port.emit("start");
        }
    });

    worker.port.on("getTitleResp", function(resp) {
        console.log("getTitleResp" + resp);
        Request({
            url: "http://127.0.0.1:8081/testExist/",
            content: resp,
            contentType: "text",
            onComplete: function(response) {
                console.log("testExist return");
                console.log(response);
                if (response.text === "False") {
                    dialog_page.show();
                } else {
                    worker.port.emit("start");
                }
                
            }
        }).post();
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
                    console.log(response);
                }
            }).post();
            pageInfos = [];
            PageMod.destroy();
        }
    );
    dialog_page.port.on("dialog_resp", function(dialog_resp) {
        if (dialog_resp === true) {
            worker.port.emit("start");
        }
        else {
            PageMod.destroy();
        }
        dialog_page.hide();
    });
    worker.port.emit("getTitleReq");

}


