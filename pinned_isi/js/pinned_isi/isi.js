/*
  Pinned ISI Module
  Author: Jeremy Skjevling
  Useage: This module is meant as a plug-and-play solution to all pinned ISI needs.
          It loads the ISI text/markup from a separate file, and generates the pinned
          ISI based on window size using specified breakpoints.

          -------------------------------------------------------------------------------------------

          Useage Instructions - 

          There are a few elements that need to be inserted into your page markup for the code
          to work correctly.  Since the ISI is generally the last content on the page before the
          footer, we include the footer into the isi.html to ensure it is always displayed properly.

          The page itself needs three main things:

          1. A div with an ID of "page-content" wrapping the block of content you would like to scroll
             above the ISI.  This should include all content on the page preceding the ISI/Footer content.

          2. A div with an id of your choosing following the main page content where you would like the
             ISI content to load in.  The ID of this div, or a reference to it in the form of a variable
             must be passed as part of the isiOptions object to ensure proper functionality.

          3. Two script tags at the end of the document (they should be the last thing to load in on the 
             page) the first of which can either be a variable declaration for the isiOptions object with
             properties set directly, or a link to a file containing the same.  This allows for the
             flexibility of using a single set of options for an entire website, or setting different
             options on a per-page basis.  The second tag should be a reference to this file.

          ------------------------------------------------------------------------------------------

          Options -

          The module supports the following options to be set via the isiOptions object, which must be
          instantiated BEFORE this javascript file is loaded into the page:

          1. wrapper: - this is a reference to the containing element (usually a div) in the form of 
                        the id or class name (as a string with the appropriate selector character,
                        '#id' or '.class', respectively, or a variable containing a reference to the 
                        element)

          2. mobileIndication: - for layouts with a stacked Indications section in mobile sizes, this
                        property holds a reference to the element. The reference can be passed as a
                        selector ('#id' or '.class') or a variable containing an element reference

          3. mainIndication: - for layouts with a stacked Indications section in mobile sizes, this
                        property holds a reference to the regular desktop Indications element. The 
                        reference can be passed as a selector ('#id' or '.class') or a variable 
                        containing an element reference

          4. isiBtn: -  for all layouts, this holds the main button for expanding the entire ISI. In
                        the stacked mobile view (if enabled), this button expands only the ISI portion
                        of the view, leaving the indications collapsed.  As always, the reference is
                        passed via selector or variable.

          5. indBtn: -  in the stacked mobile view, this button expands only the indications portion 
                        of the display. As always, the reference here is passed via selector or variable

          6. filePath: - the path to the isi.html file (this should include the file name of the file to 
                        load, along with containing path relative to the location that this javascript file
                        is being loaded into.

          7. breakpoints: - since we sometimes need styling to be applied programmatically as the pinned
                        content changes state, this option supports multiple breakpoints with associated
                        styling.  The one requirement is that none of the min/max width dimensions overlap
                        as that will cause the current breakpoint calculation to return the first match,
                        possibly yeilding unexpected results.

              name: {   this is the name of the breakpoint. It is recommended that the breakpoint names 
                        be clearly descriptive.  Names cannot begin with a number.
                  
                  maxWidth: - the maximum width for which the breakpoint should apply. If only one style
                        is being used, setting this to a number larger than any screen's possible resolution
                        (ie. 999999) will ensure all upper limites are covered.  At least one breakpoint
                        should cover this upper limit with its settings.  The maxWidth for successive
                        breakpoints should always be one less than the minWidth of the previous highest
                        breakpoint as you work your way down.

                  minWidth: - similar to maxWidth, but covers the minimum viewport width for the breakpoint.
                        if only one breakpoint is used, this should be set to 0.  At least one breakpoint
                        should cover the range down to the smallest viewport you expect to encouter (0 may
                        be safer if the smallest size is unknown)

                  mobileStacking: - this controls whether or not the mobile indication is stacked above the
                        ISI for the breakpoint in question.  This can also be controlled via CSS, but setting
                        it here will ensure visibility is in synch with all other stlying for the breakpoint
                        sizes and is applied at the same time.

                  pinned: - these styles apply to the ISI in its pinned state. At minimum you should apply
                        a top height (% or px heights accepted currently) and position: fixed.

                      isi: - the related styles for the isi block.  These are applied to the element specified
                             in the wrapper property.  Format is property: "value", multiple values must be
                             separated by commas.

                             example -
                                 backgroundColor: "#BADA55",
                                 top: "33%",
                                 position: "fixed"

                      expandBtn: - styles for both the ISI and Indications expand buttons for the related state.
                             Currently both buttons are handled jointly as it is unlikely that different styles
                             are needed for each.

                      expandText: - the text to display in the expand buttons when the ISI is retracted (pinned)
                             for the related state. If the button should not be visible, set this to the empty string.

                      retractText: - the text to display in the expand buttons when the ISI/Indication is expanded
                             for the related state. If the button should not be visible, set this to the empty string.

                      customStyles: { - for styles that are not covered by applying styling to the isi wrapper or
                             expand buttons, this option allows styling to be set via query selector.
  
                          element: { - for each element that needs styling applied, a separate element object should
                             be created.
  
                              selector: - the selector (in the form of a string) for the element to receive styling

                              styles: - the styles to be applied to the element. Format is property: "value", multiple
                                        values should be separated by commas.

                                        example -
                                           backgroundColor: "#BADA55",
                                           top: "33%"
                          }
                      }

                  expanded: - same as pinned above, but applied when the ISI or Indication is in the expanded state.

                  flow: - same as pinned and expanded above, but applied when the ISI has dropped back into the 
                          document flow
              }

          8. callback: - A callback function that will be called once the ISI load has completed and the ISI is built
                         and initialized.  The call to this function occurs just before the very first checkPos
                         operation that checks the visibility within the viewport of the ISI to determine whether 
                         or not it should be pinned or flowed, so content is not yet pinned when this callback fires.

          9. expandIndicator: { - Currently unsupported, future support for expand button images
  
                expandImg: -

                retractImg: -

          }

          ------------------------------------------------------------------------------------

          The plugin exposes a public API with the following available properties and methods:

          1. req: - this is the XHTTP request object that retreives the ISI markup html file.  Available
                    in case you must check status or response contents in other code.

          2. initialPosition: - the initial position in the document of the ISI element after content loads.
                    used for calculating several parameters. Updated on resize or orientation change.

          3. isiMarkup: - the response value from the XHTTP request object, used to populate the ISI and cached here 
                    for manipulation and validation of content.

          4. wrapper: - the containing element that isi.html is loaded into

          5. parent: - the parent element of the wrapper. Used for appending a dummy block sized to original content
                    size to keep scrolling functining as expected, and to provide a reference for dropping the
                    content back into document flow after it has been pinned.

          6. mobileInd: - the mobile Indications element, used for stacked mobile view

          7. mainInd: - the main Indications element, used for desktop view

          8. filePath: - the path to the isi.html file.  relative to the call site of this code

          9. breakpoints: - cached breakpoints from the isiOptions object

          10. isiBtn: - the expand button for the ISI only (in non-stacked view, this is the only button visible)

          11. isiBtnHTML: - the innerHTML of the isiBtn element, cached for easy recall and allows external code to
                    change values

          12. isiBtnDim: - the dimensions of the isiBtn element, cached for easy recall and allows external code to
                    change values

          13. indBtn: - the expand button for the stacked Indications section, only expands the Indications section

          14. indBtnHtml: - same as isiBtnHTML above, but for indBtn

          15. indBtnDim: - same as isiBtnDim above, but for indBtn

          16. state: - the current state of the ISI.  Possible values are "pinned", "expanded", and "flow"

          17. prevState: - the state previous to the current state, cached for easy recall

          18. checkPos: - method for checking the visibility of the ISI and configuring accordingly.  It is called
                    constantly (after a short delay) during scroll events, and once per resize (after a short timer
                    expires) and orientation change.

          19. createBtn: - creates an empty div for attaching event listeners and styling to in the event that the
                    developer did not supply a reference to an element for the expand buttons

          20. expandISI: - method for expanding the ISI to the top of the screen and taking over the view. In stacked
                    mobile layout, this only expands the ISI, leaving the Indications section collapsed.

          21. expandIND: - method for expanding the Indications portion of the ISI.

          22. retract: - retract the ISI from the expanded state

          23. pin: - method for pinning the ISI

          24. unpin: - method for unpinning the ISI after pinning

          25. flow: - method for flowing the ISI, mostly applies flow styles without the steps taken in the unpin
                    process.


*/

