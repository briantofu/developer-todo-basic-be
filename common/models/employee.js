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

    /**
     * Custom credential setup
     * Note: This is not the proper way of doing security
     */
    Employee.observe('before save', function setDefaulPassword(ctx, next) {
        if(ctx.isNewInstance) {
            var employeeInstance = ctx.instance;
            employeeInstance.password = 
                employeeInstance.firstName + "@" + employeeInstance.lastName;

            employeeInstance.username = 
                employeeInstance.firstName + "." + employeeInstance.lastName;
        }    
        next();
    });

    /**
     * Registering custom endpoints (in loopback: remote methods)
     * 
     * see: https://loopback.io/doc/en/lb3/Remote-methods.html
     */
    Employee.login = function(username, password, next) {
       
        Employee.findOne({where: {username: username}}, function (err, principal) {
            if(principal){
                if(password !== principal.password)
                    next(createInvalidUserError());
                else
                    next();
            }else 
                next(createInvalidUserError());
        });
    
    }

    Employee.remoteMethod('login', {
        accepts: [
            {arg: 'username', type: 'string', required: true},
            {arg: 'password', type: 'string', http: {source: 'form'}, required: true}
        ],
        http: {verb: "post", path: "/:username/credential", status: 200}
    });
};


function createInvalidUserError(){
    var definedErr = new Error();
    definedErr.name = "Invalid credentials."
    definedErr.message = "Invalid username or password";
    definedErr.status = 401;
    return definedErr;
}