/*
* 2007-2014 PrestaShop
*
* NOTICE OF LICENSE
*
* This source file is subject to the Academic Free License (AFL 3.0)
* that is bundled with this package in the file LICENSE.txt.
* It is also available through the world-wide-web at this URL:
* http://opensource.org/licenses/afl-3.0.php
* If you did not receive a copy of the license and are unable to
* obtain it through the world-wide-web, please send an email
* to license@prestashop.com so we can send you a copy immediately.
*
* DISCLAIMER
*
* Do not edit or add to this file if you wish to upgrade PrestaShop to newer
* versions in the future. If you wish to customize PrestaShop for your
* needs please refer to http://www.prestashop.com for more information.
*
*  @author PrestaShop SA <contact@prestashop.com>
*  @copyright  2007-2014 PrestaShop SA
*  @license    http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
*  International Registered Trademark & Property of PrestaShop SA
*/

var responsiveflagMenu = false;
var categoryMenu = $('ul.sf-menu');
var mCategoryGrover = $('.sf-contener .cat-title');

$(document).ready(function(){
	setCategoryParentClass();
	responsiveMenu();
	$(window).resize(responsiveMenu);

	var submenus = $('ul.submenu-container');
	var links = submenus.prev();
	console.log(submenus);
	console.log(submenus.length);
	console.log(links);
	console.log(links.length);
	links.each(function(){
		var menu = $(this);
		var href = $(this).parent().find('ul.submenu-container li:first-child a').attr('href');
		var isshop = $(this).parent().find('#category-thumbnail');
		if (isshop.length < 1)
			menu.attr('href', href);

		console.log(href);
		console.log(isshop);
		console.log(isshop.length);
	});
});

function setCategoryParentClass()
{
	var li = $('ul.sf-menu .sfHoverForce').parents('li');
	li.each(function(){
		if ( $(this).parent().hasClass('sf-menu') )
		{
			$(this).addClass('parent-page');
		}
	});
}

// check resolution
function responsiveMenu()
{
   if ($(document).width() <= 767 && responsiveflagMenu == false)
	{
		menuChange('enable');
		responsiveflagMenu = true;
	}
	else if ($(document).width() >= 768)
	{
		menuChange('disable');
		responsiveflagMenu = false;
	}
}

// init Super Fish Menu for 767px+ resolution
function desktopInit()
{
	mCategoryGrover.off();
	mCategoryGrover.removeClass('active');
	$('.sf-menu > li > ul').removeClass('menu-mobile').parent().find('.menu-mobile-grover').remove();
	$('.sf-menu').removeAttr('style');
	categoryMenu.superfish('init');
	//add class for width define
	$('.sf-menu > li > ul').addClass('submenu-container clearfix'); 
	 // loop through each sublist under each top list item
    $('.sf-menu > li > ul').each(function(){
        i = 0;
        //add classes for clearing
        $(this).each(function(){ 
                if ($(this).attr('id') != "category-thumbnail") 
                {
                    i++;
                    if(i % 2 == 1)
                        $(this).addClass('first-in-line-xs');
                    else if (i % 5 == 1)
                        $(this).addClass('first-in-line-lg');
                }
        });
    });
}

function mobileInit()
{
	categoryMenu.superfish('destroy');
	$('.sf-menu').removeAttr('style');

	mCategoryGrover.on('click', function(){
		$(this).toggleClass('active').parent().find('ul.menu-content').stop().slideToggle('medium');
	});

	$('.sf-menu > li > ul').addClass('menu-mobile clearfix').parent().prepend('<span class="menu-mobile-grover"></span>');

	$(".sf-menu .menu-mobile-grover").on('click touchstart', function(){
		var catSubUl = $(this).next().next('.menu-mobile');
		if (catSubUl.is(':hidden'))
		{
			catSubUl.slideDown();
			$(this).addClass('active');
		}
		else
		{
			catSubUl.slideUp();
			$(this).removeClass('active');
		}
		return false;
	});

	if ('ontouchstart' in document.documentElement)
	{
		$('#block_top_menu > ul:first > li > a').on('click', function(e){
			if ($(this).parent('li').find('ul').length)
				e.preventDefault();
		});
	}
}

// change the menu display at different resolutions
function menuChange(status)
{
	status == 'enable'? mobileInit(): desktopInit();
}
