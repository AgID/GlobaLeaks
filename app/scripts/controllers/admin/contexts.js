GLClient.controller('AdminContextsCtrl',
    ['$scope', '$modal', 'Admin', 'DefaultFields',
    function($scope, $modal, Admin, DefaultFields) {

  DefaultFields.get(function(fields) {

    $scope.fields = fields;
    // console.log($scope.fields);

  });


  $scope.save_all = function() {
    angular.forEach($scope.admin.contexts, function(context, key) {
        $scope.update(context);
    });
  }

  $scope.delete = function(context) {
    var idx = _.indexOf($scope.admin.contexts, context);

    context.$delete(function(){
      $scope.admin.contexts.splice(idx, 1);
    });

  };

  $scope.addField = function(context) {
    if (context.fields === undefined) {
      context.fields = [];
    }
    context.fields.push({presentation_order: 0,
                        name: "",
                        hint: "",
                        key: '',
                        value: '',
                        type: 'text',
                        preview: false,
                        required: false});
  }

  $scope.sortableOptions = {
    stop: function(e, ui) {
      $scope.update_contexts_order();
    }
  };

  $scope.reorder_contexts_alphabetically = function() {
    $scope.admin.contexts = _($scope.admin.contexts).sortBy(function(context) {
      return context.name;
    });

    $scope.update_contexts_order();
  }

  $scope.update_contexts_order = function() {
    var i = 0;
    angular.forEach($scope.admin.contexts, function(context, key) {
        context.presentation_order = i + 1;
        i += 1;
    });
  }

  $scope.fieldsSortableOptions = {
    stop: function(e, ui) {
      var i = 0;
      angular.forEach(ui.item.scope().context.fields, function(field, key) {
          field.presentation_order = i + 1;
          i += 1;
      });
    }
  }

  $scope.deleteDialog = function(context){
    var modalInstance = $modal.open({
        templateUrl:  'views/partials/context_delete.html',
        controller: 'ConfirmableDialogCtrl',
        resolve: {
          object: function () {
            return context;
          }
        }

    });

    modalInstance.result.then(
       function(result) { $scope.delete(result); },
       function(result) { }
    );
  };
  
}]);

GLClient.controller('AdminFieldEditorCtrl', ['$scope',
                    function($scope) {

    function tokenize(input) {
      var result = input.replace(/[^-a-zA-Z0-9,&\s]+/ig, '');
      result = result.replace(/-/gi, "_");
      result = result.replace(/\s/gi, "-");
      return result;
    }

    $scope.editing = false;

    if ($scope.field.name === undefined) {
      $scope.editing = true;
    }

    $scope.typeSwitch = function(type) {
      if (_.indexOf(['checkboxes','select','radio'], type) === -1)
        return type;
      return 'multiple';
    }

    $scope.addOption = function(field) {
      if (field.options === undefined) {
        field.options = [];
      }
      field.options.push({order: 0})
    }

    $scope.updateValue = function(option) {
      option.value = tokenize(option.name);
    }

    $scope.deleteField = function(field) {
      var idx = $scope.context.fields.indexOf(field);
      $scope.context.fields.splice(idx, 1);
    }

}]);

GLClient.controller('AdminContextsEditorCtrl', ['$scope',
  function($scope) {

    $scope.editing = false;

    if ($scope.context.description === undefined) {
      $scope.editing = true;
    }

    $scope.toggleEditing = function() {
      $scope.editing = $scope.editing ^ 1;
    }

    $scope.isSelected = function(receiver) {
      if ($scope.context.receivers.indexOf(receiver.receiver_gus) !== -1) {
        return true;
      } else {
        return false;
      }
    }

    $scope.toggle = function(receiver) {
      var idx = $scope.context.receivers.indexOf(receiver.receiver_gus);
      $scope.contextForm.$dirty = true;
      $scope.contextForm.$pristine = false;
      if (idx === -1) {
        $scope.context.receivers.push(receiver.receiver_gus);
      } else {
        $scope.context.receivers.splice(idx, 1);
      }
    }

}]);
