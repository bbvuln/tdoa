/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _sniffer = __webpack_require__(1);

	var _methods = __webpack_require__(2);

	var readyCbs = [];
	// let errorCb = () => {}

	// reveal the td object to the global environment
	window.td = function () {

	    return {
	        ready: function ready(cb) {
	            if (typeof cb !== 'function') {
	                throw new Error('td.ready() only accept functions, instead receiving a ' + (typeof cb === 'undefined' ? 'undefined' : _typeof(cb)) + '.');
	            }
	            if (!window.td.bridgeReady) {
	                readyCbs.push(cb);
	            } else {
	                cb();
	            }
	        },
	        error: function error() /*cb*/{
	            //errorCb =cb
	        }
	    };
	}();

	//iphone bridge setup function definition
	function setupWebViewJavascriptBridge(callback) {
	    if (window.WebViewJavascriptBridge) {
	        return callback(WebViewJavascriptBridge);
	    }
	    if (window.WVJBCallbacks) {
	        return window.WVJBCallbacks.push(callback);
	    }
	    window.WVJBCallbacks = [callback];
	    var WVJBIframe = document.createElement('iframe');
	    WVJBIframe.style.display = 'none';
	    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
	    document.documentElement.appendChild(WVJBIframe);
	    setTimeout(function () {
	        document.documentElement.removeChild(WVJBIframe);
	    }, 0);
	}
	//android bridge setup function definition
	function connectWebViewJavascriptBridge(callback) {
	    if (window.WebViewJavascriptBridge) {
	        callback(WebViewJavascriptBridge);
	    } else {
	        document.addEventListener('WebViewJavascriptBridgeReady', function () {
	            callback(WebViewJavascriptBridge);
	        }, false);
	    }
	}

	var td = {};
	var setupBridge = void 0;

	if ((0, _sniffer.isAndroid)()) {
	    setupBridge = connectWebViewJavascriptBridge;

	    //init
	    setupBridge(function (bridge) {
	        bridge.init(function (message, responseCallback) {
	            //console.log('JS got a message', message)
	            var data = {
	                'Javascript Responds': '测试中文!'
	                //console.log('JS responding with', data)
	            };responseCallback(data);
	        });

	        //register all the callbacks
	        td = {
	            showUserDetails: (0, _methods.showUserDetails)(bridge),
	            confirm: (0, _methods.showDialog)(bridge),
	            toast: (0, _methods.showToast)(bridge),
	            getLocation: (0, _methods.getLocation)(bridge),
	            previewImage: (0, _methods.showPic)(bridge),
	            launchApp: (0, _methods.startApp)(bridge),
	            previewFile: (0, _methods.showAttachment)(bridge),
	            call: (0, _methods.callPhone)(bridge),
	            sendMessage: (0, _methods.sendMessage)(bridge),
	            getNetworkType: (0, _methods.getNetworkType)(bridge),
	            chooseImage: (0, _methods.selectPic)(bridge),
	            selectFile: (0, _methods.selectAttachment)(bridge),
	            selectUser: (0, _methods.selectUser)(bridge),
	            openUrl: (0, _methods.openUrl)(bridge),
	            selectDept: (0, _methods.selectDept)(bridge),
	            setTitle: (0, _methods.setTitle)(bridge),
	            setRight: (0, _methods.setRight)(bridge),
	            setLeft: (0, _methods.setLeft)(bridge),
	            actionSheet: (0, _methods.actionSheet)(bridge),
	            closeWebview: (0, _methods.closeWebview)(bridge),
	            checkIn: (0, _methods.checkIn)(bridge),
	            getMacAddress: (0, _methods.getMacAddress)(bridge),
	            getLocationByMap: (0, _methods.getLocationByMap)(bridge),
	            getLocationOutside: (0, _methods.getLocationOutside)(bridge),
	            sendModuleName: (0, _methods.sendModuleName)(bridge),
	            sendJumpURL: (0, _methods.sendJumpURL)(bridge),
	            ocrScan: (0, _methods.ocrScan)(bridge),
	            richScan: (0, _methods.richScan)(bridge),
	            synchroAgendaToMobile: (0, _methods.synchroAgendaToMobile)(bridge),
	            synchroAgendaToOA: (0, _methods.synchroAgendaToOA)(bridge),
	            videoConference: (0, _methods.videoConference)(bridge),
	            selectedWorkbench: (0, _methods.selectedWorkbench)(bridge)
	        };

	        window.td = _extends({}, window.td, td, {
	            bridgeReady: true
	        });

	        for (var i = 0; i < readyCbs.length; i++) {
	            readyCbs[i]();
	        }
	    });
	}
	if ((0, _sniffer.isIphone)()) {
	    setupBridge = setupWebViewJavascriptBridge;
	    setupBridge(function (bridge) {

	        //register all the callbacks
	        td = {
	            showUserDetails: (0, _methods.showUserDetails)(bridge),
	            confirm: (0, _methods.showDialog)(bridge),
	            toast: (0, _methods.showToast)(bridge),
	            getLocation: (0, _methods.getLocation)(bridge),
	            previewImage: (0, _methods.showPic)(bridge),
	            launchApp: (0, _methods.startApp)(bridge),
	            previewFile: (0, _methods.showAttachment)(bridge),
	            call: (0, _methods.callPhone)(bridge),
	            sendMessage: (0, _methods.sendMessage)(bridge),
	            getNetworkType: (0, _methods.getNetworkType)(bridge),
	            chooseImage: (0, _methods.selectPic)(bridge),
	            selectFile: (0, _methods.selectAttachment)(bridge),
	            selectUser: (0, _methods.selectUser)(bridge),
	            openUrl: (0, _methods.openUrl)(bridge),
	            selectDept: (0, _methods.selectDept)(bridge),
	            setTitle: (0, _methods.setTitle)(bridge),
	            setRight: (0, _methods.setRight)(bridge),
	            setLeft: (0, _methods.setLeft)(bridge),
	            actionSheet: (0, _methods.actionSheet)(bridge),
	            closeWebview: (0, _methods.closeWebview)(bridge),
	            checkIn: (0, _methods.checkIn)(bridge),
	            getMacAddress: (0, _methods.getMacAddress)(bridge),
	            getLocationByMap: (0, _methods.getLocationByMap)(bridge),
	            getLocationOutside: (0, _methods.getLocationOutside)(bridge),
	            sendModuleName: (0, _methods.sendModuleName)(bridge),
	            sendJumpURL: (0, _methods.sendJumpURL)(bridge),
	            ocrScan: (0, _methods.ocrScan)(bridge),
	            richScan: (0, _methods.richScan)(bridge),
	            synchroAgendaToMobile: (0, _methods.synchroAgendaToMobile)(bridge),
	            synchroAgendaToOA: (0, _methods.synchroAgendaToOA)(bridge),
	            videoConference: (0, _methods.videoConference)(bridge),
	            selectedWorkbench: (0, _methods.selectedWorkbench)(bridge)
	        };

	        window.td = _extends({}, window.td, td, {
	            bridgeReady: true
	        });

	        for (var i = 0; i < readyCbs.length; i++) {
	            readyCbs[i]();
	        }
	    });
	}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	//test for android
	var isAndroid = exports.isAndroid = function isAndroid() {
	    var ua = navigator.userAgent.toLowerCase();
	    var isA = ua.indexOf('android') > -1;
	    if (isA) {
	        return true;
	    }
	    return false;
	};

	//test for iphone or ipad
	var isIphone = exports.isIphone = function isIphone() {
	    // const ua = navigator.userAgent.toLowerCase()
	    //const isIph = ua.indexOf('iphone') > -1
	    var isIph = /iphone|ipad/gi.test(navigator.appVersion);
	    if (isIph) {
	        return true;
	    }
	    return false;
	};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.selectedWorkbench = exports.richScan = exports.videoConference = exports.synchroAgendaToOA = exports.synchroAgendaToMobile = exports.ocrScan = exports.sendJumpURL = exports.sendModuleName = exports.getLocationOutside = exports.getLocationByMap = exports.getMacAddress = exports.checkIn = exports.closeWebview = exports.actionSheet = exports.setLeft = exports.setRight = exports.setTitle = exports.selectDept = exports.openUrl = exports.selectUser = exports.selectAttachment = exports.selectPic = exports.getNetworkType = exports.sendMessage = exports.callPhone = exports.showAttachment = exports.startApp = exports.showPic = exports.getLocation = exports.showToast = exports.showDialog = exports.showUserDetails = undefined;

	var _constants = __webpack_require__(3);

	var showUserDetails = exports.showUserDetails = function showUserDetails(bridge) {
		return function (argObj) {
			var uid = argObj.uid,
			    onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.SHOW_USER_DETAILS, { uid: uid }, function (responseData) {
					responseData = JSON.parse(responseData);
					if (responseData.status === '1') {
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

	/*
	 * name: showDiag
	 * params: message|String, onSuccess|Function, onFail|Function
	 */
	var showDialog = exports.showDialog = function showDialog(bridge) {
		return function (argObj) {
			var title = argObj.title,
			    message = argObj.message,
			    buttonLabels = argObj.buttonLabels,
			    onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.SHOW_DIALOG, { title: title, msg: message, buttons: buttonLabels }, function (responseData) {
					responseData = JSON.parse(responseData);
					if (responseData.status === '1') {
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

	var showToast = exports.showToast = function showToast(bridge) {
		return function (argObj) {
			var text = argObj.text,
			    duration = argObj.duration,
			    delay = argObj.delay,
			    onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.SHOW_TOAST, { text: text, duration: duration, delay: delay }, function (responseData) {
					responseData = JSON.parse(responseData);
					if (responseData.status === '1') {
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

	var getLocation = exports.getLocation = function getLocation(bridge) {
		return function (argObj) {
			var onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.GET_LOCATION, {}, function (responseData) {
					responseData = JSON.parse(responseData);
					if (responseData.status === '1') {
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

	var showPic = exports.showPic = function showPic(bridge) {
		return function (argObj) {
			var urls = argObj.urls,
			    current = argObj.current,
			    _argObj$allowDownload = argObj.allowDownload,
			    allowDownload = _argObj$allowDownload === undefined ? true : _argObj$allowDownload,
			    onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			var index = urls.indexOf(current);

			try {
				bridge.callHandler(_constants.SHOW_PIC, { urls: urls, index: index, allowDownload: allowDownload }, function (responseData) {
					responseData = JSON.parse(responseData);
					if (responseData.status === '1') {
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

	var startApp = exports.startApp = function startApp(bridge) {
		return function (argObj) {
			var app = argObj.app,
			    onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.START_APP, { app: app }, function (responseData) {
					responseData = JSON.parse(responseData);
					if (responseData.status === '1') {
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

	var showAttachment = exports.showAttachment = function showAttachment(bridge) {
		return function (argObj) {
			var url = argObj.url,
			    canEdit = argObj.canEdit,
			    onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.SHOW_ATTACHMENT, { url: url, canEdit: canEdit }, function (responseData) {
					responseData = JSON.parse(responseData);
					if (responseData.status === '1') {
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

	var callPhone = exports.callPhone = function callPhone(bridge) {
		return function (argObj) {
			var phoneNum = argObj.phoneNum,
			    onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.CALL_PHONE, { phoneNum: phoneNum }, function (responseData) {
					if (responseData.status === '1') {
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

	var sendMessage = exports.sendMessage = function sendMessage(bridge) {
		return function (argObj) {
			var phoneNums = argObj.phoneNums,
			    content = argObj.content,
			    onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.SEND_MESSAGE, { phoneNums: phoneNums, content: content }, function (responseData) {
					if (responseData.status === '1') {
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

	var getNetworkType = exports.getNetworkType = function getNetworkType(bridge) {
		return function (argObj) {
			var onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.GET_NETWORK_TYPE, {}, function (responseData) {
					responseData = JSON.parse(responseData);
					//data can be : wifi, 2g, 3g, 4g, none, unknow
					onSuccess(responseData.data);
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

	var selectPic = exports.selectPic = function selectPic(bridge) {
		return function (argObj) {
			var module = argObj.module,
			    _argObj$max = argObj.max,
			    max = _argObj$max === undefined ? 9 : _argObj$max,
			    _argObj$fromCamera = argObj.fromCamera,
			    fromCamera = _argObj$fromCamera === undefined ? false : _argObj$fromCamera,
			    _argObj$multiple = argObj.multiple,
			    multiple = _argObj$multiple === undefined ? true : _argObj$multiple,
			    onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.SELECT_PIC, { module: module, multiple: multiple, max: max, fromCamera: fromCamera }, function (responseData) {
					responseData = JSON.parse(responseData);
					if (responseData.status === '1') {
						//把\t换回单引号，注：单引号bridge里面跑不过，换成了\t
						responseData.data.forEach(function (item) {
							var link = item.link;

							var newLink = link.replace(/\t/g, '\'');
							item.link = newLink;
						});
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

	var selectAttachment = exports.selectAttachment = function selectAttachment(bridge) {
		return function (argObj) {
			var module = argObj.module,
			    _argObj$multiple2 = argObj.multiple,
			    multiple = _argObj$multiple2 === undefined ? true : _argObj$multiple2,
			    onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.SELECT_ATTACHMENT, { module: module, multiple: multiple }, function (responseData) {
					responseData = JSON.parse(responseData);
					if (responseData.status === '1') {
						//把\t换回单引号，注：单引号bridge里面跑不过，换成了\t
						responseData.data.forEach(function (item) {
							var link = item.link;

							var newLink = link.replace(/\t/g, '\'');
							item.link = newLink;
						});
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

	var selectUser = exports.selectUser = function selectUser(bridge) {
		return function (argObj) {
			var _argObj$users = argObj.users,
			    users = _argObj$users === undefined ? [] : _argObj$users,
			    _argObj$multiple3 = argObj.multiple,
			    multiple = _argObj$multiple3 === undefined ? true : _argObj$multiple3,
			    _argObj$usableUids = argObj.usableUids,
			    usableUids = _argObj$usableUids === undefined ? '' : _argObj$usableUids,
			    _argObj$checkedAll = argObj.checkedAll,
			    checkedAll = _argObj$checkedAll === undefined ? true : _argObj$checkedAll,
			    _argObj$whiteList = argObj.whiteList,
			    whiteList = _argObj$whiteList === undefined ? false : _argObj$whiteList,
			    onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.SELECT_USER, { ids: users.join(), multiple: multiple, usableUids: usableUids, checkedAll: checkedAll, whiteList: whiteList }, function (responseData) {
					responseData = JSON.parse(responseData);
					if (responseData.status === '1') {
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

	var openUrl = exports.openUrl = function openUrl(bridge) {
		return function (argObj) {
			var _argObj$url = argObj.url,
			    url = _argObj$url === undefined ? '' : _argObj$url,
			    onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.OPEN_URL, { url: url }, function (responseData) {
					responseData = JSON.parse(responseData);
					if (responseData.status === '1') {
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

	var selectDept = exports.selectDept = function selectDept(bridge) {
		return function (argObj) {
			var _argObj$depts = argObj.depts,
			    depts = _argObj$depts === undefined ? [] : _argObj$depts,
			    _argObj$multiple4 = argObj.multiple,
			    multiple = _argObj$multiple4 === undefined ? true : _argObj$multiple4,
			    onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.SELECT_DEPT, { ids: depts.join(), multiple: multiple }, function (responseData) {
					responseData = JSON.parse(responseData);
					if (responseData.status === '1') {
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

	var setTitle = exports.setTitle = function setTitle(bridge) {
		return function (argObj) {
			var title = argObj.title,
			    onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.SET_TITLE, { title: title }, function (responseData) {
					responseData = JSON.parse(responseData);
					if (responseData.status === '1') {
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

	var setRight = exports.setRight = function setRight(bridge) {
		return function (argObj) {
			var show = argObj.show,
			    control = argObj.control,
			    text = argObj.text,
			    type = argObj.type,
			    iconUrl = argObj.iconUrl,
			    onSuccess = argObj.onSuccess,
			    onSearchChange = argObj.onSearchChange,
			    onFail = argObj.onFail;


			try {
				bridge.registerHandler('onSearchChange', function (data) {
					onSearchChange && onSearchChange(data);
				});
				bridge.callHandler(_constants.SET_RIGHT, { show: show, control: control, text: text, type: type, iconUrl: iconUrl }, function (responseData) {
					responseData = JSON.parse(responseData);
					if (responseData.status === '1') {
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

	var setLeft = exports.setLeft = function setLeft(bridge) {
		return function (argObj) {
			var onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.SET_LEFT, {}, function (responseData) {
					responseData = JSON.parse(responseData);
					if (responseData.status === '1') {
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

	var actionSheet = exports.actionSheet = function actionSheet(bridge) {
		return function (argObj) {
			var title = argObj.title,
			    cancelButton = argObj.cancelButton,
			    otherButtons = argObj.otherButtons,
			    onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.ACTION_SHEET, { title: title, cancelButton: cancelButton, otherButtons: otherButtons }, function (responseData) {
					responseData = JSON.parse(responseData);
					if (responseData.status === '1') {
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

	var closeWebview = exports.closeWebview = function closeWebview(bridge) {
		return function (argObj) {
			try {
				bridge.callHandler(_constants.CLOSE_WEBVIEW, {}, function (responseData) {});
			} catch (e) {
				// alert(e.message)
			}
		};
	};

	var checkIn = exports.checkIn = function checkIn(bridge) {
		return function (argObj) {
			var _argObj$locales = argObj.locales,
			    locales = _argObj$locales === undefined ? [] : _argObj$locales,
			    onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.CHECK_IN, { locales: locales }, function (responseData) {
					responseData = JSON.parse(responseData);
					if (responseData.status === '1') {
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

	var getMacAddress = exports.getMacAddress = function getMacAddress(bridge) {
		return function (argObj) {
			var onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.GET_MAC_ADDRESS, {}, function (responseData) {
					responseData = JSON.parse(responseData);
					if (responseData.status === '1') {
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

	var getLocationByMap = exports.getLocationByMap = function getLocationByMap(bridge) {
		return function (argObj) {
			var onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.GET_LOCATION_BY_MAP, {}, function (responseData) {
					responseData = JSON.parse(responseData);
					if (responseData.status === '1') {
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

	var getLocationOutside = exports.getLocationOutside = function getLocationOutside(bridge) {
		return function (argObj) {
			var onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.GET_LOCATION_OUTSIDE, {}, function (responseData) {
					responseData = JSON.parse(responseData);
					if (responseData.status === '1') {
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

	var sendModuleName = exports.sendModuleName = function sendModuleName(bridge) {
		return function (argObj) {
			var name = argObj.name,
			    url = argObj.url,
			    onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.SEND_MODULE_NAME, { name: name, url: url }, function (responseData) {
					responseData = JSON.parse(responseData);
					if (responseData.status === '1') {
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

	var sendJumpURL = exports.sendJumpURL = function sendJumpURL(bridge) {
		return function (argObj) {
			var url = argObj.url,
			    openMode = argObj.openMode,
			    onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.SEND_JUMP_URL, { url: url, openMode: openMode }, function (responseData) {
					responseData = JSON.parse(responseData);
					if (responseData.status === '1') {
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

	var ocrScan = exports.ocrScan = function ocrScan(bridge) {
		return function (argObj) {
			var onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.OCR_SCAN, {}, function (responseData) {
					responseData = JSON.parse(responseData);
					if (responseData.status === '1') {
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

	var synchroAgendaToMobile = exports.synchroAgendaToMobile = function synchroAgendaToMobile(bridge) {
		return function (argObj) {
			var data = argObj.data,
			    onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.SYNCHRO_AGENDA_TO_MOBILE, { data: data }, function (responseData) {
					responseData = JSON.parse(responseData);
					if (responseData.status === '1') {
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};
	var synchroAgendaToOA = exports.synchroAgendaToOA = function synchroAgendaToOA(bridge) {
		return function (argObj) {
			var onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.SYNCHRO_AGENDA_TO_OA, {}, function (responseData) {
					responseData = JSON.parse(responseData);
					if (responseData.status === '1') {
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};
	var videoConference = exports.videoConference = function videoConference(bridge) {
		return function (argObj) {
			var data = argObj.data,
			    onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.VIDEO_CONFERENCE, { data: data }, function (responseData) {
					responseData = JSON.parse(responseData);
					if (responseData.status === '1') {
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

	var richScan = exports.richScan = function richScan(bridge) {
		return function (argObj) {
			var onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.RICHSCAN, {}, function (responseData) {
					responseData = JSON.parse(responseData);
					if (responseData.status === '1') {
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

	var selectedWorkbench = exports.selectedWorkbench = function selectedWorkbench(bridge) {
		return function (argObj) {
			var workBenchId = argObj.workBenchId,
			    workBenchUrl = argObj.workBenchUrl,
			    workBenchTitle = argObj.workBenchTitle,
			    onSuccess = argObj.onSuccess,
			    onFail = argObj.onFail;


			try {
				bridge.callHandler(_constants.SELECTED_WORKBENCH, { workBenchId: workBenchId, workBenchUrl: workBenchUrl, workBenchTitle: workBenchTitle }, function (responseData) {
					responseData = JSON.parse(responseData);
					if (responseData.status === '1') {
						onSuccess(responseData.data);
					} else if (responseData.status === '0') {
						onFail(responseData.message);
					}
				});
			} catch (e) {
				onFail(e.message);
			}
		};
	};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	// all the native method names
	var SHOW_USER_DETAILS = exports.SHOW_USER_DETAILS = 'showUserDetails';
	var SHOW_DIALOG = exports.SHOW_DIALOG = 'showDialog';
	var SHOW_TOAST = exports.SHOW_TOAST = 'showToast';
	var GET_LOCATION = exports.GET_LOCATION = 'getLocation';
	var SHOW_PIC = exports.SHOW_PIC = 'showImage';
	var START_APP = exports.START_APP = 'startApp';
	var SHOW_ATTACHMENT = exports.SHOW_ATTACHMENT = 'showAttachment';
	var CALL_PHONE = exports.CALL_PHONE = 'callPhone';
	var SEND_MESSAGE = exports.SEND_MESSAGE = 'sendMessage';
	var GET_NETWORK_TYPE = exports.GET_NETWORK_TYPE = 'getNetworkType';
	var SELECT_PIC = exports.SELECT_PIC = 'selectPic';
	var SELECT_ATTACHMENT = exports.SELECT_ATTACHMENT = 'selectAttachment';
	var SELECT_USER = exports.SELECT_USER = 'selectUser';
	var SELECT_DEPT = exports.SELECT_DEPT = 'selectDept';
	var SET_TITLE = exports.SET_TITLE = 'setTitle';
	var SET_RIGHT = exports.SET_RIGHT = 'setRight';
	var SET_LEFT = exports.SET_LEFT = 'setLeft';
	var ACTION_SHEET = exports.ACTION_SHEET = 'actionSheet';
	var CLOSE_WEBVIEW = exports.CLOSE_WEBVIEW = 'closeWebview';
	var CHECK_IN = exports.CHECK_IN = 'checkIn';
	var GET_MAC_ADDRESS = exports.GET_MAC_ADDRESS = 'getMacAddress';
	var GET_LOCATION_BY_MAP = exports.GET_LOCATION_BY_MAP = 'getLocationByMap';
	var GET_LOCATION_OUTSIDE = exports.GET_LOCATION_OUTSIDE = 'getLocationOutside';
	var SEND_MODULE_NAME = exports.SEND_MODULE_NAME = 'sendModuleName';
	var SEND_JUMP_URL = exports.SEND_JUMP_URL = 'sendJumpURL';
	var OCR_SCAN = exports.OCR_SCAN = 'ocrScan';
	var OPEN_URL = exports.OPEN_URL = 'openUrl';
	var RICHSCAN = exports.RICHSCAN = 'richScan';
	var SYNCHRO_AGENDA_TO_MOBILE = exports.SYNCHRO_AGENDA_TO_MOBILE = 'synchroAgendaToMobile';
	var SYNCHRO_AGENDA_TO_OA = exports.SYNCHRO_AGENDA_TO_OA = 'synchroAgendaToOA';
	var VIDEO_CONFERENCE = exports.VIDEO_CONFERENCE = 'videoConference';
	var SELECTED_WORKBENCH = exports.SELECTED_WORKBENCH = 'selectedWorkbench';

/***/ })
/******/ ]);