/*
	The MIT License (MIT)

	Copyright (c) 2013 Fernando Bevilacqua

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

var CODEBOT = CODEBOT || {};

CODEBOT.ui = new function() {
	var mTabs 				= null;
	var mCurrentTab 		= null;
	var mTextArea 			= null;
	
	var filePanelClick = function(theEvent, theItem) {
	};
	
	var filePanelDoubleClick = function(theEvent, theItem) {
		var aData = theItem.node.data;
		
		console.debug('File panel double click: ' + theEvent + ' , folder: ' + theItem.node.folder);
		
		if(!theItem.node.folder) {
			openTab(aData);
		}
	};
	
	var transform3d = function(theElementId, theX, theY, theZ) {
		document.getElementById(theElementId).style.WebkitTransform = 'translate3d('+ theX +','+ theY +','+ theZ +')';
	};
	
	var tabClosed = function(theTab) {
		var aData = theTab.data('tabData').data;
		var aEditor = aData.editor;
		var aEditorNode = aEditor.getWrapperElement();
		
		// TODO: make a pretty confirm dialog.
		// TODO: only confirm if content has changed.
		if(confirm("Save content before closing?")) {
			CODEBOT.io.writeFile(aData.path, aEditor.getDoc().getValue());
		}

		aEditorNode.parentNode.removeChild(aEditorNode);
		aData.editor = null;
		
		console.debug('Tab closed', theTab.index(), ', title:', $.trim(theTab.text()), ', data:', aData);
	};
	
	var tabDeactivated = function(theTab) {
		var aTabEditor = null;
		
		aTabEditor = theTab.data('tabData').data.editor;
		aTabEditor.getWrapperElement().style.display = 'none';
		
		console.debug('Tab deactivated', theTab.index(), ', title:', $.trim(theTab.text()), ', data:', theTab.data('tabData').data);
	};
	
	var tabActivated = function(theTab) {
		var aTabEditor = null;
		
		mCurrentTab = theTab;
		
		// Show the content of the newly active tab.
		aTabEditor = mCurrentTab.data('tabData').data.editor;
		aTabEditor.getWrapperElement().style.display = 'block';
		
		// Index: mCurrentTab.index()
		// Title: $.trim(mCurrentTab.text())
		// Data: mCurrentTab.data('tabData').data
		console.debug('Tab activated', mCurrentTab.index(), ', title:', $.trim(mCurrentTab.text()), ', data:', mCurrentTab.data('tabData').data);
	};
	
	var openTab = function(theNodeData) {
		CODEBOT.io.openFile(theNodeData.path, function(theData) {
			mTabs.add({
				favicon: 'http://g.etfv.co/https://www.hubspot.com',
				title: theNodeData.name,
				data: {
					editor: CodeMirror(document.getElementById('working-area'), {
						mode: 'javascript', // TODO: dynamic mode?
						value: theData
					}),
					file: theNodeData.name,
					path: theNodeData.path
				}
			});
		});
	};
		
	this.showConfigDialog = function(theStatus, theContent) {
		if(theStatus) {
			$('#config-dialog').html(theContent);
			
			// TODO: remove the hardcoded value
			transform3d('content', '-600px', '0', '0');
			transform3d('config-dialog', '-600px', '0', '0');
		} else {
			transform3d('content', '0', '0', '0');
			transform3d('config-dialog', '0', '0', '0');
		}
	};
	
	this.refreshFilesPanel = function(theData) {
		if(theData && theData.length > 0) {
			$("#folders").fancytree({
				click: filePanelClick,
				dblclick: filePanelDoubleClick,
				source: theData,
				checkbox: false,
				selectMode: 3
			});
			
			var aDirs = $("#folders").fancytree("getTree");
			aDirs.reload();
			
		} else {
			$("#folders").html('<div class="">no</div>');
		}
	};

	this.addPlugin = function(theId, theObj) {
		$('#config-bar').html(
			$('#config-bar').html() +
			'<a href="#" data-plugin="'+theId+'"><i class="fa fa-'+theObj.icon+'"></i></a>'
		);
		
		$('#config-bar a').click(function() {
			CODEBOT.handlePluginClick($(this).data('plugin'));
		});
	};
	
	this.init = function() {
		// TODO: read data from disk, using last open directory.
		CODEBOT.io.openDirectory('/my/dummy/path/', CODEBOT.ui.refreshFilesPanel);
		
		// get tab context from codebot.ui.tabs.js
		mTabs = window.chromeTabs;
		
		mTabs.init({
			container: '.chrome-tabs-shell',
			minWidth: 20,
			maxWidth: 100,
			
			deactivated: tabDeactivated,
			activated: tabActivated,
			closed: tabClosed
		});
	};
};