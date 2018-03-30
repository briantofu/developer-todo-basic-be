'use strict';

module.exports = function(Task) {
    Task.disableRemoteMethodByName('prototype.__task__create');
};
