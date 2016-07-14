'use strict';

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
     * Displays weather information on the page.
     */
    displayTodo: function(data) {
        if(!data) {
            return;
        }

        //load stored todo list
        var todoList = TabTrekkerUtils.retrieveLocalStorage('todo_list');

        if (todoList !== null) {
            $('#todo_list').html(todoList);
        }

        TabTrekkerTodo.setTodoVisibility(data[SHOW_TODO_PREF]);
        TabTrekkerTodo.setInputHoverHandler();
        TabTrekkerTodo.setInputFocusHandler();
        TabTrekkerTodo.setInputSubmitHandler();
    },

    /**
     * Handles an event by sending a message of the event to the addon.
     */
    handleEvent: function(message, event) {
        self.port.emit(message);
        event.stopPropagation();
        event.preventDefault();
    },

    /**
     * Set todo input hover handler.
     */
    setInputHoverHandler: function() {
        $('#todo_input').hover(function() {
            $('#todo_add').addClass('hover');
        }, function() {
            $('#todo_add').removeClass('hover');
        });
    },

    /**
     * Set todo input focus handler.
     */
    setInputFocusHandler: function() {
        $('#todo_input').focusin(function() {
            $('#todo_form').addClass('focus');
            $('#todo_add').addClass('focus');
            $('#todo_input').addClass('focus');
        }).focusout(function() {
            $('#todo_form').removeClass('focus');
            $('#todo_add').removeClass('focus');
            $('#todo_input').removeClass('focus');
        });
    },

    setInputSubmitHandler: function() {
        $('#todo_form').submit(function(event) {
            TabTrekkerTodo.handleEvent(SUBMITTED_MSG, event);
        });
    },

    /**
     * Adds a new todo item to the list
     */
    addTodo: function() {
        var object = $('#todo_sample');
        var text = $('#todo_input').val();

        //create new todo item with the given text
        object.find('#todo_task').text(text);

        //set todo events
        object.find('#todo_remove').click(function(event) {
            TabTrekkerTodo.handleEvent(REMOVED_MSG, event);
        });
        object.find('#todo_text').click(function(event) {
            TabTrekkerTodo.handleEvent(CLICKED_MSG, event);
        });

        //empty the input
        $('#todo_input').val('');

        //save new list
        TabTrekkerUtils.saveLocalStorage('todo_list', $('#todo_list').html());
    },

    /**
     * Removes a todo item from the list
     */
    removeTodo: function(data) {
        if(!data) {
            return;
        }

        //remove the id and save the new list
        data.target.parent.remove();
        TabTrekkerUtils.saveLocalStorage('todo_list', $('#todo_list').html());
    },

    /**
     * Marks a todo item as completed, or unmarks it
     */
    clickTodo: function(data) {
        if(!data) {
            return;
        }

        //get the parent and then search beneath it to find the task text
        if (data.target.parent != $('#todo_list')) {
            data.target.parent.find('#todo_task').toggleClass('strikethrough');
        } else {
            data.target.find('#todo_task').toggleClass('strikethrough');
        }

    },

    /**
     * Sets visibility of the todo list based on user preferences.
     */
    setTodoVisibility: function(visibilityPref) {
        switch(visibilityPref) {
            case 'always':
                $('#todo_container').css('display', 'block');
                $('#todo_container .hover_item').css('opacity', 1);
                break;
            case 'hover':
                $('#todo_container').css('display', 'block');
                break;
            case 'never':
                TabTrekkerTodo.hideTodo();
                break;
        }
    },

    /**
     * Hides the todo list.
     */
    hideTodo: function() {
        $('#todo_container').css('display', 'none');
    }
};

//listen for messages
self.port.on(HIDE_TODO_MSG, TabTrekkerUtils.receiveMessage(TabTrekkerTodo.hideTodo));
self.port.on(TODO_MSG, TabTrekkerUtils.receiveMessage(TabTrekkerTodo.displayTodo));
self.port.on(SUBMITTED_MSG, TabTrekkerUtils.receiveMessage(TabTrekkerTodo.addTodo));
self.port.on(REMOVED_MSG, TabTrekkerUtils.receiveMessage(TabTrekkerTodo.removeTodo));
self.port.on(CLICKED_MSG, TabTrekkerUtils.receiveMessage(TabTrekkerTodo.clickTodo));