'use strict'

var isi = (function buildModule(options){

  /*get the current viewport size*/

  var currentView = {},

      /* Holds the bounding box for the isi */

      currentPosition,

      /* Boolean to track if ISI is on screen */

      isInView = false,

      /* calculated current style properties based on current breakpoint.  Bare minimum defaults
         are included to cover the possibility of no styling being passed in the isioptions object */

      styleProps = {
        pinned: {
          top: '75%',
          position: 'fixed'
        },
        expanded: {
          top: '8px',
          position: 'absolute'
        },
        flow: {
          top: '',
          position: 'static'
        }
      },

      /* To hold the custom styles defined in the options object, based on the current breakpoint */

      customStyles = {
        pinned: {},
        expanded: {},
        flow: {}
      },

      /* To hold the styles for the expand/retract buttons based on the current breakpoint */

      expBtnStyleProps = {
        pinned: {
          
        },
        expanded: {
          
        },
        flow: {
          
        }
      },

      /* Values to hold expand/retract button text */

      expandTextPinned,
      retractTextPinned,
      expandTextExp,
      retractTextExp,
      expandTextFlow,
      retractTextFlow,

      /* cached numeric version of pinned top height for calcualtions */

      pinnedTop,

      /* dummy element to swap for ISI when pinned */

      dummy = document.createElement('div'),

      /* Holds a reference to the body element for scrolling calculations */

      pageBody = document.querySelector('body'),

      /* =============================================================
         Javascript scrolling elements for mobile scroll hijacking, fixes 
         issues with fixed element positioning display on mobile browsers
         ============================================================= */

      /* Boolean sets true if touch is enabled */

      isMobile = false,

      /* The sub-view that holds the page content meant to scroll under the ISI */

      view = document.getElementById('page-content'),

      /* Mobile scroll bar indicator */

      indicator = document.getElementById('indicator'),

      /* The relative position of the scroll puck in relation to overall document size, only used for mobile */

      relative,
      
      /* The minimum offset value used in mobile scrolling */
      
      min,
      
      /* The maximum offzet value used in mobile scrolling */
      
      max,
      
      /* The initial offset value for mobile scrolling */
      
      offset = min = 0,
      
      /* The reference position for touch events in mobile view */
      
      reference,
      
      /* Boolean for recording whether or not the user has tapped the screen in mobile browsers */
      
      pressed = false,
      
      /* CSS transform property prefix for setting vendor-specific prefixes on mobile */
      
      xform = 'transform',
      
      /* For generating the velocity curve for momentum scrolling */
      
      velocity,
      
      /* For generating the amplitude of the velocity curve in momentum scrolling */
      
      amplitude,
      
      /* The scroll target for mobile view */
      
      target,
      
      /*  */
      
      frame,
      
      /* */
      
      timestamp,
      
      /* */
      
      ticker,
      
      /* */
      
      now,
      
      /* */
      
      elapsed,
      
      /* */
      
      y,
      
      /* */
      
      delta,
      
      /* */
      
      v,
      
      /* */
      
      timeConstant = 325,
      
      /* ============================================================
         End javascript scroll elements
         ============================================================ */

      /*  */

      bodyBinding,
      scrollTimeout,
      resizeTimeout,
      mobileCrossover;

  /* These first few utilities are just for the purpose of checking whether or not a 
  passed value in the options object is a valid HTML element, and a third utility for
  checking for the presence of certain class names. */

  var isElement = function isElement(o){
        return (
          typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
          o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
        );
      },

      isNode = function isNode(o){
        return (
          typeof Node === "object" ? o instanceof Node :
          o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName === "string"
        );
      },

      hasClass = function hasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
      },

      /* Here we set up the predefined XMLHttpRequest object and load in the text or 
      HTML file specified via the path option of the options object */

      loadText = function loadText() {

        //publicAPI.req.overrideMimeType('text/plain');
        publicAPI.req.open('GET', publicAPI.filePath, true);
        publicAPI.req.addEventListener('load', textLoadResponder);
        publicAPI.req.send(null);
      
      },

      /* Instantiate the buildISI variable (will house the method later) */

      buildISI,

      /*
        Iterate through the breakpoints checking for a min/max range that the current
        window falls within.  Once identified, apply the related styles to the style
        object for the ISI and expand button respectively.
      */

      calculateBreakpoint = function calcualteBreakpoint() {
        for (var breakpoint in options.breakpoints) {
          if (options.breakpoints[breakpoint].minWidth <= currentView.width && options.breakpoints[breakpoint].maxWidth >= currentView.width) {
            return options.breakpoints[breakpoint];
          };
        }
      },

      /* Small helper function for setting the proper Indications block visibility, state
         is a boolean, true displays the mobile Indication block, false is "standard" view */

      showIndication = function showIndication(state) {
        if (state) {
          if (publicAPI.mobileInd) {
            publicAPI.mobileInd.style.display = 'block';
          }
          if (publicAPI.mainInd) {
            publicAPI.mainInd.style.display = 'none';
          }
        } else {
          if (publicAPI.mobileInd) {
            publicAPI.mobileInd.style.display = 'none';
          }
          if (publicAPI.mainInd) {
            publicAPI.mainInd.style.display = 'block';
          }
        }
      },

      /* This function simply parses the calculated breakpoint and applies the proper styling
         to the cached elements after storing the values */

      applyBreakpoint = function applyBreakpoint(breakpoint) {
        showIndication(breakpoint.mobileStacking);
        styleProps.pinned = breakpoint.pinned.isi;
        customStyles.pinned = breakpoint.pinned.customStyles;
        expBtnStyleProps.pinned = breakpoint.pinned.expandBtn;
        expandTextPinned = breakpoint.pinned.expandText;
        retractTextPinned = breakpoint.pinned.retractText;
        styleProps.expanded = breakpoint.expanded.isi;
        customStyles.expanded = breakpoint.expanded.customStyles;
        expBtnStyleProps.expanded = breakpoint.expanded.expandBtn;
        expandTextExp = breakpoint.expanded.expandText;
        retractTextExp = breakpoint.expanded.retractText;
        styleProps.flow = breakpoint.flow.isi;
        customStyles.flow = breakpoint.flow.customStyles;
        expBtnStyleProps.flow = breakpoint.flow.expandBtn;
        expandTextFlow = breakpoint.flow.expandText;
        retractTextFlow = breakpoint.flow.retractText;
        applyStyles();
        applyExpandBtnStyles();
      },

      /* Once we have a response from the get request, we can begin to build the ISI
      from the loaded information/markup/etc.  This load responder assigns the loaded
      content to the isiMarkup property and the innerHTML of the wrapper element that
      was passed in.  We then log the position on the page, build and link up the 
      "Expand" button, and pin the ISI depending on screen size, via the breakpoints
      that were set. */

      textLoadResponder = function textLoadResponder() {

        publicAPI.wrapper.innerHTML = publicAPI.isiMarkup = publicAPI.req.response ? publicAPI.req.response : '<p>Please include the necessary markup within the isi.html file.  Please note: this should be a document fragment.  Do not include doctype, head, or body tags.  All tags should be compatible for display within the body tag.  The html file extension is only used to ease syntax highlighting in most modern editors.</p>';
        buildISI();
      },

      /* Cross browser viewport check (returns width and height) */

      viewport = function viewport() {
        var e = window, a = 'inner';
        if ( !( 'innerWidth' in window ) ) {
          a = 'client';
          e = document.documentElement || document.body;
        }
        return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }
      },

      /* Handle browser check to implement javascript scrolling for mobile devices */

      checkBrowser = function checkBrowser() {
        var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
        if(/trident/i.test(M[1])){
            tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
            return {name:'IE',version:(tem[1]||'')};
            }   
        if(M[1]==='Chrome'){
            tem=ua.match(/\bOPR\/(\d+)/)
            if(tem!=null)   {return {name:'Opera', version:tem[1]};}
            }   
        M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
        return {
          name: M[0],
          version: M[1]
        };
      },

      /* Configure the dummy block that replaces ISI content on the page while ISI is 
      pinned, and append it to the ISI's parent element */

      buildDummy = function buildDummy() {
        dummy.style.height = publicAPI.position.height + 'px';
        dummy.style.width = publicAPI.position.width + 'px';
        publicAPI.parent.insertBefore(dummy,publicAPI.wrapper);
      },

      /* Applies styles related to the current state of the ISI. Styles are derived from 
      the breakpoints property of the options object, current styles are calculated based
      on screen size */

      applyStyles = function applyStyles() {
        /* Convert the style information for the pinned top value to numeric value for calculations */
        pinnedTop = styleProps.pinned.top.indexOf('%') ? (Number(styleProps.pinned.top.slice(0,styleProps.pinned.top.indexOf('%')))*.01)*currentView.height : Number(styleProps.pinned.top.slice(0,styleProps.pinned.top.indexOf('p')));
        /* Loop through the related styles and apply based on state information */
        for (var styleName in styleProps[publicAPI.state]) {
          publicAPI.wrapper.style[styleName] = styleProps[publicAPI.state][styleName];
        }
        for (var element in customStyles[publicAPI.state]) {
          var el = document.querySelector(customStyles[publicAPI.state][element]['selector']);
          for (var s in customStyles[publicAPI.state][element]['styles']) {
            el.style[s] = customStyles[publicAPI.state][element]['styles'][s];
          }
        }
      },

      /* Applies the expand button styles based on state and calculated breakpoint */

      applyExpandBtnStyles = function applyExpandBtnStyles() {
        /* Loop through the related styles and apply based on state information */
        for (var styleName in expBtnStyleProps[publicAPI.state]) {
          publicAPI.isiBtn.style[styleName] = expBtnStyleProps[publicAPI.state][styleName];
          publicAPI.indBtn.style[styleName] = expBtnStyleProps[publicAPI.state][styleName];
        }
        if (publicAPI.isiBtn) {
          switch (publicAPI.state) {
            case 'pinned':
              publicAPI.isiBtn.innerHTML = expandTextPinned;
              break;
            case 'expanded':
              publicAPI.isiBtn.innerHTML = expandTextExp;
              break;
            case 'flow':
              publicAPI.isiBtn.innerHTML = expandTextFlow;
              break;
          }
        }
        if (publicAPI.indBtn) {
          switch (publicAPI.state) {
            case 'pinned':
              publicAPI.indBtn.innerHTML = expandTextPinned;
              break;
            case 'expanded':
              publicAPI.indBtn.innerHTML = expandTextExp;
              break;
            case 'flow':
              publicAPI.indBtn.innerHTML = expandTextFlow;
              break;
          }
        }
      },

      /* Timed function to be called when the user scrolls (desktop only) */

      scrollResponder = function scrollResponder(){
        if(scrollTimeout){ clearTimeout(scrollTimeout); }
        scrollTimeout = setTimeout(function(){
          publicAPI.checkPos();
        },10);
      },

      /* Rebuilds the ISI after a short delay when the user resizes the window, calls
         buildISI with rebuild flag set to true */

      resizeResponder = function resizeResponder(){
        if(!!resizeTimeout){ clearTimeout(resizeTimeout); }
        resizeTimeout = setTimeout(function(){
          buildISI(true);
        },200);
      },

      /* Rebuilds the ISI on orientation change with rebuild flag set to true */

      orientationResponder = function orientationResponder(){
        buildISI(true);
      },

      /* Returns the Y position of touch events in mobile views, part of the scrolling
         functionality */

      ypos = function ypos(e){
        /* touch event */

        if (e.targetTouches && (e.targetTouches.length >= 1)) {
          return e.targetTouches[0].clientY;
        }

        /* mouse event */

        return e.clientY;

      },

      /* Mobile scrolling, applies a CSS transform to both the vew (id="page-content")
         and the ISI wrapper (when not in pinned state).  Emulates native scrolling on
         mobile devices while avoiding issues with fixed position elements. */

      scroll = function scroll(y){

        offset = (y > max) ? max : (y < min) ? min : y;
        view.style[xform] = 'translateY(' + (-offset) + 'px)';
        if (publicAPI.state==='flow' || publicAPI.state==='expanded') {
          publicAPI.wrapper.style[xform] = 'translateY(' + (-offset) + 'px)';
        }
        //indicator.style[xform] = 'translateY(' + (offset * relative) + 'px)';
        publicAPI.checkPos();
      },

      /* Registers taps in mobile view but ignores events if they originate from anchor
         tags or the expand buttons (allows links to still be clickable despite scroll 
         hijacking) */

      tap = function tap(e){
        if (e.target!==publicAPI.isiBtn&&e.target!==publicAPI.indBtn) {

          if (event.target.tagName.toLowerCase() === 'a') {
            return;
          }
          pressed = true;
          reference = ypos(e);

          velocity = amplitude = 0;
          frame = offset;
          timestamp = Date.now();
          clearInterval(ticker);
          ticker = setInterval(track,100);

          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      },

      /* Tracking function for registering drag events and scaling scroll momentum 
         accordingly, only used for mobile views */

      track = function track(){
        now = Date.now();
        elapsed = now - timestamp;
        timestamp = now;
        delta = offset - frame;
        frame = offset;
        v = 1000 * delta / (1 + elapsed);
        velocity = 0.8 * v + 0.2 * velocity;
      },

      /* Function for handling drag events and scrolling content accordingly, only
         used for mobile view */

      drag = function drag(e){
        if (pressed) {
          y = ypos(e);
          delta = reference - y;
          if (delta > 2 || delta < -2) {
            reference = y;
            scroll(offset + delta);
          }
        }
        e.preventDefault();
        e.stopPropagation();
        return false;
      },

      /* Function for clearing drag and initiating autoscroll, only used in mobile
         views */

      release = function release(e){

        if (event.target.tagName.toLowerCase() === 'a') {
          return;
        }

        pressed = false;

        clearInterval(ticker);
        if (velocity > 10 || velocity < -10) {
          amplitude = 0.8 * velocity;
          target = Math.round(offset + amplitude);
          timestamp = Date.now();
          requestAnimationFrame(autoScroll);
        }

        e.preventDefault();
        e.stopPropagation();
        return false;
      },

      /* Function for generating momentum scrolling to emulate native scrolling
         in mobile devices */

      autoScroll = function autoScroll(){
        if (amplitude) {
          elapsed = Date.now() - timestamp;
          delta = -amplitude * Math.exp(-elapsed / timeConstant);
          if (delta > 0.5 || delta < -0.5) {
            scroll(target + delta);
            requestAnimationFrame(autoScroll);
          } else {
            scroll(target);
          }
        }
      },

      /* Calculates the mobile crossover to check offset against for determining when the 
         ISI should be pinned or unpinned on screen */

      calculateSingleCrossover = function calculateSingleCrossover(){
        var co;
        co = (publicAPI.position.top - currentView.height) + (currentView.height - pinnedTop);
        return co;
      },

      /* Sets up event listeners for the expand buttons, and caches their dimensions and 
         innerHTML for recall. If no element is passed, one is created. */

      initializeButton = function initializeButton(which){
        /* Check if the options object contains the expandBtn property, if so, check if it's 
           an element/node. If it is not an element, we check the document for the selector. 
           If it doesn't exist, we create a new element and set up the properties */
        if (options[which]) {
          publicAPI[which] = isElement(options[which]) || isNode(options[which]) ? options[which] : document.querySelector(options[which]);
        } else {
          publicAPI[which] = publicAPI.createBtn();
        }
        publicAPI[which+'HTML'] = publicAPI[which].innerHTML;
        if (which==='isiBtn') {
          publicAPI[which].onclick = publicAPI.expandISI.bind(publicAPI);
        }
        if (which==='indBtn') {
          publicAPI[which].onclick = publicAPI.expandIND.bind(publicAPI);
        }
        publicAPI[which+'Dim'] = publicAPI[which].getBoundingClientRect();
      },

      /* Small helper function for registering the Indications blocks based on the parameters passed
         with the isiOptions object */

      initializeIndications = function initializeIndications(){
        publicAPI.mobileInd = isElement(options.mobileIndication) || isNode(options.mobileIndication) ? options.mobileIndication : document.querySelector(options.mobileIndication);
        publicAPI.mainInd = isElement(options.mainIndication) || isNode(options.mainIndication) ? options.mainIndication : document.querySelector(options.mainIndication);
      },

      /* Helper function for expanding the Indications portion of the ISI in stacked mobile views */

      setIndExpState = function setIndExpState(){
        if (publicAPI.isiBtn) {
          publicAPI.isiBtn.style.display = 'none';
          applyExpandBtnStyles();
          publicAPI.isiBtn.innerHTML = retractTextExp;
          publicAPI.isiBtn.onclick = publicAPI.retract.bind(publicAPI);
          publicAPI.isiBtn.ontouchstart = publicAPI.retract.bind(publicAPI);
        }
        if (publicAPI.indBtn) {
          applyExpandBtnStyles();
          publicAPI.indBtn.innerHTML = retractTextExp;
          publicAPI.indBtn.onclick = publicAPI.retract.bind(publicAPI);
          publicAPI.indBtn.ontouchstart = publicAPI.retract.bind(publicAPI);
        }
        if (publicAPI.mobileInd) {
          publicAPI.mobileInd.style.height = 'auto';
          publicAPI.mobileInd.style.borderBottom = 'none';
        }
        window.scrollTo( 0, 0 );
      },

      /*
        Calculates the layout of ISI (pinned and expanded height) and generates the needed 
        elements, pinning the ISI as the last step.
      */

      buildISI = function buildISI(rebuild) {
        /* scroll function setup */
        relative = (innerHeight - 30) / max;
        if (!rebuild) {
          console.log(checkBrowser());
          /* Check to see if standard transforms are supported, if not, find the apprp. prefix */
          ['webkit', 'Moz', 'O', 'ms'].every(function (prefix) {
            var e = prefix + 'Transform';
            if (typeof view.style[e] !== 'undefined') {
                xform = e;
                return false;
            }
            return true;
          });
          /* Initialize event listeners for scrolling */
          if (typeof window.ontouchstart !== 'undefined') {
            view.addEventListener('touchstart', tap);
            view.addEventListener('touchmove', drag);
            view.addEventListener('touchend', release);
            publicAPI.wrapper.addEventListener('touchstart', tap);
            publicAPI.wrapper.addEventListener('touchmove', drag);
            publicAPI.wrapper.addEventListener('touchend', release);
            isMobile = true;
          }
        }
        
        /* ISI setup */

        currentView = viewport();
        initializeIndications();
        applyBreakpoint(calculateBreakpoint());
        if (!rebuild) {
          /* Grab the wrapper's parent node for insert of dummy content when pinning the ISI */
          publicAPI.parent = publicAPI.wrapper.parentNode;
          /* Add the event listener to check for user scrolling */
          window.onscroll = scrollResponder;
          /* Listen for resize events */
          window.onresize = resizeResponder;
          /* Listen for orientation changes */
          window.addEventListener("orientationchange", orientationResponder, false);
          initializeButton('isiBtn');
          initializeButton('indBtn');
        }
        if (rebuild) {
          publicAPI.unpin();
        }
        /* Run an initial check so the ISI is pinned on page load if it should be */
        publicAPI.position = publicAPI.wrapper.getBoundingClientRect();
        mobileCrossover = calculateSingleCrossover();
        publicAPI.checkPos();
        options.callback.call();
      };

  var publicAPI = {

    /* Set up the request for loading the ISI text from local file */
    req: new XMLHttpRequest(),

    initialPosition: {},

    /* This variable holds the markup for the ISI for any processing or changes */
    isiMarkup: '',

    /* Holds the wrapper element from the main page that the ISI content is loaded into */
    wrapper: isElement(options.wrapper) || isNode(options.wrapper) ? options.wrapper : document.querySelector(options.wrapper),

    /* Holds the parent element for the wrapper for inserting and removing the dummy block
       (keeps scrolling and page size consistent while ISI is pinned) */
    parent: {},

    /* Holds the folding indication for display on mobile devices.  mobileStacking option
       in breakpoints controls display of this block. Main indication is not displayed when
       mobileIndication is visible. */
    mobileInd: null,

    /* The main indication block.  Displayed when mobileStacking is set to false */
    mainInd: null,

    /* File path for the ISI markup/text. Defaults to js/pinned_isi/isi.txt if no path is specified */
    filePath: options.filePath ? options.filePath : "isi.html",

    /* Breakpoints and related style information for various screen sizes. Defaults to a catch-all setting
       in case values are not specified. */
    breakpoints: options.breakpoints ? options.breakpoints : {
        all: {

        }
    },

    /* Holds the expand button element for toggling ISI (only displays on pinned state) */
    isiBtn: null,

    /* Holds the innerHTML of the expand button for restoration */
    isiBtnHTML: null,

    isiBtnDim: {},

    /* Holds the expand button element for toggling the indication in mobile layouts 
       (only displays in pinned state) */
    indBtn: null,

    indBtnHTML: null,

    indBtnDim: {},

    /* Holds state information.  Possible states are "pinned", "expanded", and "flow" */
    state: '',
    prevState: '',

    /* */

    checkPos: function checkPos() {
      /* Make sure scroll functions have proper element height for view */
      max = parseInt(getComputedStyle(pageBody).height, 10) - innerHeight;
      /*get current ISI position on page */
      this.position = this.wrapper.getBoundingClientRect();
      /*if the top is higher than the bottom of the view, set to true */
      if (isMobile) {
        isInView = ((this.position.top-currentView.height)-offset) < currentView.height || this.state === 'expanded' ? true : false;
      } else {
        isInView = this.position.top < currentView.height || this.state === 'expanded' ? true : false;
      }
      /*if the ISI isn't visible on screen, pin it. */
      if (!isInView) {
        this.pin();
        return;
      } else {
        /* If the ISI is expanded, do nothing */
        if (this.state === 'expanded') {
          return;
        } else {
          /* Check to make sure the dummy block has been inserted within the page.  If it has,
             we can check the position against the pinned ISI position, and drop the ISI back
             into the flow as soon as it scrolls into view, otherwise, we do nothing. */
          if (dummy.parentElement) {
            if (isMobile) {
              if (offset<mobileCrossover) {
                return;
              } else {
                this.unpin();
              }
            } else {
              currentPosition = dummy.getBoundingClientRect();
              if (currentPosition.top>this.position.top) {
                return;
              } else {
                this.unpin();
              }
            }
          } else {
            /* This check covers the small portion of time when the content may be on screen, but
               resides below the pinned height, in which case we want to pin it.  This keeps the 
               effect from jumping when the content scrolls off screen. */
            if (isMobile) {
                if (offset<mobileCrossover) {
                  this.pin();
                } else {
                    if (this.state!=='flow') {
                      this.flow();
                    }
                }
            } else {
              if (this.position.top>pinnedTop) {
                this.pin();
              } else {
                if (this.state!=='flow') {
                  this.flow();
                }
              }
            }
          }
        } 
      }
    },

    /* Creates an empty anchor element for attaching butten events to. Only used if developer does not
       supply an element to bind events to. */

    createBtn: function createBtn() {
      var newBtn = document.createElement('a');
      return newBtn;
    },

    /* Expands the ISI to full screen, does not affect Indication in stacked mobile layout */

    expandISI: function expandISI(e) {
      if (dummy.parentElement) {
        this.state = 'expanded';
        this.parent.removeChild(dummy);
        applyStyles();
        if (!isMobile) {
          view.style.height = styleProps.expanded.top;
          view.style.overflow = 'hidden';
        } else {
          this.position = this.wrapper.getBoundingClientRect();
          view.style.height = String(this.position.height)+'px';
          view.style.padding = '0';
          view.style.border = 'none'
          view.style.overflow = 'hidden';
        }
        if (this.isiBtn && this.indBtn) {
          applyExpandBtnStyles();
          this.isiBtn.innerHTML = retractTextExp;
          this.indBtn.innerHTML = expandTextExp;
          this.isiBtn.onclick = this.retract.bind(this);
          this.isiBtn.ontouchstart = this.retract.bind(this);
          this.indBtn.onclick = this.expandIND.bind(this);
          this.indBtn.ontouchstart = this.expandIND.bind(this);
        } else if (this.isiBtn) {
          applyExpandBtnStyles();
          this.isiBtn.innerHTML = retractTextExp;
          this.isiBtn.onclick = this.retract.bind(this);
          this.isiBtn.ontouchstart = this.retract.bind(this);
        }
        window.scrollTo( 0, 0 );
      }
    },

    /* Expands the Indications section and ISI to full screen, only applies in stacked
       mobile layout */

    expandIND: function expandIND(e) {
      if (dummy.parentElement) {
        this.state = 'expanded';
        this.parent.removeChild(dummy);
        applyStyles();
        setIndExpState();
        if (!isMobile) {
          view.style.height = styleProps.expanded.top;
          view.style.overflow = 'hidden';
        } else {
          this.position = this.wrapper.getBoundingClientRect();
          view.style.height = String(this.position.height)+'px';
          view.style.padding = '0';
          view.style.border = 'none'
          view.style.overflow = 'hidden';
        }
      } else if (this.state === 'expanded') {
        setIndExpState();
        if (!isMobile) {
        } else {
          this.position = this.wrapper.getBoundingClientRect();
          view.style.height = this.position.height;
          view.style.padding = '0';
          view.style.border = 'none'
        }
      }
    },

    /* Retracts the ISI to pinned state after expanding */

    retract: function retract(e) {
      if (!isMobile) {
        view.style.height = '';
        view.style.overflow = '';
      } else {
          view.style.height = '';
          view.style.overflow = '';
          view.style.padding = '';
          view.style.border = ''
        }
      if (this.isiBtn) {
        this.isiBtn.style.display = 'block';
        applyExpandBtnStyles();
      }
      this.pin();
    },

    /* Pins the ISI when in flow state and below the current viewport visibility */

    pin: function pin() {
      this.state = 'pinned';
      /* we need a dummy block the same size as the ISI content so that scrolling still 
      works smoothly and we don't hit an unexpected end of content */
      buildDummy();
      /* with the dummy in place we can safely pin the ISI */
      applyStyles();
      this.wrapper.style[xform] = 'translateY(0px)';
      if (this.isiBtn) {
        applyExpandBtnStyles();
        this.isiBtn.innerHTML = expandTextPinned;
        this.isiBtn.onclick = this.expandISI.bind(this);
        this.isiBtn.ontouchstart = this.expandISI.bind(this);
      }
      if (this.indBtn) {
        applyExpandBtnStyles();
        this.indBtn.innerHTML = expandTextPinned;
        this.indBtn.onclick = this.expandIND.bind(this);
        this.indBtn.ontouchstart = this.expandIND.bind(this);
      }
      if (this.mobileInd) {
        this.mobileInd.style.height = '';
      }
    },

    /* This is similar to flow but resets certain parameters that are only affected if
       the ISI has been pinned previously */

    unpin: function unpin() {
      this.state = 'flow';
      /* Remove the dummy element from the document flow and restore original position */
      this.parent.removeChild(dummy);
      applyStyles();
      this.wrapper.style[xform] = 'translateY(' + (-offset) + 'px)';
      if (this.isiBtn) {
        applyExpandBtnStyles();
        this.isiBtn.innerHTML = retractTextFlow;
        this.isiBtn.style.height = this.isiBtnDim.height + 'px';
        this.isiBtn.style.width = this.isiBtnDim.width + 'px';
      }
      if (this.mobileInd) {
        this.mobileInd.style.height = 'auto';
      }
    },

    /* Public method, sets up flow styles. This method drops the ISI content into the 
       document flow and sets the appropriate styles. */

    flow: function flow() {
      this.state = 'flow';
      applyStyles();
      if (this.isiBtn) {
        applyExpandBtnStyles();
        this.isiBtn.innerHTML = expandTextFlow;
        this.isiBtn.style.height = this.isiBtnDim.height + 'px';
        this.isiBtn.style.width = this.isiBtnDim.width + 'px';
      }
      if (this.indBtn) {
        applyExpandBtnStyles();
        this.indBtn.innerHTML = expandTextFlow;
        this.indBtn.style.height = this.indBtnDim.height + 'px';
        this.indBtn.style.width = this.indBtnDim.width + 'px';
      }
    }

  };

  /* Load the isi.html file */

  loadText();

  /* returns the public API object */

  return publicAPI;

}(isiOptions));
