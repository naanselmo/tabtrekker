'use strict';

/**
 * Utils module.
 */
var TabTrekkerUtils = {

    loaded: true,

    /**
     * Receive messages from addon.
     */
    receiveMessage: function(cb) {
        return function(payload) {
            // Only accept the message if the page is loaded (this fixes issues
            // where a message is received right before the page is unloaded)
            if (TabTrekkerUtils.loaded) {
                cb(payload);
            }
        };
    },

    /**
     * Converts colors in Hexadecimal code into RGB code
     * Writen by Tim Down @ StackOverflow
     */
    hexToRGB: function(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
};

//called on document ready
$(function() {
    //listen to window events
    $(window).on('beforeunload', function() {
        TabTrekkerUtils.loaded = false;
    });
});
