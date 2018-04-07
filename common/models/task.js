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

    Task.disableRemoteMethodByName('prototype.__create__logs');
    Task.disableRemoteMethodByName('prototype.__delete__logs');
    Task.disableRemoteMethodByName('prototype.__destroyById__logs');
    Task.disableRemoteMethodByName('prototype.__updateById__logs');
    Task.disableRemoteMethodByName('prototype.__findById__logs');

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
            console.log('assigneeId: '+assigneeId+", exists: "+exists)
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

