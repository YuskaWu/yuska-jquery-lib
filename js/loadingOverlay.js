function LoadingOverlay (overlay, opt) {
	var thisIns = this;
	var defOption = {
		overlayClass: "ajaxLoading",
		resizeFrequency: 500
	};

	var option = $.extend(defOption, opt);
	this.option = option;
	this.overlayElms = [];
	
	if ($.isArray(overlay)) {
		this.overlayTargetElms = overlay;
	} else {
		this.overlayTargetElms = [];
		this.overlayTargetElms.push(overlay);
	}
	
	
	/**
	 * Bind window resize event. When resize event occur, trigger updateLoadingOverlayPosition() function 
	 * to modify the size and position of overlay element, so that overlay element can display appropriately 
	 * over the element which we want to overlay.
	 */
	$(window).on('resizeEnd', function () {
		thisIns.updateLoadingOverlayPosition();
	});
	$(window).resize(function() {
		if(thisIns.resizeTO) {
			clearTimeout(this.resizeTO);
		}
		thisIns.resizeTO = setTimeout(function() {
			$(this).trigger('resizeEnd');
		}, option.resizeFrequency);
	});
}

LoadingOverlay.prototype.show = function () {
	var thisIns = this;
	if (this.overlayElms.length > 0) {
		return;
	}
	
	for (var i = 0; i < this.overlayTargetElms.length; i++) {
		var elm = this.overlayTargetElms[i];
		var overlayElm = $('<div><span></span></div>').css({
				'opacity':0.6,
				'position':'absolute',
				'z-index':99999
		}).addClass(this.option.overlayClass);
		overlayElm.width(elm.outerWidth());
		overlayElm.height(elm.outerHeight());
		overlayElm.css(this.getAbsolutePosition(elm));
		
		this.overlayElms.push(overlayElm);
		elm.append(overlayElm);
	}
	
	// delay 1 second to update overlay position again because sometimes 
	// the position get from the element which we want to overlay is not 
	// correct because it's still rending and not ready yet.
	setTimeout(function () {
		thisIns.updateLoadingOverlayPosition()
	}, 1000);
}

LoadingOverlay.prototype.updateLoadingOverlayPosition = function () {
	try {
		for (var i = 0; i < this.overlayTargetElms.length; i++) {
			var elm = this.overlayTargetElms[i];
			var overlayElm = this.overlayElms[i];
			overlayElm.width(elm.outerWidth());
			overlayElm.height(elm.outerHeight());
			overlayElm.css(this.getAbsolutePosition(elm));
		}
	} catch (err) {
		
	}
}

/**
 * get current position of element which we want to overlay.
 */
LoadingOverlay.prototype.getAbsolutePosition = function (elm) {
	var coordinates = {};
	var position = elm.css('position');
	
	// The absolute overlay element is relative to document.
	if (position == "static") {
		coordinates.top = elm.position().top;
		coordinates.left = elm.position().left
	} 
	// The absolute overlay element is relative to the element which we want to overlay,
	if (position == "relative") {
		coordinates.top = 0;
		coordinates.left = 0;
	}
	
	return coordinates;
};

LoadingOverlay.prototype.remove = function () {
	if (!this.overlayElms) {
		return;
	}
	for (var i = 0; i < this.overlayElms.length; i++) {
		this.overlayElms[i].remove();
	}
	
	this.overlayElms = [];
};