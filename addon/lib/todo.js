'use strict';

/* SDK Modules */
const simplePrefs = require('sdk/simple-prefs');

/* Modules */
const logger = require('./logger').TabTrekkerLogger;
const utils = require('./utils').TabTrekkerUtils;
var tabtrekker; //load on initialization to ensure main module is loaded

/* Constants */
//messages
const HIDE_TODO_MSG = 'hide_todo';
const TODO_MSG = 'todo';
const REMOVED_MSG = 'removed';
const CLICKED_MSG = 'clicked';
const SUBMITTED_MSG = 'submited';
//preferences
const SHOW_TODO_PREF = 'show_todo';

/**
 * Todo module.
 */
var TabTrekkerTodo = {

    /**
     * Initializes todo by sending todo options to the content scripts.
     */
    initTodo: function(worker) {
        tabtrekker = require('./main').TabTrekkerMain;

        //don't initialize todo when it isn't to be displayed anywhere
        var showTodo = simplePrefs.prefs[SHOW_TODO_PREF];
        if(showTodo === 'never') {
            utils.emit(tabtrekker.workers, worker, HIDE_TODO_MSG);
            return;
        }

        logger.log('Initializing todo.');

        var options = {}
        options[SHOW_TODO_PREF] = showTodo;
        utils.emit(tabtrekker.workers, worker, TODO_MSG, options);

        TabTrekkerTodo.attachListeners(worker);
    },

    /**
     * Attaches listeners to listen for events.
     */
    attachListeners: function(worker) {
        logger.log('Attaching todo listeners.');
        worker.port.on(SUBMITTED_MSG, TabTrekkerUtils.receiveMessage(TabTrekkerTodo.addTodo));
        worker.port.on(REMOVED_MSG, TabTrekkerUtils.receiveMessage(TabTrekkerTodo.removeTodo));
        worker.port.on(CLICKED_MSG, TabTrekkerUtils.receiveMessage(TabTrekkerTodo.clickTodo));
    }
};

exports.TabTrekkerTodo = TabTrekkerTodo;
