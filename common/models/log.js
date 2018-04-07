'use strict';

module.exports = function(Log) {
    Log.disableRemoteMethodByName('create');
    Log.disableRemoteMethodByName('exists');
    Log.disableRemoteMethodByName('patchOrCreate');
    Log.disableRemoteMethodByName('createChangeStream');
    Log.disableRemoteMethodByName('prototype.patchAttributes');
    Log.disableRemoteMethodByName('updateAll');
    Log.disableRemoteMethodByName('replaceOrCreate');
    Log.disableRemoteMethodByName('upsertWithWhere');
    Log.disableRemoteMethodByName('find');
    Log.disableRemoteMethodByName('findById');
    Log.disableRemoteMethodByName('findOne');
    Log.disableRemoteMethodByName('count');

    Log.disableRemoteMethodByName('prototype.__create__task');
    Log.disableRemoteMethodByName('prototype.__get__task');

    /**
     * Update Task status if still on queue
     */
    Log.observe('after save', function updateStatus(ctx, next) {
        var taskId = ctx.instance.taskId;

        Log.app.models.Task.findById(taskId, function(err, referredTask){
            if(referredTask && 'ON QUEUE' == referredTask.status){
                referredTask.updateAttributes({status: 'IN PROGRESS'}, function(err, instance){
                    if(err) {
                        next(wrapInternalError(ctx.instance.id, err));
                    } else {
                        console.log('Task '+taskId+' has been set to '+instance.status+' err?: '+err);
                        next();
                    }    
                })
            }else next();
        });
    });

};

function wrapInternalError(triggeringLog, owningTaskErr){
    var definedErr = new Error();
    definedErr.name = "Invalid owning task."
    definedErr.message = "Task to which log "+triggeringLog+" is attached has has errors. "+
    "Details are: "+owningTaskErr.message;
    definedErr.status = 500;
    return definedErr;
}
