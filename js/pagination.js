/**
 * Static pagination
 */
var Pagination = ( function(window) {
    
    // default option
    var defOption = {
        // [require] jquery object, the container element for list.
        listContainer: null,
        // [require] jquery object, the container element for all elements of pagination.
        paginationContainer: null,
        // container html for all paginaton buttons.
        btnContainerHtml: '<nav style="text-align:center;width:100%"><ul class="pagination"></ul></nav>',

        // first page button
        firstBtnHtml: '<li><a href="#" aria-label="First"><span aria-hidden="true">&lt;&lt;</span></a></li>',
        // last page button
        lastBtnHtml: '<li><a href="#" aria-label="Last"><span aria-hidden="true">&gt;&gt;</span></a></l&lt;i>',
        // previous page button
        preBtnHtml: '<li><a href="#" aria-label="Previous"><span aria-hidden="true">&lt;</span></a></li>',
        // next page button
        nextBtnHtml: '<li><a href="#" aria-label="Next"><span aria-hidden="true">&gt;</span></a></li>',
        // page number button
        pageBtnHtml: '<li><a href="#">{pageNum}</a></li>',

        // record number for each page
        pageSize: 5,
        // how many number buttons to be shown at the same time.
        visibleSize: 3,

        // default page
        defaultPage: 1,

        // callback function to apply active style for page number button.
        applyActiveStyle: function (pageBtnElm) {
            pageBtnElm.addClass('active');
        },
        // callback function to remove active style for page number button.
        removeActiveStyle: function (pageBtnElm) {
            pageBtnElm.removeClass('active');
        },

        // callback function to render list.
        rowRender: function (itemData) {}	
    };
    
    function Pagination (opt) {
        this.option = $.extend({}, defOption, opt);
        this.currentPage = 0;
        this.totalPage = 0;

        if (this.option.visibleSize < 1) {
            this.option.visibleSize = 3;
        }

        this.currentPageBtn = null;
        this.pageBtns = [];
    }
    
    return Pagination;
    
} )(window);


/**
* render pagination buttons.
*/
Pagination.prototype.renderBtns = function () {
    var thisIns = this;
    this.cleanBtns();

    var btnContainer = $(this.option.btnContainerHtml);
    var btnContainerLastLeafElm = this.getLastNestedElm(btnContainer);
	
	var firstBtn = $(this.option.firstBtnHtml);
    firstBtn.click(function(event){
        event.preventDefault();	
        thisIns.onFirstBtnClick();
    });

    var lastBtn = $(this.option.lastBtnHtml);
    lastBtn.click(function(event){
        event.preventDefault();	
        thisIns.onLastBtnClick();
    });

    var preBtn = $(this.option.preBtnHtml);
    preBtn.click(function(event){
        event.preventDefault();	
        thisIns.onPreBtnClick();
    });

    var nextBtn = $(this.option.nextBtnHtml);
    nextBtn.click(function(event){
        event.preventDefault();	
        thisIns.onNextBtnClick();
    });

	btnContainerLastLeafElm.append(firstBtn);
    btnContainerLastLeafElm.append(preBtn);
    for (var i = 1; i <= this.totalPage; i++) {
        var html = this.option.pageBtnHtml.replace('{pageNum}', i);
        var pageBtn = $(html);
        pageBtn.attr('page', i);
        pageBtn.click(function(event){
            event.preventDefault();	
            thisIns.onPageBtnClick(this);
        });

        this.pageBtns.push(pageBtn);
        btnContainerLastLeafElm.append(pageBtn);
    }
    btnContainerLastLeafElm.append(nextBtn);
	btnContainerLastLeafElm.append(lastBtn);

    this.option.paginationContainer.append(btnContainer);
};
    
Pagination.prototype.getLastNestedElm = function (elm) {
    var child = elm.children();
    if (child.length == 0) {
        return elm;
    } else {
        return this.getLastNestedElm(child);
    }
};
	
Pagination.prototype.cleanBtns = function () {
    this.option.paginationContainer.html("");
    for (var i = 0; i < this.pageBtns.length; i++) {
        this.pageBtns[i].remove();
    }
    this.currentPageBtn = null;
    this.pageBtns = [];
};
	
	
/**
 * render data list.
 */
