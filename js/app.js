(function(){
    var editor = ace.edit("editor");
    //editor.setTheme("ace/theme/twilight");
    var JavaScriptMode = ace.require("ace/mode/javascript").Mode;
    editor.getSession().setMode(new JavaScriptMode());

    var tab;
    var templatePath;
    var content = $('#content');
    var contentOverlay = new LoadingOverlay(content);

    $('ul[name=navbar] a').click(function (e) {
        e.preventDefault();
        tab = $(this);
        
        content.html("");
        templatePath = 'template/' + tab.attr('template') + '.html';
        
        content.load(templatePath, function() {
            var code = $('script').text();
            editor.setValue(code, -1);
            eval(code);
        });
    });

    var toolbar = $('div[role=toolbar]');
    toolbar.find('button[name=run]').click(function(){
        contentOverlay.show();
        content.load(templatePath, function(){
            var code = editor.getValue();
            eval(code);
            contentOverlay.remove();
        });
    });
    toolbar.find('button[name=refresh]').click(function(){
        tab.click();
    });
    toolbar.find('button[name=clear]').click(function(){
        editor.setValue('', -1);
    });
    
    
    $('ul[name=navbar] a:first').click();
})();