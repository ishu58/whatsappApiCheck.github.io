//session

function smartTALKActiveSession(data, status) {
    $scope.currentInteractionDetails = {};
    try {
        $scope.startAnimationAgent();
        if ($scope.smartTALKActiveSessionList.length == 0) {
            if (data != null) {
                if (data.length > 0) {
                    if ($scope.$$phase) { // most of the time it is "$digest"
                        $scope.smartTALKActiveSessionList = data;
                    } else {
                        $scope.$apply($scope.smartTALKActiveSessionList = data);
                    }
                    smartTALKClickActiveSession(data[0], 0)
                }
            }
        } else {
            if (status) {
                data.forEach(function (r, j) {
                    $scope.smartTALKActiveSessionList.forEach(function (v, i) {
                        if (v.SESSIONID == r.SESSIONID) {
                            $scope.smartTALKActiveSessionList.splice(i, 1);
                            $scope.currentInteractionDetails = r;
                            //console.log('$scope.currentInteractionDetails', $scope.currentInteractionDetails);
                            if (r.INTERACTIONTYPE == 'IM') {
                                smartTALKNotificationError("IM Closed");
                            } else {
                                smartTALKNotificationError("Submitted Successfully !");
                            }
                            if ($scope.smartTALKActiveSessionList.length == 0) {
                                if ($scope.WRAPEFROM == true) {
                                    $scope.smartTALKWRAPEFROMURL($scope.WRAPEFROMURL);
                                    console.log('$scope.smartTALKWRAPEFROMURL() called', $scope.WRAPEFROMURL);
                                }
                            }
                            clearInterval(CustomerTime);
                            if ($scope.hdsessionId == r.SESSIONID) {
                                $scope.ActiveStatus = "";
                                $scope.ActiveChannel = "";
                                $scope.ActiveCustName = "";
                                //  $scope.hdsessionId = "";
                                $scope.hdPhoneNo = "";
                                $scope.hdCHANNELID = "";
                                $scope.ActivecustomerPIC = "";
                                $scope.smartTALKChatList = [];
                                $scope.smartTALKCustomerDetailsList = [];
                                $scope.smartTALKCustomerHistoryList = [];
                                $scope.smartTALKCustomerHistorydetailsList = [];
                                $scope.WebchartHeadInfoList = [];
                                $scope.WebchartCrolingList = [];
                                $scope.Disposition = "";
                                $scope.SubDisposition = "";
                                $scope.Remarks = "";
                                $scope.TextboxSendMessageEnabled = "0";
                                if ($scope.TextboxSendMessageEnabled == "1") {
                                    $("#txtmessage, #txtmessageExpand").attr("disabled", "disabled");
                                } else {
                                    $("#txtmessage, #txtmessageExpand").removeAttr("disabled");
                                }
                                if ($scope.smartTALKActiveSessionList.length > 0) {
                                    smartTALKClickActiveSession($scope.smartTALKActiveSessionList[0], 0)
                                }
                                if ($scope.smartTALKActiveSessionList.length == 0) {
                                    $scope.InteractionTime = "00:00:00";
                                    $scope.ActiveHandleTime = "00:00:00";
                                }
                            }
                        }
                    });
                });
            } else {
                $scope.smartTALKActiveSessionList.forEach(function (v, i) {
                    //console.log('smartTALKActiveSessionList',v);
                    data.forEach(function (r, j) {
                        if (v.SESSIONID == r.SESSIONID) {
                            if ($scope.$$phase) { // most of the time it is "$digest"
                                $scope.smartTALKActiveSessionList[i] = data[j];
                            } else {
                                $scope.$apply($scope.smartTALKActiveSessionList[i] = data[j]);
                            }
                        }
                        if ($scope.hdsessionId == r.SESSIONID) {
                            $scope.ActiveTypingNotifaction = r.NOTIFY;
                            $scope.ActiveStatus = smartTALKCustomerStatus(r);
                            $scope.TextboxSendMessageEnabled = r.SESSIONDISPOSE;
                            if ($scope.TextboxSendMessageEnabled == "1") {
                                $("#txtmessage, #txtmessageExpand").attr("disabled", "disabled");
                            } else {
                                $("#txtmessage, #txtmessageExpand").removeAttr("disabled");
                            }
                            $scope.InteractionTime = r.INTERACTIONTIME;
                            $scope.ActiveHandleTime = r.ACTIVEHANDLETIME;
                        }
                    });
                });
                var NewInterCation = funCheckActiveRecord($scope.smartTALKActiveSessionList, data);
                NewInterCation.forEach(function (r, j) {
                    if ($scope.$$phase) { // most of the time it is "$digest"
                        $scope.smartTALKActiveSessionList.push(NewInterCation[j]);
                    } else {
                        $scope.$apply($scope.smartTALKActiveSessionList.push(NewInterCation[j]));
                    }
                });
            }
        }
        $scope.ActiveSessions = $scope.smartTALKActiveSessionList.length;
    } catch (e) { console.log('smartTALKActiveSession() catch block'); }
}

