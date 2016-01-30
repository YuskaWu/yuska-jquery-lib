 /**
  * Send ajax request and receive json data.
  */
var JsonAjax = ( function(window) {

    // default options
    var defOption = {
        type: 'POST',
        async: true,
        timeout: 120000,
        overlayClass: "ajaxLoading",
        overlayTargetElms: [],

        /**
         * callback function, trigger before sending request.
         */
        before: function(){},
        /**
         * callback function, trigger after request has finished. 
         */
        after: function(){},
        /**
         * A function to be called if the request succeeds.
         */
        done: function (data, textStatus, jqXHR) {},
        /**
         * A function to be called if the request fails.
         * The second argument (besides null) are "timeout", 
         * "error", "abort", and "parsererror".
         */
        fail: function (jqXHR, textStatus, errorThrown) {
            try {
                console.log(jqXHR);
            } catch (err) {

            }

            // For FireFox & IE. 
            // If user aborted ajax, FireFox and IE will trigger this fail function, following
            // judgment is used to ignore the situation. 
            if (this.isUserAborted(jqXHR) && textStatus != 'timeout' && textStatus != 'parsererror') {
                return;
            }

            alert('error:' + jqXHR.responseText);
        }
    };

    function JsonAjax (opt) {
        this.option = $.extend(defOption, opt);
        this.overlay = new LoadingOverlay(
            this.option.overlayTargetElms, 
            {
                overlayClass: this.option.overlayClass
            }
        );

        this.complete = true;
    }

    return JsonAjax;

} )(window);


// public functions -----------------------------------------------------------------------

JsonAjax.prototype.isUserAborted = function (xhr) {
    return !xhr.getAllResponseHeaders();
};

/**
 * The request has finished or not.
 */
JsonAjax.prototype.isComplete = function () {
    return this.complete
};
	
/**
 * send ajax request.
 */
JsonAjax.prototype.send = function (url, params) {
    var thisIns = this;
    this.complete = false;

    var data = {};
    if ($.isPlainObject(params)) {
        data = params;
    }

    return $.ajax({
        url: url,
        type: this.option.type,
        dataType: 'json',	
        async: this.option.async,
        data: data,
        headers: {},
        timeout: this.option.timeout,
        cache: false,

        beforeSend: function () {
            thisIns.beforeSend();
        },

    }).done(function(data, textStatus, jqXHR){
        thisIns.option.done.call(thisIns, data, textStatus, jqXHR);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        thisIns.option.fail.call(thisIns, jqXHR, textStatus, errorThrown);
    }).always(function (jqXHR, textStatus, errorThrown) {
        thisIns.always(jqXHR, textStatus, errorThrown);
    });         
}

/**
 * A pre-request callback function that can be used to modify 
 * the jqXHR (in jQuery 1.4.x, XMLHTTPRequest) object before it is sent.
 */
JsonAjax.prototype.beforeSend = function () {
    this.overlay.show();

    if ($.isFunction(this.option.before)) {
        this.option.before.call(this);
    }
};

/**
 * A function to be called when the request finishes.
 * The second argument are "success", "notmodified", 
 * "nocontent", "error", "timeout", "abort", or "parsererror".
 */
JsonAjax.prototype.always = function (jqXHR, textStatus, errorThrown) {
    this.overlay.remove();
    this.complete = true;

    if ($.isFunction(this.option.after)) {
        this.option.after.call(this, jqXHR, textStatus, errorThrown);
    }
};
    
// setters to customize callback function dynamically ------------------------------
	
JsonAjax.prototype.setBefore = function (callback) {
    if ($.isFunction(callback)) {
        this.option.before = callback;
    }
    return this;
};
JsonAjax.prototype.setDone = function (callback) {
    if ($.isFunction(callback)) {
        this.option.done = callback;
    }
    return this;
};
JsonAjax.prototype.setFail = function (callback) {
    if ($.isFunction(callback)) {
        this.option.fail = callback;
    }
    return this;
};
JsonAjax.prototype.setAfter = function (callback) {
    if ($.isFunction(callback)) {
        this.option.after = callback;
    }
    return this;
};