Pagination.prototype.renderList = function () {
    this.option.listContainer.html('');

    var startIndex = (this.currentPage-1) * this.option.pageSize;
    var endIndex = this.currentPage * this.option.pageSize;
    if (endIndex > this.dataList.length) {
        endIndex = this.dataList.length;
    }

    for (var i = startIndex; i < endIndex; i++) {
        var html = this.option.rowRender.call(this, this.dataList[i]);
        this.option.listContainer.append($(html));
    }
}

/**
 * click first button
 */
Pagination.prototype.onFirstBtnClick = function () {
    if (this.currentPage == 1) {
        return;
    } else {
        this.changePage(1);
    }
};

/**
 * click last button
 */
Pagination.prototype.onLastBtnClick = function () {
    if (this.currentPage == this.totalPage) {
        return;
    } else {
        this.changePage(this.totalPage);
    }
};	
	
	
/**
 * click previous button
 */
Pagination.prototype.onPreBtnClick = function () {
    if (this.currentPage == 1) {
        return;
    } else {
        var pageNum = this.currentPage - 1;
        this.changePage(pageNum);
    }
};

/**
 * click next button
 */
Pagination.prototype.onNextBtnClick = function () {
    if (this.currentPage == this.totalPage) {
        return;
    } else {
        var pageNum = this.currentPage + 1;
        this.changePage(pageNum);
    }
};
	
/**
 * click number button
 */
Pagination.prototype.onPageBtnClick = function (anchorElm) {
    var pageNum = new Number($(anchorElm).attr('page'));
    this.changePage(pageNum);
};
	
/**
 * change page
 */
Pagination.prototype.changePage = function (pageNum) {
    if (this.currentPage == pageNum) {
        return;
    }
    if (this.currentPageBtn) {
        this.option.removeActiveStyle.call(this, this.currentPageBtn);
    }

    this.currentPage = pageNum;
    this.currentPageBtn = this.pageBtns[pageNum-1];

    this.option.applyActiveStyle.call(this, this.currentPageBtn);
    
    this.handlePageNumBtnDisplay();
    this.renderList();
};

Pagination.prototype.handlePageNumBtnDisplay = function () {
    var startPage;
    var endPage;
    
    if (this.option.visibleSize > this.pageBtns.length) {
        startPage = 1;
        endPage = this.pageBtns.length;
    } else {
        startPage = this.currentPage;
        endPage = this.currentPage;
        var avaliableSize = this.option.visibleSize - 1; // exclude current page.
        
        for (var i = 0; i < avaliableSize; i++) {
            if (i % 2  == 0) {
                startPage = startPage - 1;
            } else {
                endPage = endPage + 1;
            }
        }
        
        if (startPage < 1) {
            var shift = 1 - startPage;
            startPage = startPage + shift;
            endPage = endPage + shift;
        }
        if (endPage > this.pageBtns.length) {
            var shift = endPage - this.pageBtns.length;
            startPage = startPage - shift;
            endPage = endPage - shift;
        }
    }

    // hide all page number buttons
    for (var i = 0; i < this.pageBtns.length; i++) {
        this.pageBtns[i].hide();
    }
    
    // display page number buttons
    for (var i = (startPage-1); i < endPage; i++) {
        this.pageBtns[i].show();
    }
};
	
Pagination.prototype.setPagingInfo = function (dataList) {
    this.dataList = dataList;
    if (dataList.length == 0) {
        this.totalPage = 1;
    } else {
        this.totalPage = Math.ceil(dataList.length / this.option.pageSize);
    }
};
	
/**
 * According to dataList to generate pagination
 */
Pagination.prototype.paging = function (dataList) {
    this.setPagingInfo(dataList);

    this.currentPage = 0;
    this.renderBtns();
    this.changePage(this.option.defaultPage);
};
	
/**
 * get current page number
 */
Pagination.prototype.getCurrentPage = function(){
    return this.currentPage;
};

Pagination.prototype.getTotalPage = function () {
	return this.totalPage;
};
	
Pagination.prototype.getPageSize = function () {
	return this.option.pageSize;
};
	
