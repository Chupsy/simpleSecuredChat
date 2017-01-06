/*@ngInject*/
module.exports = function (user) {
  var vm = this;
  vm.generateRSA = function(){
    if(vm.dataToGenerate){
      user.RSA.generate(vm.dataToGenerate);
    }
  }
};
