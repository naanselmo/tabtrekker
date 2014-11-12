'use strict';

/* SDK Modules */
const simplePrefs = require('sdk/simple-prefs');

/* Modules */
const logger = require('logger.js').NewTabLogger;
const utils = require('utils.js').NewTabUtils;
var newtab; //load on initialization to ensure main module is loaded

/* Constants */
//messages
const HIDE_TIME_MSG = 'hide_time';
const TIME_MSG = 'time';
//preferences
const _24HOUR_PREF = '24hour';
const SHOW_TIME_PREF = 'show_time';

/**
 * Time module.
 */
var NewTabTime = {

    /**
     * Initializes time by sending time options to the content scripts.
     */
    initTime: function(worker) {
        newtab = require('main.js').NewTabMain;

        //don't initialize time when it is hidden
        var timeVisibility = simplePrefs.prefs[SHOW_TIME_PREF];
        if(timeVisibility == 'never') {
            utils.emit(newtab.workers, worker, HIDE_TIME_MSG);
            return;
        }

        logger.log('Initializing time.');

        var options = {}
        options[_24HOUR_PREF] = simplePrefs.prefs[_24HOUR_PREF];
        options[SHOW_TIME_PREF] = simplePrefs.prefs[SHOW_TIME_PREF];
        utils.emit(newtab.workers, worker, TIME_MSG, options);
    }
};

exports.NewTabTime = NewTabTime;