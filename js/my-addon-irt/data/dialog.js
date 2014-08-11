document.getElementById("btn_ok").onclick = function() {
    console.log("btn ok clicked");
    self.port.emit("dialog_resp", true);
};

document.getElementById("btn_cancle").onclick = function() {
    console.log("btn cancle clicked");
    self.port.emit("dialog_resp", false);
};