Pagination.prototype.refresh = function () {
	this.renderList();
};

//=========================================================================================
//=========================================================================================

/**
 * Dynamic ajax pagination.
 * Need QueryInfo object in Server side to bind paging info.
 */
var AjaxPagination = ( function(parentModule) {

    // default option (inherit Pagination)
    var defOption = {
        // ajax url
        url: '',
        // request method
        type: 'POST',
        // parameters for ajax request
        params: {},
        // the elements to be overlaied.
        overlayTargetElms: [],

        // parameter name for page size and page number.
        paraNamePageSize: 'pagingInfo.pageSize',
        paraNamePageNum: 'pagingInfo.page',

        // [require] Write your logic here to get data list from response json object.
        getResponseDataList: function(json){
            return json.data;
        },

        // [require] Write your logic here to get total count from response json object.
        getResponseTotalCount: function(json){
            return json.pagingInfo.totalCount;
        },

        // callback function, triggered after rendering list has finished.
        afterDone: function(){}
    };
    
    function AjaxPagination (opt) {
        var option = $.extend({}, defOption, opt);
        // inherit Pagination
        parentModule.call(this, option);

        var thisIns = this;
        this.ajax = new JsonAjax({
            type: this.option.type,
            overlayTargetElms: this.option.overlayTargetElms,
            done: function (data) {
                thisIns.onAjaxResponse(data);
            }
        });
    }
    
    return AjaxPagination;
    
} )(Pagination);

// inherit prototype methods.
// The Object.create() method creates a new object with the specified prototype object and properties.
AjaxPagination.prototype = Object.create(Pagination.prototype);
AjaxPagination.prototype.constructor = AjaxPagination;
// Override ---------------------------------------------------------------
	
/**
 * @Override
 */
AjaxPagination.prototype.renderList = function (dataList) {
    this.option.listContainer.html('');

    for (var i = 0; i < dataList.length; i++) {
        var html = this.option.rowRender.call(this, this.dataList[i]);
        this.option.listContainer.append($(html));
    }
}
	
/**
 * @Override
 */
AjaxPagination.prototype.setPagingInfo = function (responseJson) {
    this.dataList = this.option.getResponseDataList.call(this, responseJson);
    if (!this.dataList) {
        this.dataList = [];
    }

    var totalCount = this.option.getResponseTotalCount.call(this, responseJson);
    if (!totalCount) {
        totalCount = 0;
    }

    if (totalCount == 0) {
        this.totalPage = 1;
    } else {
        this.totalPage = Math.ceil(totalCount / this.option.pageSize);
    }
};
	
	
/**
 * @Override
 */
AjaxPagination.prototype.changePage = function (pageNum) {
    if (this.currentPage == pageNum) {
        return;
    }

    var params = this.option.params;
    params[this.option.paraNamePageNum] = pageNum;
    params[this.option.paraNamePageSize] = this.option.pageSize;
    
    this.requestPageNum = pageNum;
    this.ajax.send(this.option.url, params);
}
	
/**
 * @Override
 */
AjaxPagination.prototype.paging = function (params) {
    if (params) {
        this.setParams(params);
    }
    this.currentPage = 0;
    this.changePage(this.option.defaultPage);
};

/**
 * @Override
 */
AjaxPagination.prototype.refresh = function () {
	this.renderList(this.dataList);
};

// new functions ----------------------------------------------------------

/**
 * return the data get from ajax
 */
AjaxPagination.prototype.getResponseData = function () {
	return this.responseData;
}

/**
 * set parameters of request
 */
AjaxPagination.prototype.setParams = function (params) {
    this.option.params = params;
};

AjaxPagination.prototype.onAjaxResponse = function (responseJson) {
    this.setPagingInfo(responseJson);
    this.renderBtns();

    this.currentPage = this.requestPageNum;
    this.currentPageBtn = this.pageBtns[this.requestPageNum-1];
    this.option.applyActiveStyle.call(this, this.currentPageBtn);
	
	this.responseData = responseJson;
    this.handlePageNumBtnDisplay();
    this.renderList(this.dataList);

    this.option.afterDone.call(this);
};