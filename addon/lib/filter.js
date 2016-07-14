'use strict';

/* SDK Modules */
const simplePrefs = require('sdk/simple-prefs');

/* Modules */
const logger = require('./logger').TabTrekkerLogger;
const utils = require('./utils').TabTrekkerUtils;
var tabtrekker; //load on initialization to ensure main module is loaded

/* Constants */
//messages
const HIDE_FILTER_MSG = 'hide_filter';
const FILTER_MSG = 'filter';
//preferences
const BACKGROUND_FILTER_LOCATION_PREF = 'background_filter';
const BACKGROUND_FILTER_OPACITY_PREF = 'background_filter_opacity';
const BACKGROUND_FILTER_COLOR_PREF = 'background_filter_color';

/**
 * Filter module.
 */
var TabTrekkerFilter = {

    /**
     * Initializes filter by sending filter options to the content scripts.
     */
    initFilter: function(worker) {
        tabtrekker = require('./main').TabTrekkerMain;

        //don't initialize filter when it isn't to be displayed anywhere
        var filterLocation = simplePrefs.prefs[BACKGROUND_FILTER_LOCATION_PREF];
        if(filterLocation === 'nowhere') {
            utils.emit(tabtrekker.workers, worker, HIDE_FILTER_MSG);
            return;
        }

        logger.log('Initializing filter.');

        var options = {}
        options[BACKGROUND_FILTER_LOCATION_PREF] = filterLocation;
        options[BACKGROUND_FILTER_OPACITY_PREF] = simplePrefs.prefs[BACKGROUND_FILTER_OPACITY_PREF];
        options[BACKGROUND_FILTER_COLOR_PREF] = simplePrefs.prefs[BACKGROUND_FILTER_COLOR_PREF];
        utils.emit(tabtrekker.workers, worker, FILTER_MSG, options);
    }
};

exports.TabTrekkerFilter = TabTrekkerFilter;
