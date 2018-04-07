'use strict';

module.exports = function(Task) {
    Task.disableRemoteMethodByName('create');
    Task.disableRemoteMethodByName('exists');
    Task.disableRemoteMethodByName('patchOrCreate');
    Task.disableRemoteMethodByName('createChangeStream');
    Task.disableRemoteMethodByName('prototype.patchAttributes');
    Task.disableRemoteMethodByName('updateAll');
    Task.disableRemoteMethodByName('replaceOrCreate');
    Task.disableRemoteMethodByName('findOne');
    Task.disableRemoteMethodByName('upsertWithWhere');

    Task.disableRemoteMethodByName('prototype.__delete__logs');
    Task.disableRemoteMethodByName('prototype.__destroyById__logs');
    Task.disableRemoteMethodByName('prototype.__updateById__logs');
    Task.disableRemoteMethodByName('prototype.__findById__logs');

    /**
     * To control how read only values are set programmatically
     * we can use operation hooks:
     * 
     * https://loopback.io/doc/en/lb3/Operation-hooks.html
     */
    Task.observe('before save', function updateStatus(ctx, next) {
        if(ctx.isNewInstance) ctx.instance.status = 'ON QUEUE';
        next();
    });


    /**
     * Registering custom endpoints (in loopback: remote methods)
     * 
     * see: https://loopback.io/doc/en/lb3/Remote-methods.html
     */
    Task.markAsDone = function(taskId, next) {
       
        Task.findById(taskId, function (err, task) {
            if(task && 'IN PROGRESS' == task.status){
                task.updateAttributes({status: 'DONE'}, function(err, updatedTask){
                     console.log('Marking task ' + updatedTask.id+' as done')
                    if(err) 
                        next(wrapInternalError(updatedTask.id, err));
                    else 
                        next();
                       
                })
            }else next();
        });
    
    }

    Task.remoteMethod('markAsDone', {
        accepts: {arg: 'id', type: 'number', required: true},
        http: {verb: "post", path: "/:id/done", status: 201}
    });

    /**
     * To create custom validations use 
     * either Model.validate or Model.validateAsync
     * Read more here: https://apidocs.strongloop.com/loopback-datasource-juggler/#validatable
     */
    Task.validateAsync('assignee', isExistingEmployee, {
        message: 'Employee not found', allowNull: true
    });

    Task.validateAsync('assignee', isValidEmployee, {
        message: 'Can only be assigned to a developer', allowNull: true
    });

    /**
     * 
     * app.model.Employee
     * 
     * 'app' can be obtained from model once it's attached
     * see https://loopback.io/doc/en/lb3/Working-with-LoopBack-objects.html
     * 
     * @param {*} errFn - function
     * @param {*} next - function
     */
    function isExistingEmployee(errFn, next){
        var assigneeId = this.assignee;

        Task.app.models.Employee.exists(assigneeId, function (err, exists) {
            if (!exists) errFn();
            next();
        });
    }

    function isValidEmployee(errFn, next){
        var assigneeId = this.assignee;

        Task.app.models.Employee.findById(assigneeId, function (err, employee) {
            if (employee && 'Developer' !== employee.role) errFn();
            next();
        });
    }
};

function wrapInternalError(triggeringLog, owningTaskErr){
    var definedErr = new Error();
    definedErr.name = "Invalid owning task."
    definedErr.message = "Task to which log "+triggeringLog+" is attached has has errors. "+
    "Details are: "+owningTaskErr.message;
    definedErr.status = 500;
    return definedErr;
}


