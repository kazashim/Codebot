/*
	The MIT License (MIT)

	Copyright (c) 2015 Fernando Bevilacqua

	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so,
	subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * A plugin that enables Codebot to work with AS3 projects.
 */
var FlashToolsPlugin = function() {
    const API_URL   = 'plugins/flash-tools/api.php';

    this.id         = 'cc.codebot.flash.tools';

    var mSelf       = null;
    var mContext    = null;

    var runRemoteBuild = function(theCallback) {
        console.debug('Asking for remote build...');

        $.ajax({
            url: API_URL,
            method: 'post',
            data: {method: 'build', width: 640, height: 480},
            dataType: 'json'
        }).done(function(theData) {
            theCallback(theData);

        }).fail(function(theJqXHR, theTextStatus, theError) {
            console.error('Buil problem: ' + theTextStatus + ', ' + theError);
        });
    };

    this.init = function(theContext) {
        mSelf = this;
        mContext = theContext;

        mContext.ui.addButton({ icon: '<i class="fa fa-play"></i>', action: mSelf.build });
        mContext.ui.addButton({ icon: '<i class="fa fa-wrench"></i>', action: mSelf.settings });
    };

    this.build = function(theContext, theButton) {
        var aTab = null;

        aTab = mContext.ui.tabs.add({
            favicon: 'file-text-o', // TODO: dynamic icon?
            title: 'Build',
            file: 'Build.log',
            path: 'build.log',
            node: null,
            editor: null
        });

        theButton.html('<i class="fa fa-circle-o-notch fa-spin"></i>');

        aTab.editor = mContext.editors.create(aTab, 'Build started...', {name: 'Mode.swf'});

        runRemoteBuild(function(theData) {
            console.debug('Remote build received!', theData);

            theButton.html('<i class="fa fa-play"></i>');

            if(theData.log.length == 2) {
                aTab.editor.renderSWFByURL(theData.url, 640, 480);
            } else {
                aTab.editor.showMessage(theData.log.join('\n'));
            }
        });
    };

    this.settings = function(theContext, theButton) {
        mContext.ui.showDialog({
            title: 'Settings',
            content: 'Show project settings.',
            buttons: {
                'Ok, got it!': {dismiss: true}
            }
        });
    };

};

CODEBOT.addPlugin(new FlashToolsPlugin());
