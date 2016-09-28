(function () {
    'use strict';

    /**
     * Displays logging information on the screen and in the console.
     * @param {string} msg - Message to log.
     */
    function log(msg) {
        var logsEl = document.getElementById('logs');

        if (msg) {
            // Update logs
            console.log('[TVWindow]: ', msg);
            logsEl.innerHTML += msg + '<br />';
        } else {
            // Clear logs
            logsEl.innerHTML = '';
        }

        logsEl.scrollTop = logsEl.scrollHeight;
    }

    /**
     * Register keys used in this application
     */
    function registerKeys() {
        var usedKeys = ['0', 'ColorF0Red'];

        usedKeys.forEach(
            function (keyName) {
                tizen.tvinputdevice.registerKey(keyName);
            }
        );
    }


    /**
     * Handle input from remote
     */
    function registerKeyHandler() {
        document.addEventListener('keydown', function (e) {
            switch (e.keyCode) {
                case 13:
                    // Enter key
                    showhide();
                    break;
                //key 0
                case 48:
                    log();
                    break;
                //key red
                case 403:
                    displayInfo();
                    break;
                //key return
                case 10009:
                    tizen.application.getCurrentApplication().exit();
                    break;
                default:
                    log("keycode: " + keyEvent.keyCode);
                    break;
            }
        });
    }

    /**
     * Display application version
     */
    function displayVersion() {
        var el = document.createElement('div');
        el.id = 'version';
        el.innerHTML = 'ver: ' + tizen.application.getAppInfo().version;
        document.body.appendChild(el);
    }


    var tvWindowCoordinates = ["10px", "300px", "50%", "540px"],
        display = true;

    /**
     * @description Sets the display area of TV hole window and show it on the display screen.
     * @method tvWindow.showWindow()
     * @param parameters {Array} - An array that contains information about the position and size of a specified TV hole window as a string with units
     * Without this, the TV hole window will have the same size and location as shown before.
     * But, if you have never specified a rectangle, the TV hole window will be shown in full screen mode.
     * @private
     */
    function showWindow(parameters) {

        var param = parameters || tvWindowCoordinates;

        function successCB(windowRect, type) {
            // You will get exactly what you put as rectangle argument of show() through windowRect.
            // expected result : ["0", "0px", "50%", "540px"]
            log("Rectangle : [" + windowRect[0] + ", " + windowRect[1] + ", " + windowRect[2] + ", " + windowRect[3] + "]");
            display = true;
        }

        try {
            // successCB - The method to invoke when the position and size of the TV window has been changed successfully.
            // null - errorCallback [optional] [nullable] : The method to invoke when an error occurs.
            // MAIN - The window type. By default, this attribute is set to MAIN.
            tizen.tvwindow.show(successCB, null, param, "MAIN");
        } catch(error) {
            log("error: " + error.name);
        }
    };

    /**
     * @description Hides the TV hole window on the display screen.
     * @method tvWindow.hideWindow()
     * @private
     */
    function hideWindow() {
        function successCB() {
            display = false;
            log('TVWindow hidden');
        }

        try {
            tizen.tvwindow.hide(successCB);
        } catch(error) {
            log("error: " + error.name);
        }
    };

    /**
     * @description trigger for tv window display whenever it is displayed or not
     * @method tvWindow.showhide()
     * @public
     */
    function showhide() {
        (display) ? hideWindow() : showWindow(tvWindowCoordinates);
    }

    /**
     * @description Display test information regarding tv window
     * @method tvWindow.displayInfo()
     * @public
     */
    function displayInfo() {
        getAvailableWindows();
        getSource();
        getRect();
    }

    /**
     * @description Gets the list of available windows.
     * @method tvWindow.getAvailableWindows()
     * @public
     */
    function getAvailableWindows() {
        function successCB(availableWindows) {
            var html = [];
            for (var i = 0; i < availableWindows.length; i++) {
                log("Available window ["+ i + "] = " + availableWindows[i]);
            }
        }

        try {
            tizen.tvwindow.getAvailableWindows(successCB);
        } catch (error) {
            log("Error name = "+ error.name + ", Error message = " + error.message);
        }
    };

    /**
     * @description Gets information about the current source of a specified TV hole window.
     * @method tvWindow.getSource()
     * @public
     */
    function getSource() {
        try {
            var source = tizen.tvwindow.getSource();
            log("Source type: " + source.type + "number = " + source.number);
        } catch (error) {
            console.log("Error name = "+ error.name + ", Error message = " + error.message);
        }
    };

    /**
     * @description Gets the area information of TV hole window on the display screen.
     * @method tvWindow.getRect()
     * @public
     */
    function getRect() {
        function rectangleCB(windowRect, type) {
            // You call getRect() without specifying a unit, it expresses the area information with pixel unit.
            // expected result : ["0px", "0px", "960px", "540px"] if the screen resolution of a device is 1920 x 1080.
            log("Rectangle: [" + windowRect[0] + ", " + windowRect[1] + ", " + windowRect[2] + ", " + windowRect[3] + "]");
        }

        try {
            tizen.tvwindow.getRect(rectangleCB);
        } catch(error) {
            log("error: " + error.name);
        }
    };

    /**
     * Start the application once loading is finished
     */
    window.onload = function () {
        if (window.tizen === undefined) {
            log('This application needs to be run on Tizen device');
            return;
        }

        displayVersion();

        registerKeys();
        registerKeyHandler();

        showWindow();

    }

})();