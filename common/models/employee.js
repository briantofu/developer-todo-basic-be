'use strict';

module.exports = function(Employee) {
    Employee.disableRemoteMethodByName('exists');
    Employee.disableRemoteMethodByName('patchOrCreate');
    Employee.disableRemoteMethodByName('createChangeStream');
    Employee.disableRemoteMethodByName('prototype.patchAttributes');
    Employee.disableRemoteMethodByName('updateAll');
    Employee.disableRemoteMethodByName('replaceOrCreate');
    Employee.disableRemoteMethodByName('findOne');
    Employee.disableRemoteMethodByName('upsertWithWhere');

    Employee.disableRemoteMethodByName('prototype.__create__assignedTasks');
    Employee.disableRemoteMethodByName('prototype.__delete__createdTasks');
    Employee.disableRemoteMethodByName('prototype.__delete__assignedTasks');
    Employee.disableRemoteMethodByName('prototype.__destroyById__createdTasks');
    Employee.disableRemoteMethodByName('prototype.__destroyById__assignedTasks');
    Employee.disableRemoteMethodByName('prototype.__updateById__createdTasks');
    Employee.disableRemoteMethodByName('prototype.__updateById__assignedTasks'); 
    Employee.disableRemoteMethodByName('prototype.__findById__createdTasks');
    Employee.disableRemoteMethodByName('prototype.__findById__assignedTasks');

    /**
     * Since there are no enum types in loopback 3 yet
     * we enforce the role set via validation
     * 
     * see more validations here: https://loopback.io/doc/en/lb3/Validating-model-data.html
     */
    Employee.validatesInclusionOf('role', {'in':['Manager','Developer']});

};
