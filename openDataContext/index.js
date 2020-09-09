var selfOpenId;
var friendDatas;
var currChapterIndex;
var currPs;
var uiImg;
var uiSprites;
var ctx = sharedCanvas.getContext("2d");
ctx.globalCompositeOperation = "source-over";
wx.onMessage(function (data) {
    switch (data.action) {
        case "init":
            ctx.clearRect(0, 0, sharedCanvas.width, sharedCanvas.height);
            selfOpenId = data.selfOpenId;
            uiImg = wx.createImage();
            uiImg.src = data.uiSheetPath;
            uiSprites = data.uiSprites;
            break;
        case "getFriendDatas":
            friendDatas = null;
            wx.getFriendCloudStorage({
                keyList: ["data"],
                success: function (res) {
                    friendDatas = res.data;
                    for (var _i = 0, friendDatas_2 = friendDatas; _i < friendDatas_2.length; _i++) {
                        var friendData = friendDatas_2[_i];
                        friendData.storeData = JSON.parse(friendData.KVDataList[0].value);
                        friendData.headImgIsLoaded = false;
                        if (friendData.openid == selfOpenId) {
                        }
                        else {
                            if (friendData.avatarUrl) {
                                friendData.headImg = wx.createImage();
                                friendData.headImg["owner"] = friendData;
                                friendData.headImg.onload = function (event) {
                                    var friendData = event.target["owner"];
                                    friendData.headImgIsLoaded = true;
                                    if ("drawHeadX" in friendData) {
                                        drawHead(friendData, friendData.drawHeadX, friendData.drawHeadY, friendData.drawHeadD);
                                    }
                                };
                                friendData.headImg.src = friendData.avatarUrl;
                            }
                        }
                    }
                }, fail: function () {
                    console.error("getFriendCloudStorage 失败");
                }
            });
            break;
        case "击杀榜":
            if (friendDatas) {
                ctx.clearRect(0, 0, sharedCanvas.width, sharedCanvas.height);
                var friendDataSortByKillNum = friendDatas.slice();
                var i = friendDataSortByKillNum.length;
                while (i--) {
                    if (friendDataSortByKillNum[i].storeData.maxKillNum > 0) { }
                    else {
                        friendDataSortByKillNum.splice(i, 1);
                    }
                }
                friendDataSortByKillNum.sort(function (friendData1, friendData2) {
                    return friendData2.storeData.maxKillNum - friendData1.storeData.maxKillNum;
                });
                if (friendDataSortByKillNum.length > 20) {
                    friendDataSortByKillNum.length = 20;
                }
                for (var i_1 = 0; i_1 < 20; i_1++) {
                    var friendData = friendDataSortByKillNum[i_1];
                    var y = i_1 * 84;
                    if (friendData) {
                        drawHead(friendData, 88, y + 2, 74);
                        ctx.font = "20px 微软雅黑";
                        ctx.fillStyle = "#ffffff";
                        ctx.fillText(friendData.nickname, 194, y + 50);
                        ctx.fillStyle = "#547D26";
                        ctx.fillText("击杀：", 350, y + 50);
                        ctx.font = "36px 微软雅黑";
                        ctx.fillText(friendData.storeData.maxKillNum.toString(), 410, y + 55);
                    }
                    else {
                        ctx.font = "28px 微软雅黑";
                        ctx.fillStyle = "#FEF6D8";
                        ctx.fillText("虚位以待", 194, y + 50);
                    }
                }
            }
            break;
        case "关卡进度":
            currChapterIndex = data.chapterIndex;
            currPs = data.ps;
            if (friendDatas) {
                ctx.clearRect(0, 0, sharedCanvas.width, sharedCanvas.height);
                for (var _i = 0, friendDatas_1 = friendDatas; _i < friendDatas_1.length; _i++) {
                    var friendData = friendDatas_1[_i];
                    if (friendData.storeData.chapterIndex == currChapterIndex) {
                        var p = currPs[friendData.storeData.fubenIndex];
                        if (p) {
                            var point = uiSprites["point"];
                            ctx.drawImage(uiImg, point.x, point.y, point.w, point.h, p[0] - point.w / 2, p[1] - point.h, point.w, point.h);
                            drawHead(friendData, p[0] - point.w / 2 + 34, p[1] - point.h + 28, 56);
                        }
                    }
                }
            }
            break;
        default:
            console.error("未知 action：" + data.action);
            break;
    }
});
function drawHead(friendData, x, y, d) {
    if (friendData.headImgIsLoaded) {
        ctx.drawImage(friendData.headImg, 0, 0, friendData.headImg.width, friendData.headImg.height, x, y, d, d);
    }
    else {
        friendData.drawHeadX = x;
        friendData.drawHeadY = y;
        friendData.drawHeadD = d;
    }
}
