<?php
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

@include_once dirname(__FILE__).'/../../config.local.php';
include_once dirname(__FILE__).'/../../config.php';

require_once dirname(__FILE__).'/../Database.class.php';
require_once dirname(__FILE__) . '/3rdparty/querypath/qp.php';

$aQp 		= htmlqp($_REQUEST['url']);

$aTitle 	= $aQp->find('div.group-header h2')->text();
$aAuthor 	= $aQp->find('div.group-left span.username')->text();
$aLicenses	= array();

$aQp->find('div.field-name-field-art-licenses div.license-icon a')->each(function($theIndex, $theElement) {
	global $aLicenses;
	$aLicenses[] = $theElement->getAttribute('href');
});

$aPreviews 	= array();

$aQp->find('div.field-name-field-art-preview div.field-item img')->each(function($theIndex, $theElement) {
	global $aPreviews;
	$aPreviews[] = $theElement->getAttribute('src');
});

$aDescription	= $aQp->find('div.field-type-text-with-summary div.field-item')->text();
$aFiles			= array();

$aQp->find('div.field-name-field-art-files div.field-item a')->each(function($theIndex, $theElement) {
	global $aFiles;
	$aFiles[] = array('name' => $theElement->textContent, 'url' => $theElement->getAttribute('href'));
});

$aQuery = Database::instance()->prepare("INSERT INTO assets (title, author, channel, license, thumbnail, preview, files, description, attribution) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
$aQuery->execute(array($aTitle, $aAuthor, 'http://opengameart.org', 1, $aPreviews[0], serialize($aPreviews), serialize($aFiles), $aDescription, 'Atrribution: '));

?>
