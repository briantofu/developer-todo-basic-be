'use strict';

module.exports = function(Log) {
    Log.disableRemoteMethodByName('exists');
    Log.disableRemoteMethodByName('patchOrCreate');
    Log.disableRemoteMethodByName('createChangeStream');
    Log.disableRemoteMethodByName('prototype.patchAttributes');
    Log.disableRemoteMethodByName('updateAll');
    Log.disableRemoteMethodByName('replaceOrCreate');
    Log.disableRemoteMethodByName('upsertWithWhere');
    Log.disableRemoteMethodByName('create');

    Log.disableRemoteMethodByName('find');
    Log.disableRemoteMethodByName('findById');
    Log.disableRemoteMethodByName('findOne');
    Log.disableRemoteMethodByName('count');

    Log.disableRemoteMethodByName('prototype.__create__task');
    Log.disableRemoteMethodByName('prototype.__get__task');
};
