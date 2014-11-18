/*
 * iCohere Webinar Wizard
 *
 */

var webinarWizard = {
  // Specify elements for event listeners
  // Events are setup within init()

  listenableFields: $('.listenableField'),  // Form field elements that toggle additional functionality
  stepSubmitButtons: $('.edit-link, .save-and-continue, .previous-step'),  // Step Submit, back, and edit buttons
  jumpLinks: $('.jumpLink'), // Jump links, Scroll to link (href='#id')
  saveContinueButtons: $('a.save-and-continue'),
  createWebinarBtn: $('#create-webinar'),

  getSettingsJSON: function() {
    // Ajax call to grab configured options
    
    var prereqOptions = // Placeholder JSON object
      { "prerequisites": [
        { "module": "meetings",     "submodule": "false", "status": "enabled" },
        { "module": "registration", "submodule": "false", "status": "enabled" },
        { "module": "fees",         "submodule": "false", "status": "enabled" },
        { "module": "assessment",   "submodule": "false", "status": "enabled" },
        { "module": "tests",        "submodule": "true",  "status": "enabled" },
        { "module": "certificate",  "submodule": "true",  "status": "enabled" }
      ]};
      return prereqOptions;
  },

  formToJSON: function(reviewMode, btnObj, editId) {
    
    /* Convert each form step submission to JSON
     * Used by writeSettings()
     * Used to by updateSummary()
     */

    /* serializeArray() method creates a JavaScript array of form elements, ready to be encoded as a JSON string. 
     * Creates { 'name' : 'value' } pair, where name is the name attribute on an input field.
     */

    var currentStep = $(btnObj).closest('form'); // Get current step
    var currentStepFields = currentStep.serializeArray();
    // console.log(currentStepFields);
    return currentStepFields;
  },

  jsonToForm: function(reviewMode, btnObj, editId) {
    // Get JSON obj and convert to form field value
    // $.getJSON('url_to_file', function(data) {
    //   for (var i in data) {
    //     $('input[name="' + i + '"]').val(data[i]);
    //   } 
    // });


    var fooFields = [];  // Test Array for populating for fields
    for (var i = 0; i < 10; i++) {
      var field = { "name": "webinar-title", "value": "My Webinar test title" }; // Create entry
      fooFields.push(field); // add entry to array
    }

    // console.log(fooFields);

  },

  getEnabledModules: function(saveContinueButton) {

    /* userModules[i].module: "registration"
     * userModules[i].status: false
     */

    var userModules = [];  // Array of user enabled (prerequisites screen) modules, checkbox : true
    
    $('.wizard--prerequisites-include-module').each(function(index) { // Loop through each configured option
      var module = $(this).closest('li').attr('data-prerequisites-module'); // Get value of attribute (e.g. <li data-prerequisites-module="meetings">)
      var userSelected = $(this).prop('checked');  // true or false
      var userModule = { "module": module, "status": userSelected }; // Create entry
      userModules.push(userModule); // add entry to array
    });
    return userModules;
  },

  getObjects: function(obj, key, val) {
    // Search for a value within a JSON object
    // example, where 'status' is 'true'

      var objects = [];
      for (var i in obj) {
          if (!obj.hasOwnProperty(i)) continue;
          if (typeof obj[i] == 'object') {
              objects = objects.concat(getObjects(obj[i], key, val));
          } else if (i == key && obj[key] == val) {
              objects.push(obj);
          }
      }
      return objects;
  },

  setupQuestions: function(userModules, saveContinueButtons) {

    /* Disable questions that have not been "enabled/selected" by the user in getEnabledModules [checkbox : false]
     * Remove disabled questions from DOM
     * Rebuild jumpLinks (Go to step navigation)
     * Set up save-and-continue button with correct 'data-edit-id' attribute
     */

    var wizardQuestionContent = $('.wizard-question-content');
    wizardQuestionContent.each(function(index) { // Loop through each of the question nodes 
      try {

          /* Loop through userModules (holds prerequisite screen checkbox choices)
           * find the next enabled question (status = true) &
           * Get the 'data-edit-id' attribute that for that question
           * If this question is enabled, set the 'data-edit-id' attribute of this container's 
           * save-and-continue button to the next user 'enabled' question
           * else disable, remove and go to the next question
           */

        var saveButton = wizardQuestionContent.find('a.save-and-continue');
        for (var i = 0; i < userModules.length; i++) {

          /* Match correct userModules[i].module with .wizard-question-content
           * get status, true / false
           * With the current question set, only registration and assessments
           * will create a match
           */

          var stepIndex = 'wizard--webinar-' + userModules[i].module;  // Step id
          // [this] refers to wizardQuestionContent.each

          if (this.id == stepIndex) {
            // console.log('this: ' + this.id + ' -- stepIndex: ' + stepIndex + ' -- enabled: ' + userModules[i].status);
            if (userModules[i].status) { // true
              this.addClass('selected');
            } else { // status is false

              // Use getObjects method to return all modules that have status true
              // then find the next status true module after the current one
              // Set the value of its ID to the data-edit-id attribute of the save-and-continue button
              // of the last enabled steps button

              // var nextEnabledStep = webinarWizard.getObjects(userModules, 'status', 'true'); // Returns an array of matching objects
              // console.log('test');
              // console.log(nextEnabledStep);
              //this.remove(); // remove this node from the (DOM) list of questions
            }
          }


          // data-edit-id="wizard--webinar-review"
          // $('')

          var jumpLink = $('.toolbar.steps a[href*=' + userModules[i].module); // Setup toolbar jump links
          webinarWizard.updateJumpLinkCount(jumpLink); // Navigation, Update jump link numbering
          // currentModule.remove();
          // nextModule.find()
        }

        // saveButton.attr('data-edit-id', saveContinueButtons[index].attributes[2].value);
      }
      catch(err) {} //console.log(err.message);
      $(this).find('.question-number').text(index-1); // Update step numbers within question panels (left)
    });

  },

  updateJumpLinkCount: function(jumpLink) {
    // var jumpLink = $(jumpLink);
    var toolbarSteps = $('ul.toolbar.steps li');

    // var newIndex = toolbarSteps.indexOf(jIndex);
    // if (toolbarSteps > -1) { toolbarSteps.splice(newIndex, 1); } // remove step from array
    // console.log('index ' + jumpLink.index());

    jumpLink.remove(); // remove link to the unselected step
    toolbarSteps.each(function(index) {
      if (toolbarSteps[index].classList[0] == 'nav') {
        $(this).find('a.jumpLink span.number').text(index); // Rebuild step count using new index
      }
    });
  },

  updatePrerequisites: function(prerequisiteOptions, saveContinueButtons) {
    // Retrieve configured options
    // Disable proceed button if meetings are not enabled
    if (prerequisiteOptions.prerequisites[0].status == 'disabled') {
      $('a#prerequisite-proceed').unbind('click').css('background-color','red').text('Cannot Proceed');  // Prevent user from starting wizard
    } else {
      // Prerequisites Modal Screen
      var prereqModalProceed = $('.masthead.active #prerequisites a#prerequisite-proceed');
      prereqModalProceed.click(function(e) {
        webinarWizard.prerequisitesModal();
        e.preventDefault();

        var userModules = webinarWizard.getEnabledModules(); // Retrieve (& set) user selected modules, checkbox : true
        webinarWizard.setupQuestions(userModules, saveContinueButtons);  // Setup webinar questions based on user selected modules

        // Activate first step
        $('#wizard--existing-webinar a.edit-link').trigger('click');
        webinarWizard.saveContinue(false, $(this), '#wizard--existing-webinar'); // reviewMode, btnObj, editId
      });
    }

    $(prerequisiteOptions.prerequisites).each(function() {
      // Display configured options (based json data)
      var module = $('ul.prerequisite-data-required li[data-prerequisites-module="'+ this.module +'"]');  // Get DOM element for this module
      module.find('> div.'+ this.status).show(); // find (enable|disable) div and show it
    });
  },

  updateSummary: function(stepData, reviewMode, btnObj, editId) {  // Update summary text with user choices
    var currentStep = $(btnObj).closest('form');                   // Get current step
    for (var i = 0; i < stepData.length; i++) {                    // Locate summary label field and update it with form data
      // console.log(stepData[i].name + ' : ' + stepData[i].value);
      currentStep.find('.summary-saved-data span[data-summary-field="'+ stepData[i].name +'"]').text(stepData[i].value);
    }
  },

  saveContinue: function(reviewMode, btnObj, editId) {
    var stepData = webinarWizard.formToJSON(reviewMode, btnObj, editId); // Get step data
    webinarWizard.updateSummary(stepData, reviewMode, btnObj, editId);   // Update summary
    webinarWizard.writeSettings(stepData, reviewMode, btnObj, editId);   // Save to server
    webinarWizard.setTimestamp();   // Get timestamp

    // Place current step in 'edit' or 'saved' mode
    $('.wizard-question-content').removeClass('active');  // Ensure no other steps are being edited by removing the active class from all steps, place in summary mode
    $('.wizard-question-content .form-content').addClass('saved');  // Add saved class to all steps, place in summary mode

    if (!$(editId).length > 0) {} // Check if question exists

    $(editId).addClass('active'); // Add .active to the step container
    $(editId + ' .form-content').removeClass('saved'); // Remove .saved from the step container
    if (!reviewMode) {
      webinarWizard.saveContinueAnimation(reviewMode, btnObj, editId); // Save + call animation
    }
    var toolStepLabel = $('ul.toolbar.steps li.title');
    if (toolStepLabel.hasClass('hide')) { toolStepLabel.removeClass('hide'); }
    $('a[href="' + editId + '"]').parent('li').addClass('active');

    var prevStepActive = $('.wizard-question-content.active').next().addClass('no-divider1'); // Visual. Hide step divider on previous step.  Fires on submission of each step
  },

  saveContinueAnimation: function(reviewMode, btnObj, editId) {
    // Scroll animation functionality
    var scrollSpeed = (btnObj.hasClass('save-and-continue') ? 350 : 750); // Set page scroll speed for when editing and saving
    var pageOffset = (btnObj.hasClass('save-and-continue') ? 80 : 80);    // Set page offset when scrolling, after edit and save
    
    // Review mode is when all form questions are in summary format
    if (!reviewMode) {
      $(editId).removeClass('unanswered');
      $('#top').animate({
          scrollTop: $(editId).offset().top - pageOffset
      }, scrollSpeed);
    } else {
      $('#top').animate({
          scrollTop: $(editId).offset().top - pageOffset
      }, scrollSpeed);
    }
  },

  writeSettings: function(stepData, reviewMode, btnObj, editId) {
    // console.log(stepData);
    // Save stepData to server
  },

  setTimestamp: function() { 
    $('ul.toolbar li.save-and-exit a.save-progress span.autosave').text(Date()); // Update the 'Continue Later' button timestamp copy
  },

  prerequisitesModal: function() {
    // Alpha screens (modal windows)
    $('.masthead.active #prerequisites').fadeOut(function() {
      $('.masthead.active').animate({
        height: 'auto' }, 250, // 250ms
        function() { $('.masthead.active').removeClass('active'); }); // on complete 
    });
  },

  listenableField: function(fieldObj, event) {

      /* Radio listenable type
       * All optional fields are hidden by default
       * Form fields within hidden containers will be disabled, and not included in the formToJSON method
       * 
       * Handles (2) different types of radio selections (user choices)
       * -1. Basic, show/hide for a single container based on radio yes/no
       * -2. Toggle option types, If yes, then show option 1, and hide option 2
       *     If no, then show option 2, and hide option 1
       */     

    var dataListenableField = fieldObj.attr('data-listenable-field');          // container that this field is linked to
    var dataListenableType = fieldObj.attr('data-listenable-field-type');      // type of listenable (radio, checkbox, link)
    var fieldContainer = $('#' + dataListenableField);                         // define the field container
    var fieldContainerInputs = $('#' + dataListenableField + ' :input');       // define fieldContainer inputs
    var field_YES_SubContainer = $('#' + dataListenableField + ' > div.yes');  // define 'yes' subcontainer
    var field_NO_SubContainer = $('#' + dataListenableField + ' > div.no');    // define 'no' subcontainer
    var field_YES_inputs = $('#' + dataListenableField + ' > div.yes :input'); // define 'yes' subcontainer form fields
    var field_NO_inputs = $('#' + dataListenableField + ' > div.no :input');   // define 'no' subcontainer form fields

    if (dataListenableType == 'radio') {
      var fieldValue = fieldObj.attr('value'); // Handle radio buttons as hide|reveal triggers

      if (fieldContainer.hasClass('doYesno') && fieldValue == 'yes') { // Handle container with 'yes' subcontainer (option 2)
        if (fieldContainer.has('div.yes')) {  
          field_YES_SubContainer.removeClass('hide');  // reveal 'yes' subcontainer
          field_NO_SubContainer.addClass('hide');      // hide 'no' subcontainer
          field_NO_inputs.attr('disabled', true);      // disable form fields within hidden container
          field_YES_inputs.attr('disabled', false);    // enable form fields within revealed container
        }
      } else if (fieldContainer.hasClass('doYesno') && fieldValue == 'no') { // handle container with 'no' subcontainer (option 2)
        if (fieldContainer.has('div.no')) {          
          field_NO_SubContainer.removeClass('hide'); // reveal 'no' subcontainer
          field_YES_SubContainer.addClass('hide');   // hide 'yes' subcontainer
          field_YES_inputs.attr('disabled', true);   // disable form fields within hidden container
          field_NO_inputs.attr('disabled', false);   // enable form fields within revealed container
        }
      } else {
        if (fieldContainer.hasClass('hide') && fieldValue == 'yes') {
          // Enable form element and display container
          fieldContainer.removeClass('hide');           // reveal container
          fieldContainerInputs.attr('disabled', false); // enable form fields within revealed container

        } else if (!fieldContainer.hasClass('hide') && fieldValue == 'no') {
          fieldContainer.addClass('hide');             // hide container
          fieldContainerInputs.attr('disabled', true); // disable form fields within hidden container
        }
      }
    } else if (dataListenableType == 'link') {        // Handle links as hide|reveal triggers
      if (fieldContainer.hasClass('hide')) {
        fieldContainer.removeClass('hide');           // Enable form element and display container
        fieldContainerInputs.attr('disabled', false); // Enable form fields within revealed container
      } else {
        fieldContainer.addClass('hide');             // Enable form element and display container
        fieldContainerInputs.attr('disabled', true); // Disable form fields within hidden container
      }
    }
  },

  init: function(prerequisiteOptions, settings, dataListenableField, listenableFields) {

    var prerequisiteOptions = webinarWizard.getSettingsJSON();

    // Initialize webinarWizard
    webinarWizard.updatePrerequisites(prerequisiteOptions, webinarWizard.saveContinueButtons);  // Retrieve enabled options

    // Dynamic form field listener
    webinarWizard.listenableFields.click(function(event) {
      var fieldObj = $(this, event); // Form field element
      webinarWizard.listenableField(fieldObj); // Handle toggle-able form fields
    });

    // Save and continue functionality
    webinarWizard.stepSubmitButtons.click(function() {
      var reviewMode = false; // Do not trigger edit mode on go-to step
      var editId = '#' + $(this).attr('data-edit-id'); // Destination, data-edit-id="wizard--use-existing-webinar"
      var btnObj = $(this);  // Clicked element
      var doStep = ($(this).hasClass('edit-link') ? webinarWizard.saveContinue(reviewMode, btnObj, editId) : webinarWizard.saveContinue(reviewMode, btnObj, editId));
    });

    // Handle jump links
    webinarWizard.jumpLinks.click(function(){
      var btnObj = $(this); // Clicked element
      var editId = $(this).attr('href'); // Destination
      webinarWizard.saveContinueAnimation(true, btnObj, editId); // Call scroll animation
    });

    this.createWebinarBtn.click(function() {
      $('#prerequisites').addClass('hide');
      $('#nextsteps').removeClass('hide');
      $('.masthead').addClass('active');
      $('ul.toolbar.steps').hide();
      $('body').css({ overflow: 'hidden'});
    });

  } // init
};

// load wizard
$(function() { webinarWizard.init(); });

