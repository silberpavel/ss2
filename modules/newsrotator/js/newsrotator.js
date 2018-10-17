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
*
*  @author George Shabataev
*  @copyright  George Shabataev
*  @version  Release: $Revision$
*  @license    http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
*/

jQuery(document).ready(function($){
	if (typeof(newsrotator.speed) == 'undefined')
		newsrotator.speed = 500;
	if (typeof(newsrotator.pause) == 'undefined')
		newsrotator.pause = 3000;
	if (typeof(newsrotator.loop) == 'undefined')
		newsrotator.loop = true;
	if (typeof(newsrotator.width) == 'undefined')
		newsrotator.width = 779;

	// is rtl
	var rtl = false;
	if (typeof(newsrotator.is_rtl) != 'undefined' && newsrotator.is_rtl == 1) 
		rtl = true;

	$('.newsrotator-slider-slider').each(function(){
		var slider = $(this);
		var slides = slider.find('ul.slides');
		var options = {
			rtl: rtl,
			slidesToShow: 4,
			slidesToScroll: 4,
			appendArrows: slider,
			autoplaySpeed: newsrotator.speed,
			//infinite: newsrotator.loop,
			infinite: false,
			responsive: [
				{
					breakpoint: 1200,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 3
					}
				},
				{

					breakpoint: 801,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 2
					}

				},
				{

					breakpoint: 481,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1
					}

				}
			]
		}
		slides.slick(options);
	});

	$('.newsrotator-description').click(function () {
		window.location.href = $(this).prev('a').prop('href');
	});
});