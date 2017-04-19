/* eslint-env node */
module.exports = {
  description: 'This blueprint will make it able to define storage classes.',
  
  fileMapTokens: function(options){
	  return{
		__StorageModel__: function(options){
			return options.dasherizedModuleName;
		}
	  };
  }

  // locals: function(options) {
  //   // Return custom template variables here.
  //   return {
  //     foo: options.entity.options.foo
  //   };
  // }

  // afterInstall: function(options) {
  //   // Perform extra work here.
  // }
};
