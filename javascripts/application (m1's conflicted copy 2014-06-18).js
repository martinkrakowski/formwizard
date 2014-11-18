// iCohere Webinar Wizard
// An object literal

var webinarWizard = {
  myProperty: "hello",

  myMethod: function() {
      console.log('webinarWizard.myProperty : ' + webinarWizard.myProperty);
  },
  init: function(settings) {
      webinarWizard.settings = settings;
      // console.log('Load json prerequisites file');
      console.log(settings)
  },
  readSettings: function() {
      console.log( webinarWizard.settings );
  },
  writeSettings: function() {
      console.log( webinarWizard.settings );
  },
  updateSettings: function() {
      console.log( webinarWizard.settings );
  }
};
 
webinarWizard.myProperty === "hello"; // true
webinarWizard.myMethod(); // "hello"
console.log('init: ');
webinarWizard.init({
    foo: "bar"
});
console.log('webinarWizard.readSettings()');
webinarWizard.readSettings(); // { foo: "bar" }





// Wizard listeners

$(function() {
  // Prerequisites Modal Screen
  var prereqModalContainer = $('.masthead.active #prerequisites a#prerequisite-proceed');
  prereqModalContainer.click(function(e) {
    prerequisitesModal();
    e.preventDefault();
  
    // Activate first step
    $('#wizard--existing-webinar a.edit-link').trigger('click');
  });


  // Save and continue functionality
  $('.edit-link, .save-and-continue').click(function() {
    var reviewMode = false;
    var editId = '#' + $(this).attr('data-edit-id'); // data-edit-id="wizard--use-existing-webinar"
    var btnObj = $(this);

    // Place step in edit or saved mode
    $('.wizard-question-content').removeClass('active');
    $('.wizard-question-content .form-content').addClass('saved');
    $(editId).addClass('active');
    $(editId + ' .form-content').removeClass('saved');
    saveContinue(reviewMode, btnObj, editId); // Save + call animation

    var toolStepLabel = $('ul.toolbar.steps li.title');
    if (toolStepLabel.hasClass('hide')) { toolStepLabel.removeClass('hide'); }
    $('a[href="' + editId + '"]').parent('li').removeClass('hide');

  });

  $('#create-webinar').click(function(){
    $('#prerequisites').addClass('hide');
    $('#nextsteps').removeClass('hide');
    $('.masthead.active #prerequisites').fadeOut(function() {
      $('.masthead.active').animate({
        height: '528px' }, 250, // 250ms
        function() { $('.masthead.active').addClass('active'); }); // on complete 
    });
  });

  // Handle jump links
  $('.jumpLink').click(function(){
    var btnObj = $(this);
    var editId = $(this).attr('href');
    saveContinue(true, btnObj, editId); // Save + call animation
  });

  // Fires on submission of each step
  var prevStepActive = $('.wizard-question-content.active').next().addClass('no-divider1'); 

  // Alpha screens (modal windows)
  function prerequisitesModal() {
    $('.masthead.active #prerequisites').fadeOut(function() {
      $('.masthead.active').animate({
        height: 'auto' }, 250, // 250ms
        function() { $('.masthead.active').removeClass('active'); }); // on complete 
    });
  }

  // Scroll Animation
  function saveContinue(reviewMode, btnObj, editId) {
    var scrollSpeed = (btnObj.hasClass('save-and-continue') ? 750 : 750); // Set page scroll speed for when editing and saving
    var pageOffset = (btnObj.hasClass('save-and-continue') ? 80 : 80); // Set page offset when scrolling, after edit and save
    
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
  }


});













/*    if ($(editId).hasClass('last-question') && $(this).hasClass('save-and-review')) {
      $('#save-and-review-modal').foundation('reveal', 'open', { // Reveal modal/save dialog
          url: 'http://some-url',
          success: function(data) {
              alert('modal data loaded');
          },
          error: function() {
              alert('failed loading modal');
          }
      });

      var scrollSpeed = ($(this).hasClass('save-and-continue') ? 25 : 25); // Set page scroll speed for when editing and saving
      $('#top').animate({ scrollTop: 0 }, scrollSpeed);
      reviewMode = true;
      // $('body#top').attr('data-edit-status');
      $('#save-and-review-modal').css({'top': '100px !important'});

      // Save last step, remove form
      $('.wizard-question-content').removeClass('active');
      $('.wizard-question-content .form-content').addClass('saved');
    }*/
