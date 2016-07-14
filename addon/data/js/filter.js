'use strict';

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
     * Shows the filter
     */

    showFilter: function(data) {
        if(!data) {
            return;
        }

        var location = data[BACKGROUND_FILTER_LOCATION_PREF];
        var opacity = data[BACKGROUND_FILTER_OPACITY_PREF];
        var color = data[BACKGROUND_FILTER_COLOR_PREF];

        switch(location) {
            case 'background_image':
                var selector = $('#background_filter');
                TabTrekkerFilter.applyFilter(selector, opacity, color);
                break;
            case 'behind_text':
                var selector = $('.hover_item');
                TabTrekkerFilter.applyFilter(selector, opacity, color);
                break;
        }

    },

    /**
     * Hides the filter
     */

    hideFilter: function(data) {
        if(!data) {
            return;
        }

        var location = data[BACKGROUND_FILTER_LOCATION_PREF];

        switch(location) {
            case 'background_image':
                var selector = $('#background_filter');
                TabTrekkerFilter.removeFilter(selector);
                break;
            case 'behind_text':
                var selector = $('.hover_item');
                TabTrekkerFilter.removeFilter(selector);
                break;
        }
    },

    /**
     * Applies the filter to a given selector.
     */
    applyFilter: function(selector, opacity, color) {
        var rgb = TabTrekkerUtils.hexToRGB(color);
        selector.css('background-color', 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + String(opacity/100) + ')');
        selector.css('box-shadow', '0px 0px 5px 10px rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + String(opacity/100) + ')');
    },

    /**
     * Removes the filter to a given selector.
     */
    removeFilter: function(selector) {
        selector.css('background-color', 'transparent');
        selector.css('box-shadow', 'none');
    }

};

//listen for messages
self.port.on(FILTER_MSG, TabTrekkerUtils.receiveMessage(TabTrekkerFilter.showFilter));
self.port.on(HIDE_FILTER_MSG, TabTrekkerUtils.receiveMessage(TabTrekkerFilter.hideFilter));
