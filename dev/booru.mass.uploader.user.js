// ==UserScript==
// @name		Booru Mass Uploader
// @description	Add ability to bulk upload images to your booru
// @namespace 	https://github.com/Seedmanc/Booru-mass-uploader
// @version     1.4.0
// @author		Seedmanc
// @include     http://*.booru.org/index.php*
// @include     http://rule34.xxx/index.php*
// @include 	https://gelbooru.com/index.php*
// @include     http://safebooru.org/index.php*
// @include		https://moe.dev.myconan.net/*
// @include		http://behoimi.org/*
// @include		https://chan.sankakucomplex.com/*
// @include		http*://*atfbooru.ninja/*
// @include		http://danbooru.donmai.us/*
// @exclude		*.png
// @exclude		*.jp*g
// @exclude		*.gif
// @exclude		*.webm

// you can add any boorus of your choice by following the pattern

// @grant 		none
// @run-at		document-end
// @noframes
// ==/UserScript==

if (window.top != window.self) {
    throw 'no iframes';
}

function activateScripts(scripts, i) {
    var node   = scripts[i],
        parent = node.parentElement,
        d      = document.createElement('script');

    d.async = node.async;
    d.src = node.src;
    d.onload = function () {
        if (i < scripts.length - 1) {
            activateScripts(scripts, i + 1);
        }
    };
    parent.insertBefore(d, node);
    parent.removeChild(node);
}

if (~document.location.href.indexOf('s=mass_upload')) {
    var script = document.createElement('script');

    if (/https:\/\/\w+\.booru\.org\//i.test(document.location.href)) {
        document.location.href = document.location.href.replace('https:','http:');
    }   //booru.org does not support https uploading

    document.body.innerHTML = '<img src="http://localhost:8080/spinner.gif"/>';
    script.src = 'http://localhost:8080/js/index.html.js?v=1.4.0';
    script.onload = function () {
        var scripts = document.getElementsByTagName('script');

        activateScripts(scripts, 0);
    };
    document.body.appendChild(script);

} else {
    var navbar = document.getElementById('navbar') ||
        document.getElementsByClassName('flat-list2')[0] ||
        document.querySelector('#main-menu > ul') ||
        document.querySelector('nav > menu');
    var li = document.createElement("li");
    var a = document.createElement("a");
    var token = document.querySelector('meta[name="csrf-token"]');

    token = token && token.content;
    if (token) {
        localStorage.setItem('auth_token', token);
    }

    if (document.querySelector('[src*="moe-legacy"]') || document.querySelector('html.action-post') || document.querySelector('[href*="/post/upload"]')) {
        localStorage.setItem('current', 'moebooru');
    } else if (document.querySelector('[href*="/uploads/new"]') || ~document.documentElement.innerHTML.indexOf('Running Danbooru')) {
        localStorage.setItem('current', 'danbooru');
    }

    a.style.fontWeight = 'bold';
    a.appendChild(document.createTextNode('Mass Upload'));
    a.href = document.location.protocol + '//' + document.location.host + '/index.php?page=post&s=mass_upload';

    if (navbar) {
        li.appendChild(a);
        navbar.appendChild(li);
    } else {
        a.style.display='block';
        a.style.margin='auto';
        a.style.width='105px';
        document.body.insertBefore(a, document.body.firstChild);
    }
}
