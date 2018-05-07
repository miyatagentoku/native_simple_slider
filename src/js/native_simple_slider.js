	"use strict";

	/*-----------------------------------------------------------------------------------
		[module] slider plugin
		created by gentoku miyata
		copy right 2018/04/26
 	-----------------------------------------------------------------------------------*/
 	/*
		Slider Controller Super Class of m_slider.js objects
		object _slider : slider dom elements
		object options : object
		{
			int speed : interval
			function sliderLoaded : callback event after Controller called constructor
			function slideBefore : callback event before sliderPrev or sliderNext
			function slideAfter : callback event after sliderPrev or sliderNext
		}
 	*/
	function _Controller( _slider, options = {} ) {

		try {

			if( _slider.hasChildNodes() ) {

				this._constructor.call( this, _slider, options );

				if( options.sliderLoaded != null && options.sliderLoaded != undefined ) options.sliderLoaded( );
			
			} else {
				// original Exception
				throw new _SliderException( 'init' , _slider , " is not Slider parent" );
			}

		} catch( e ) {

			throw new _SliderException( 'init', null , e );

		}
	}

	/*
		constructor
		_slider : DOMElement
	*/
	_Controller.prototype._constructor = function ( _slider, options ) {

		var self = this;

		// interval thread
		self._thread;
		// timer thread
		self._timer;
		// options setting
		self._options = options;

		// generate slider entity
		self._sliderEntity = new _SliderEntity( self, _slider );

		// generate slider controller and append to slider wrap
		self._sliderController = new _SliderController( self, _slider.children.length );
		self.getSliderEntity().getSliderWrap().appendChild( self._sliderController.getSliderController() );

		// set flick event for SP
		self._hookFlickEvent.call( self );
	}

	/*
		run method
	*/
	_Controller.prototype.run = function () {
		this._addMeter.call( this );
	}

	/*
		stop method
	*/
	_Controller.prototype.stop = function () {
		if( this.getThread() ) clearInterval( this.getThread() );
	}

	/*
		add meter for progress bar and if it filled run sliderNext
	*/
	_Controller.prototype._addMeter = function( ){
		
		var self = this;

		// set interval thread
		self.setThread(

		    setInterval(
		        
		        function(){

		        	// meter
		        	var _meter = self.getSliderController().getMeter();
		        
		        	if( _meter >100){

		        		self._sliderNext.call( self );

		        	}else{

		        		self.getSliderController().getSliderBars()[ self.getSliderEntity().getCurrentIndex() ].meter.setAttribute("style",`width:${ _meter }%;`);

		        		self.getSliderController().setMeter( _meter + 2 );

		        	}

		        }
		        ,
		        (self.getOptions().speed != null && self.getOptions().speed != undefined)?self.getOptions().speed:100
		    )
		);

	}

	/*
		change next slide
	*/
	_Controller.prototype._sliderNext = function () {

		var self = this;

		// callback options.slideBefore
		if( self.getOptions().slideBefore != null && self.getOptions().slideBefore != undefined ) self.getOptions().slideBefore();

		// stop interval thread
		clearInterval( self.getThread() );

		// current index
		var _index = self.getSliderEntity().getCurrentIndex();

		// initialize meter : count 0 and width 0
		self.getSliderController().setMeter( 0 );
		self.getSliderController().getSliderBars()[ _index ].meter.setAttribute("style","width:0;");

		// current index is last of slider bars
		if( _index == self.getSliderEntity().getSlider().children.length - 1 ){
		    self.getSliderEntity().setCurrentIndex( 0 );
		    self.getSliderEntity().getSlider().setAttribute( "style",`transform:translate3d(0,0,0); width: ${self.getSliderEntity().getSliderWidth()}px;` );
		}else{
		    self.getSliderEntity().setCurrentIndex( _index + 1 );
		    self.getSliderEntity().getSlider().setAttribute("style",`transform:translate3d(${ ( ( _index + 1 ) * self.getSliderEntity().getSliderWrap().clientWidth ) * -1 }px,0,0); width : ${self.getSliderEntity().getSliderWidth()}px;`);
		}

		// restart slider
		self._addMeter.call( self );

		// callback options.slideAfter
		if( self.getOptions().slideAfter != null && self.getOptions().slideAfter != undefined ) self.getOptions().slideAfter();
	}

	/*
		change prev slide
	*/
	_Controller.prototype._sliderPrev = function () {

		var self = this;

		// callback options.slideBefore
		if( self.getOptions().slideBefore != null && self.getOptions().slideBefore != undefined ) self.getOptions().slideBefore();

		// stop interval thread
		clearInterval( self.getThread() );

		// current index
		var _index = self.getSliderEntity().getCurrentIndex();

		// initialize meter : count 0 and width 0
		self.getSliderController().setMeter( 0 );
		self.getSliderController().getSliderBars()[ _index ].meter.setAttribute("style","width:0;");

		// current index is first of slider bars
		if( _index == 0 ){
			var _current = self.getSliderEntity().getSlider().children.length - 1;
		    self.getSliderEntity().setCurrentIndex( _current );
		    self.getSliderEntity().getSlider().setAttribute( "style",`transform:translate3d(${ ( _current * self.getSliderEntity().getSliderWrap().clientWidth ) * -1 }px,0,0); width: ${self.getSliderEntity().getSliderWidth()}px;` );
		}else{
		    self.getSliderEntity().setCurrentIndex( _index - 1 );
		    self.getSliderEntity().getSlider().setAttribute("style",`transform:translate3d(${ ( ( _index - 1 ) * self.getSliderEntity().getSliderWrap().clientWidth ) * -1 }px,0,0); width: ${self.getSliderEntity().getSliderWidth()}px;`);
		}

		// restart slider
		self._addMeter.call( self );

		// callback options.slideAfter
		if( self.getOptions().slideAfter != null && self.getOptions().slideAfter != undefined ) self.getOptions().slideAfter();
	}

	/*
		set options
	*/
	_Controller.prototype.setOptions = function ( _options ) {
		this._options = _options;
	}

	/*
		get options
	*/
	_Controller.prototype.getOptions = function () {
		return this._options;
	}

	/*
		set interval thread
	*/
	_Controller.prototype.setThread = function ( _thread ) {
		this._thread = _thread;
	}

	/*
		get interval thread
	*/
	_Controller.prototype.getThread = function () {
		return this._thread;
	}

	/*
		set timer thread
	*/
	_Controller.prototype.setTimer = function ( _timer ) {
		this._timer = _timer;
	}

	/*
		get timer thread
	*/
	_Controller.prototype.getTimer = function () {
		return this._timer;
	}

	/*
		set slider entity instance
	*/
	_Controller.prototype.setSliderEntity = function ( _sliderEntity ) {
		this._sliderEntity = _sliderEntity;
	}

	/*
		get slider entity instance
	*/
	_Controller.prototype.getSliderEntity = function () {
		return this._sliderEntity;
	}

	/*
		set slider controller instance
	*/
	_Controller.prototype.setSliderController = function ( _sliderController ) {
		this._sliderController = _sliderController;
	}

	/*
		get slider controller instance
	*/
	_Controller.prototype.getSliderController = function () {
		return this._sliderController;
	}

	/*
		hook flick events
	*/
	_Controller.prototype._hookFlickEvent = function () {
		
		var self = this;

		self.getSliderEntity().getSlider().addEventListener( 'touchstart', function( event ) {
			self._sliderFlickEvents.call( self, event );
		} );                                            
		self.getSliderEntity().getSlider().addEventListener( 'touchmove', function( event ) {
			self._sliderFlickEvents.call( self, event );
		} );
		self.getSliderEntity().getSlider().addEventListener( 'touchend', function( event ) {
			self._sliderFlickEvents.call( self, event );
		} );
	}

	/*
		flick events start / move / end
	*/
	_Controller.prototype._sliderFlickEvents = function( event ) {

		var self = this;
		
		switch ( event.type ) {

			case 'touchstart':
			self.touchStart = event.touches[0].pageX;
			break;

			case 'touchmove':
			// do nothing
			break;

			case 'touchend':


			if( self.touchStart > event.changedTouches[0].pageX ) {
				self._sliderNext.call( self );
			} else {
				self._sliderPrev.call( self );
			}

			break;
		}

	}

	/*-----------------------------------------------------------------------------------
		sliderEntity
	-----------------------------------------------------------------------------------*/
	function _SliderEntity ( _super, _slider ) {
		this._constructor.call( this, _super, _slider )
	}

	_SliderEntity.prototype._constructor = function( _super, _slider ) {

		var self = this;

		// extend super class
		self._super = _super;

		// existing slider
		self._slider = _slider;

		self._slider.addClass( 'm-slider' );


		var def_c = self._slider.getAttribute("class");

		// if slider has any class
		if(def_c){

			// trim space
			if( /[ ]+/g.exec(def_c) )def_c = def_c.replace( /[ ]+/g,' ' );
		
			// add class
			self._slider.setAttribute( 'class', def_c + ' ' + 'm-slider' );

		}
		// if slider doe'nt have class
		else {
			// add class
			self._slider.setAttribute( 'class', 'm-slider');
		}



		// existing slider width
		var c = self._slider.children;
		for( var i = 0, max = c.length; i < max; i++ ) {
			c[i].setAttribute('style','float:left;width:'+_slider.parentNode.clientWidth+'px');
		}

		// first slider width get from parentNode of its
		self._sliderwidth = _slider.parentNode.clientWidth * (c.length);

		// slider wrap
		self._sliderwrap = document.createElement('div');
		self._sliderwrap.setAttribute('class','m-sliderWrap');

		// slider box
		self._sliderbox = document.createElement('div');
		self._sliderbox.setAttribute('class','m-sliderBox');

		// current slider index
		self._currentindex = 0;


		// slider set up
		self._setUpSlider.call( self );
	}

	/*
		get clone and remove existing slider , then append slider to slider wrap
	*/
	_SliderEntity.prototype._setUpSlider = function () {

		var self = this;

		// get slider's parent and insert slider wrap before slider
		var sliderParent = self.getSlider().parentNode;
		sliderParent.insertBefore( self.getSliderWrap(), self.getSlider() );

		var copy = self.getSlider().cloneNode( true );

		self.getSlider().remove();
		self.setSlider( copy );
		self.getSlider().setAttribute('style',`width: ${self.getSliderWidth()}px`);

		// slider append to slider box
		self.getSliderBox().appendChild( self.getSlider() );

		// slider box append to slider wrap
		self.getSliderWrap().appendChild( self.getSliderBox() );

		window.addEventListener('resize', function() {
			self._responsive.call( self );
		});
	}

	/*
		slider responsive event
	*/
	_SliderEntity.prototype._responsive = function () {

		var self = this;

		if( self._super.getTimer() ) clearTimeout( self._super.getTimer() );
		if( self._super.getThread() ) clearInterval( self._super.getThread() );

		self._super.setTimer( setTimeout(function(){self._super._addMeter( self._super );}, 300) );

		var c = self._slider.children;
		for( var i = 0, max = c.length; i < max; i++ ) {
			c[i].setAttribute('style','float:left;width:'+self.getSliderWrap().clientWidth+'px');
		}

		self.setSliderWidth( self.getSliderWrap().clientWidth * c.length );
		self.getSlider().setAttribute('style',`transform:translate3d(${ ( self.getCurrentIndex() * self.getSliderWrap().clientWidth ) * -1 }px,0,0); width: ${self.getSliderWidth()}px;` );
	}

	_SliderEntity.prototype.setSlider = function ( _slider ) {
		this._slider = _slider;
	}

	_SliderEntity.prototype.getSlider = function () {
		return this._slider;
	}

	_SliderEntity.prototype.getSliderParent = function () {
		return this._sliderParent;
	}

	_SliderEntity.prototype.setSliderWidth = function ( _sliderwidth ) {
		this._sliderwidth = _sliderwidth;
	}

	_SliderEntity.prototype.getSliderWidth = function () {
		return this._sliderwidth;
	}

	_SliderEntity.prototype.setSliderWrap = function ( _sliderwrap ) {
		this._sliderwrap = _sliderwrap;
	}

	_SliderEntity.prototype.getSliderWrap = function () {
		return this._sliderwrap;
	}

	_SliderEntity.prototype.setSliderBox = function ( _sliderbox ) {
		this._sliderbox = _sliderbox;
	}

	_SliderEntity.prototype.getSliderBox = function () {
		return this._sliderbox;
	}

	_SliderEntity.prototype.setCurrentIndex = function ( _currentindex ) {
		this._currentindex = _currentindex;
	}

	_SliderEntity.prototype.getCurrentIndex = function () {
		return this._currentindex;
	}

	/*-----------------------------------------------------------------------------------
		sliderController
	-----------------------------------------------------------------------------------*/
	function _SliderController ( _super, _slidernum ) {
		this._constructor.call( this, _super, _slidernum );
	}

	/*
		sliderController constructor
		create : sliderController
		         sliderController bar and meter
	*/
	_SliderController.prototype._constructor = function ( _super, _slidernum ) {

		var self = this;

		self._super = _super;

		self._sliderController = document.createElement('div');
		self._sliderController.setAttribute('class','m-sliderController');

		self._sliderControllerBars = [];

		self._meter = 0;

		// slider controller click event
		var ev = function( event ){
				
			for (var i = 0, max = self.getSliderBars().length; i < max ; i++) {
					
				if( event.target == self.getSliderBars()[i].bar ) {
					clearInterval( self._super.getThread() );
					self._super.getSliderController().setMeter( 0 );
					self._super.getSliderController().getSliderBars()[ self._super.getSliderEntity().getCurrentIndex() ].meter.setAttribute("style","width:0;");
					self._super.getSliderEntity().setCurrentIndex( i );
					self._super.getSliderEntity().getSlider().setAttribute("style",`transform:translate3d(${ ( i * self._super.getSliderEntity().getSliderWrap().clientWidth ) * -1 }px,0,0); width: ${self._super.getSliderEntity().getSliderWidth()}px`);
					self._super._addMeter.call( self._super );
				}
			}
		};

		// create slider controller bars and add events
		for( var i = 0; i < _slidernum; i++ ) {
			self._sliderControllerBars[i] = {
				bar : document.createElement('div'),
				meter : document.createElement('div')
			}

			self._sliderControllerBars[i].bar.addEventListener("click", ev);
			
			self._sliderControllerBars[i].bar.setAttribute( 'class', 'm-sliderController-bar' );
			self._sliderControllerBars[i].meter.setAttribute( 'class', 'm-sliderController-bar-meter' );
			self._sliderControllerBars[i].bar.appendChild( self._sliderControllerBars[i].meter );

			self._sliderController.appendChild( self._sliderControllerBars[i].bar );
		}
	}

	_SliderController.prototype.getSliderController = function () {
		return this._sliderController;
	}

	_SliderController.prototype.getSliderBars = function () {
		return this._sliderControllerBars;
	}

	_SliderController.prototype.setMeter = function ( _meter ) {
		this._meter = _meter;
	}

	_SliderController.prototype.getMeter = function () {
		return this._meter;
	}

	/*-----------------------------------------------------------------------------------
		Exception
	-----------------------------------------------------------------------------------*/
	function _SliderException( timing , dom , message) {
		this.ERR_OCCURRED_TIMING = timing;
		this.ERR_TARGET_TAGNAME = dom.tagName;
		this.ERR_MESSAGE = message;
	}

	/*
		文字列として使用されるとき（例 : エラーコンソール上）に
		例外を整形する
	*/
	_SliderException.prototype.toString = function() {
		return this.timing + ' : ' + (this.ERR_TARGET_TAGNAME?this.ERR_TARGET_TAGNAME:'') + this.ERR_MESSAGE;
	}