//end//






function smartTALKkeypress(e) {
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13' || keycode == 'undefined') {
        if (e.keyCode == 13) {
            if (!e.shiftKey) {
                smartTALKSendMSG();
                $scope.txtmessage = "";
                e.preventDefault();
                scrollSmoothToBottom('bluescrol');
            }
        }
    }
    var k;
    if ($scope.SendMessageTypingTime == 0) {
        sendnotification();
        window.clearTimeout(k);
        k = setTimeout(function () {
            stopnotification();
            $scope.SendMessageTypingTime = 0;
        }, 4000);
        $scope.SendMessageTypingTime = 1;
    }

    // /* below code is used for Signar */  //

    //$(document).ready(function () {
    //    var UID = $scope.hdPhoneNo;//$scope.smartTALKActiveSessionList[1].PHONENO;
    //    var chat = UF.connection.chatHub;
    //    UF.connection.hub.url = "http://10.10.120.167/signalr2/signalr";
    //    UF.connection.hub.start().done(function () {
    //        chat.server.typingNotification(UID);
    //    });
    //});

}

function smartTALKSendMSG() {
    var k = "";
    var hdnTextMsg = $("#hiddendiv").text();
    var textMsg = $scope.txtmessage;
    var IshndTextAvailable = false;
    if (hdnTextMsg) {
        IshndTextAvailable = true;
        $scope.txtmessage = $("#hiddendiv").text();
        $("#hiddendiv").html('');
        k = $scope.txtmessage.trim();
    } else if ($scope.txtmessage) {
        k = $scope.txtmessage.trim();
        if (IshndTextAvailable == false) {
            if ($scope.hdCHANNELID === 'TWITTER' || $scope.hdCHANNELID === 'TWITTERDM' || $scope.hdCHANNELID === 'FBCHAT' || $scope.hdCHANNELID === 'FB' || $scope.hdCHANNELID === 'WEBCHAT' || $scope.hdCHANNELID === 'WHATSAPP' || $scope.hdCHANNELID === 'CRAWL' || $scope.hdCHANNELID === 'IM' || $scope.hdCHANNELID === 'TELEGRAM') {
                // retain value of k else set k = blank
            }
            else {
                k = "";
            }
        }
    }

    k = stringEscape(k);
    k = k.replace(/^( |<br>)*(.*?)( |<br>)*$/, "$2");
    //commented to retain multiple line key
    //k = k.replace(/\n|\r/g, " ");
    $("#myPopup").hide();
    if ($scope.TextboxSendMessageEnabled != "1") {
        if (k != "" || $scope.hdPhoneNo != "") {
            $scope.blockedcontents = "";
            if (ContentBlocking) {
                AgentCheckAbusWord(k, $scope);
            } else {
                CheckAbusWord = true;
            }
            if (CheckAbusWord) {
                $scope.blockedcontents = "";
                SendMessage($scope.hdsessionId, $scope.hdPhoneNo, k, $scope.ActiveCustName.replace(/\'/g, ""), "", "", ".JPEG", $scope.hdCHANNELID, $scope.CHANNELSOURCE);
                $scope.txtmessage = "";
                $scope.txtmessage1 = "";

                var textChatKey = $scope.hdsessionId + '_chatMsg';
                if (sessionStorage.getItem(textChatKey) !== null) {
                    sessionStorage.setItem(textChatKey, '');
                }
            } else {
                $scope.blockedcontents = "You are not allowed to use blocked contents :" + $scope.blockedcontents;
            }
        }
    }
}

function smartTALKSendURL() {
    if ($scope.smartTALKPushUrlsText != "Push URLs" && $scope.hdPhoneNo != "") {

        var k = $scope.smartTALKPushUrlsText.trim();
        k = stringEscape(k);
        k = k.replace(/^( |<br>)*(.*?)( |<br>)*$/, "$2");
        SendMessage($scope.hdsessionId, $scope.hdPhoneNo, "", $scope.ActiveCustName.replace(/\'/g, ""), k, "", ".JPEG", $scope.hdCHANNELID, $scope.CHANNELSOURCE);
        $scope.smartTALKPushUrlsText = "Push URLs";
        $("#ChatArea").find("#txtmessage").focus();
        $("#myModal").find("#txtmessage").focus();
    }
}

function FunsmartTALKChat(data, status) {
    if (status) {
        $scope.smartTALKChatList = data.data;
        if ($scope.post == false) {
            if (data.data.length > 5) {
                $("#chatwindow").show();
            }
        }
        setTimeout(function v() {
            $("#ChatArea").find("#bluescroll").scrollTop(999999999999999999);
        }, 1000);
        setTimeout(function v() {
            $("#myModal").find("#bluescroll").scrollTop(999999999999999999);
        }, 1000);
    } else {
        $scope.MessageDispalyCount = $scope.MessageDispalyCount + 1;
        if ($scope.smartTALKChatList == null) {
            smartTALKClickActiveSession($scope.smartTALKActiveSessionList[0], 0)
        } else {
            $scope.smartTALKChatList.push(data[0]);
        }
        setTimeout(function v() {
            $("#ChatArea").find("#bluescroll").scrollTop(99999);
        }, 1000);
        setTimeout(function v() {
            $("#myModal").find("#bluescroll").scrollTop(99999);
        }, 1000);
    }
    $scope.startAnimationAgent();
}

BindAgentCanmessage();
BindGroup();
BindGroupChat();
if (readCookie("cgrouptabUnreadCount") != null) {
    $("#cgrouptabUnreadCount").html(readCookie("cgrouptabUnreadCount"));
    FunUnreadCountGroupChat(true);
}

$scope.funGetChannel = funGetChannel;
function funGetChannel() {
    GetChannel();
}
funGetChannel();

$scope.funGetAgentList = funGetAgentList;
function funGetAgentList() {
    GetAgentList();
}
funGetAgentList();



//canned msg
function smartTALTextmessageAppend(val) {
    //
    try {
        var k = $scope.txtmessage;
        var hdnTextMessage = $('#hiddendiv').text();

        $scope.txtmessage = "";
        $scope.txtmessage1 = "";

        if (k === hdnTextMessage) {
            hdnTextMessage = "";
        }
        else if (hdnTextMessage == "") {
            //user has intentionally made txtbox div blank and we now clear the model so that previous selected canned message gets clear
            $scope.txtmessage = "";
            k = "";
        }

        if ($scope.txtmessage == "" || $scope.txtmessage == null || $scope.txtmessage == "null") {
            $scope.txtmessage = hdnTextMessage + k + " " + val;
            //$scope.txtmessage = val;
            //this fix was done to show the selected Canned message in chat text area.
            //here we watch the txtmessage model change and apply the same to hiddendiv
            $scope.$watch('txtmessage', function () {
                $('#hiddendiv').text($scope.txtmessage);
            }, true);
        }
        else {
            $scope.txtmessage = hdnTextMessage + k + " " + val;

            $scope.$watch('txtmessage', function () {
                $('#hiddendiv').text($scope.txtmessage);
            }, true);
        }
    } catch (e) {
    }
}


bindCanMessage();
smartTALKDisposition();

$scope.smartTALKAgentOutBoundChanelList = {
    repeatSelect: 'Select Channels',
    availableOptions: [
        { id: 'Select Channels', name: 'Select Channels' },
        { id: 'Whatsapp', name: 'Whatsapp' },
        { id: 'Skype', name: 'Skype' },
        { id: 'TWITTERDM', name: 'Twitter-DM' },
        { id: 'FBCHAT', name: 'FBCHAT' },
        { id: 'Telegram', name: 'Telegram' }
    ],
};



$scope.smartTALKActiveAgentAction = {

    availableOptions: [
        { id: '', name: 'Action' },
        { id: 'Transfer', name: 'Transfer' },
        //{ id: 'Consult', name: 'Consult' },
        { id: 'IM', name: 'IM' }
    ],
};


$scope.smartTALKSupervisoerActiveAgentAction = {
    // repeatSelect: 'Select',
    availableOptions: [
        { id: '', name: 'Select' },
        { id: 'Force Logout', name: 'Force Logout' }
    ],
};

$scope.smartTALKSupervisoerActiveCustomerAction = {
    //  repeatSelect: 'Select',
    availableOptions: [
        { id: '', name: 'Select' },
        //{ id: 'Bargein', name: 'Bargein' },
        { id: 'ReQueue', name: 'ReQueue' },
        { id: 'EndChat', name: 'EndChat' },
        { id: 'Silent Monitoring', name: 'Silent Monitoring' }
    ],
};

$scope.smartTALKOutboundValue = "";



$scope.smartTALKSendOutbound = function (oOBSelectedCustomer) {
    //funClickTOOutBound($scope.smartTALKAgentOutBoundChanelList.repeatSelect, $scope.smartTALKOutboundValue);
    var selectedChannel = 'WHATSAPP';
    var selectedChannelValue = oOBSelectedCustomer.PHONENO
    funClickTOOutBound(selectedChannel, selectedChannelValue);
}

$scope.smartTALKSendSMSOutbound = function () {
    //funClickTOOutBound($scope.smartTALKAgentOutBoundChanelList.repeatSelect, $scope.smartTALKOutboundValue);
    var OutboundphoneNumber = $scope.smartTALKOutboundMobileValue;
    var OutBoundMessage = $scope.smartTALKOutboundMessageValue;
    if (OutboundphoneNumber) {
        var pNumber_regex = /^[0-9]{10,12}$/;
        result = pNumber_regex.test(OutboundphoneNumber);
        if (!result) {
            $("#msgddlsubtype").show();
            $("#msgddlsubtype").html('Enter vaild Mobile Number');
            requestSMSOutBoundList();
        }
        else {
            $("#msgddlsubtype").hide();
            $("#msgddlsubtype").html('');
            funClickTOSMSOutBound(OutboundphoneNumber, escape(OutBoundMessage))
            requestSMSOutBoundList();
        }
    }
    else {
        $("#msgddlsubtype").show();
        $("#msgddlsubtype").html('Enter vaild Mobile Number');
        requestSMSOutBoundList();
    }
}


$scope.outBoundSelectedChatHistoryInteraction = function (oOBSelectedChatHistoryInteraction) {
    console.log('oOBSelectedChatHistoryInteraction', oOBSelectedChatHistoryInteraction);
    funClickTOOutBound(oOBSelectedChatHistoryInteraction.Channel, oOBSelectedChatHistoryInteraction.MobileNumber);
}
$scope.invokeCustomerInQueue = function (oCustomerInQueue) {
    funInvokeCustomerInQueue(oCustomerInQueue)
}
$scope.smartTALKSuperviserRequestdata = smartTALKSuperviserRequestdata;

function smartTALKSuperviserRequestdata() {
    $('#supLoadIndicator').addClass("fa-spin");
    $('#supLoadIndicatorMsg').html('Fetching...');
    funSuperviserRequestdata();
}

function smartTALKSuperVisoerAgentAction(x) {

    if (x.ACTION != "") {
        FunAgentAction(x, x.ACTION);

        setTimeout(function v() {
            funSuperviserRequestdata();
        }, 1000);

    }
    else {
        smartTALKNotificationError("Please select action type!");
    }

}
function smartTALKSuperVisoerCustomerAction(x) {

    if (x.ACTION != "") {

        FunCustomerAction(x, x.ACTION);
    }
    else {
        smartTALKNotificationError("Please select action type!");
    }
}

//FuncationFileView

$scope.FuncationFileIconeSet = FuncationFileIconeSet;

$scope.FuncationFileViewSet = FuncationFileViewSet;

function FuncationFileViewSet(value) {
    if (value.LOCATION != "") {
        // 
        return FuncationFileView(value.LOCATION);

    }
    else {
        return "";
    }
}

function FuncationFileIconeSet(value) {

    if (value.LOCATION != "") {
        //
        return FuncationFileIcone(value.LOCATION);

    }
    else {
        return "";
    }
}



$scope.FullScreenImagesPath = "";
$scope.FullScreenImages = function (x) {
    try {
        $scope.FullScreenImagesPath = $sce.trustAsResourceUrl(x.LOCATION);
        $("#btnImagePrievewModal").click();
    } catch (e) {
    }
}

$scope.smartTALKActiveAgentActionClick = function (x) {
    //console.log('smartTALKActiveAgentActionClick click data', x);
    //console.log('smartTALKActiveSessionList data', $scope.smartTALKActiveSessionList);
    //Kirti check here
    try {
        var IsIMDuplicateFound = false; //this avoids initialiting multiple IMs to same person.
        var restrictInitiatedIMTransfer = false;    //this avoids Transferring intiated IM

        var selectValue = x.ACTION;

        angular.forEach($scope.smartTALKActiveSessionList, function (value, index) {
            if (x.AGENTID == value.PHONENO && value.INTERACTIONTYPE == 'IM') {
                //console.log('Duplicate IM intitalization found set flag true');
                IsIMDuplicateFound = true;
            }

            if (selectValue == 'Transfer' && x.AGENTID == value.PHONENO && value.INTERACTIONTYPE == 'IM' && value.ROWNUMBER === $scope.ActiveInteractionRowNumber) {
                restrictInitiatedIMTransfer = true;
            }
        })


        if (selectValue != "") {
            //Duplicate IM detected
            if (selectValue == "IM" && IsIMDuplicateFound == true) {
                smartTALKNotificationError("IM already active");
                return;
            }

            if (selectValue == "Transfer" && restrictInitiatedIMTransfer == true) {
                smartTALKNotificationError("IM is already initaiated cannot process Transfer request");
                return;
            }
            if (selectValue == "IM") {
                $scope.TextboxSendMessageEnabled = "0";
            }

            if ($scope.TextboxSendMessageEnabled == "1") {
                smartTALKNotificationError("Action denied as the chat is already disconnected.");
            }
            else {
                funAgentTranferRequestAction(x, selectValue);

                setTimeout(function () {
                    if ($scope.smartTALKActiveSessionList.length == 0) {
                        LoadForm();
                    }
                }, 5000)
            }
        }
        else { smartTALKNotificationError("Please select action type!"); }
    } catch (e) { }

}





//