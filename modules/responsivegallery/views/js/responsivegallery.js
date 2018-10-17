/*
 *  @license
 */

$(function(){
    //Functions
	function getPresentScreenConfiguration(){
		var galleryWidth =$(kiwik.responsivegallery.GALLERY_SELECTOR).width();
		if(galleryWidth == 0)
			galleryWidth = $('body').width();
		var result = null;
		for(var id in kiwik.responsivegallery.SEUILS){
			if(galleryWidth < kiwik.responsivegallery.SEUILS[id].maxWidth){
				result = kiwik.responsivegallery.SEUILS[id];
				break;
			}
		}
		result.galleryWidth = galleryWidth;
		return result;
	}

	function refreshPositions(){
		//récupération du seuil actuel
		var options = getPresentScreenConfiguration();

		//on place toutes les images par rapport à ça
		var items = $(kiwik.responsivegallery.GALLERY_SELECTOR + ' li');
		var count = 0;
		var itemWidth = parseInt(options.galleryWidth / options.nbPerLine, 10) - kiwik.responsivegallery.HORIZONTAL_MARGIN*2;

		var hauteurMax = 0;

		//on retire toutes les colonnes de tous les elements pour faire un gros reset
		items.attr('data-column',false);

		items.each(function(){
			//REFRESH DU BLOC
			$(this).css('width', itemWidth + 'px');

			//on choisi dans quelle colonne on le met.
			var highest_bottom = null;
			var objectJustAbove = null;
			var column_to_put = 0;
			for(var i = 0 ; i < options.nbPerLine; i++) {
				var current_lowest_bottom = null;
				var currentObjectAbove = null;
				$(kiwik.responsivegallery.GALLERY_SELECTOR + ' li[data-column='+i+']').each(function(){
					var item_bottom = parseInt($(this).css('top'),10) + $(this).height();
					if(current_lowest_bottom==null || item_bottom > current_lowest_bottom) {
						current_lowest_bottom = item_bottom;
						currentObjectAbove = $(this);
					}
				});
				if((highest_bottom==null&&currentObjectAbove!=null) || current_lowest_bottom < highest_bottom) {
					column_to_put = i;
					highest_bottom = current_lowest_bottom;
					objectJustAbove = currentObjectAbove;
				}
			}

			if ( $('body').hasClass('rtl') )
				$(this).css('right', ( column_to_put/*(count%options.nbPerLine)*/*(itemWidth+kiwik.responsivegallery.HORIZONTAL_MARGIN*2) + kiwik.responsivegallery.HORIZONTAL_MARGIN) + 'px');
			else
				$(this).css('left', ( column_to_put/*(count%options.nbPerLine)*/*(itemWidth+kiwik.responsivegallery.HORIZONTAL_MARGIN*2) + kiwik.responsivegallery.HORIZONTAL_MARGIN) + 'px');

			$(this).attr('data-column', column_to_put);
			$(this).css('height', $(this).find('img').height()+'px');
			if(objectJustAbove == null)
				$(this).css('top', '0px');
			else{
				//var objectJustAbove = $( items.get(count-options.nbPerLine) );
				var previousOffset = parseInt(objectJustAbove.css('top'),10) + objectJustAbove.height();
				$(this).css('top', (previousOffset+kiwik.responsivegallery.VERTICAL_MARGIN*2) + 'px');
			}
			//REFRESH DU TEXTE
			var innerText = $(this).find('.text-inner');
			var innerHeight = $(innerText).parent().height() - kiwik.responsivegallery.INNER_MARGIN*2;
			innerText.height( innerHeight );
			innerText.css('margin', kiwik.responsivegallery.INNER_MARGIN+'px');
			//innerText.css('line-height', innerHeight +'px');

			hauteurMax = Math.max(hauteurMax, parseInt($(this).css('top'),10) + $(this).height());

			count++;
		});
		//on adapte la gallery a la hauteur max qu'on vient de créer
		$(kiwik.responsivegallery.GALLERY_SELECTOR).height(hauteurMax);

	}

    function keepTitle(elem){
        // Get the current title
        var titleTmp = $(elem).attr("title");
        // Store it in a temporary attribute
        $(elem).attr("tmp_title", titleTmp);
        // Set the title to nothing so we don't see the tooltips
        $(elem).attr("title","");
    }

    function retrieveTitle(elem){
        // Retrieve the title from the temporary attribute
        var titleTmp = $(elem).attr("tmp_title");
        // Return the title to what it was
        $(elem).attr("title", titleTmp);
    }

	function buildInnerTexts(page){
        $(kiwik.responsivegallery.GALLERY_SELECTOR + ' li.page-'+page).each(function() {
            var title = $(this).attr('data-title');
            var link = $(this).find('a').attr('href');

            //Suppression de title qui s'affiche en rollover
            $(this).find('a').first().hover(function(e){ keepTitle(e.currentTarget); }, function(e){ retrieveTitle(e.currentTarget);});
            $(this).find('a').first().click(function(e){ retrieveTitle(e.currentTarget); });

            if (title != undefined && title != '') {
                // On affiche la légende
                if ($(this).attr("data-legend-hover") == 1) {
                    $(this).find('a').append('<div class="wrapper-inner"><div class="text-inner">' + title + '</div></div>');
                }
                element = $('<a href="#" class="fancy-group gallery-zoom" rel="group" title="' + title.replace(/"/g, "'") + '" style="bottom:' + kiwik.responsivegallery.INNER_MARGIN + 'px;left:' + kiwik.responsivegallery.INNER_MARGIN + 'px;"></a>');
                element.hover(function(e){ keepTitle(e.currentTarget); }, function(e){ retrieveTitle(e.currentTarget);})
                    .click(function(e){ retrieveTitle(e.currentTarget); });
                $(this).find('a').after(element);
            }
            else {
                $(this).find('a').after('<a href="#" class="fancy-group gallery-zoom" rel="group" style="bottom:' + kiwik.responsivegallery.INNER_MARGIN + 'px;left:' + kiwik.responsivegallery.INNER_MARGIN + 'px;"></a>');
            }

            //ajout fancybox
			if(kiwik.responsivegallery.FANCYBOX_ENABLED){
                //si on a pas de lien sur l'item on met la loupe partout
				if(link === undefined || link === '' || link === '#'){
					var _this=this;
					$(this).find('a').each(function(){
						var src = $(_this).find('img').attr('src');
						var path = src.substr(0, src.lastIndexOf('/'));
						var filename = src.substr(src.lastIndexOf('/'));;
						$(this).attr('href', path+filename).addClass('fancy-group').attr('rel','group');//.fancybox({type:'image'});
					});
				}
				//sinon juste sur la loupe
				else{
                    if (title != undefined && title != '') {
                        element = $('<a href="#" class="fancy-group gallery-fake" title="' + title.replace(/"/g, "'") + '" rel="group"></a>');
                        element.hover(function(e){ keepTitle(e.currentTarget); }, function(e){ retrieveTitle(e.currentTarget);})
                            .click(function(e){ retrieveTitle(e.currentTarget); });
                        $(this).find('a').first().after(element);
                    }
                    else
                        $(this).find('a').first().after('<a href="#" class="fancy-group gallery-fake" rel="group"></a>');

                    var src = $(this).find('img').attr('src');
					var path = src.substr(0, src.lastIndexOf('/'));
					var filename = src.substr(src.lastIndexOf('/'));;
                    $(this).find('.gallery-zoom').attr('href', path+filename);//.fancybox({type:'image'});
                    $(this).find('.gallery-fake').attr('href', path+filename);//.fancybox({type:'image'});
				}
                //On active la légende sous la photo
                if (kiwik.responsivegallery.RG_LEGEND_ON_PHOTO)
                    optionTitre = { type : 'inside' }
                else
                    optionTitre = null;

                //tentatives de fix du 10/12/2015 pour afficher qu'une fancybox par image
                //c'est mal mais vu le bazar au dessus je sais pas quoi changer sans refaire les tests dans toutes les combinaisons possibles + sur 1.5 et 1.6
                var link = '';
                $(this).find('a[rel="group"]').each(function(){
                	link = $(this).attr('href');
                	$(this).removeClass('fancy-group').attr('rel','');
                	$(this).click(function(){
                		$(this).parent().find('.trigger-fancybox').click();
                		return false;
                	});
                });
                $(this).append('<a href="'+link+'" '+(title?'title="' + title.replace(/"/g, "'")+'"':'')+' class="fancy-group trigger-fancybox" rel="group"></a>');

                //On active fancybox sur les liens
                $("a.fancy-group").fancybox({
                    type:'image',
                    helpers : {
                        title : optionTitre
                    }
                });


            }
		});
	}

	var loaderHtml = '<div id="gallery-loader"></div>';
	var isLoading = true;

	//Events and handlings
	$(function(){
		$(kiwik.responsivegallery.GALLERY_SELECTOR).after(loaderHtml);

		$(window).on('resize', function(){
			refreshPositions();
		});
		$('body').on('mouseenter', kiwik.responsivegallery.GALLERY_SELECTOR + ' li',function(){
			$(this).find('.wrapper-inner, a.gallery-zoom').stop(true).fadeIn();
		});

		$('body').on('mouseleave', kiwik.responsivegallery.GALLERY_SELECTOR + ' li',function(){
			$(this).find('.wrapper-inner, a.gallery-zoom').stop(true).fadeOut();
		});

		//infinite scrolling
		var offset = 0;
		function refreshOffset(){
			offset = $(kiwik.responsivegallery.GALLERY_SELECTOR + '> li:last').offset();
		}

		$(window).scroll(function(){
			refreshOffset();
			if( offset != undefined && offset.top-$(window).height() <= $(window).scrollTop() && !isLoading ){
				isLoading = true;
				kiwik.responsivegallery.RG_CURRENT_PAGE++;

				$.get(kiwik.responsivegallery.ajax_link, {'ajax':1, 'id_gallery':kiwik.responsivegallery.current_gallery, 'page':kiwik.responsivegallery.RG_CURRENT_PAGE}, function(data){
					if($(data).length != 0){
						$('#gallery-loader').slideDown();
						$(kiwik.responsivegallery.GALLERY_SELECTOR).append(data);
						preloadPage(kiwik.responsivegallery.RG_CURRENT_PAGE);
					}
				});
			}
		});
		preloadPage(1);
	});

	function showPage(page){
		$('#gallery-loader').slideUp();
		$(kiwik.responsivegallery.GALLERY_SELECTOR + ' li.page-'+page).fadeIn(kiwik.responsivegallery.FADEIN_SPEED);
		buildInnerTexts(page);
		refreshPositions();
		isLoading=false;
	}

	function preloadPage(page){
		var nbLoaded = 0;
		if($(kiwik.responsivegallery.GALLERY_SELECTOR + ' li.page-'+page+' img').length == 0)
			$('#gallery-loader').slideUp();

		$(kiwik.responsivegallery.GALLERY_SELECTOR + ' li.page-'+page+' img').each(function(){

			if(!this.complete){
				$(this).on('load', function(){
					nbLoaded++;
					if(nbLoaded == $(kiwik.responsivegallery.GALLERY_SELECTOR + ' li.page-'+page+' img').length){
						showPage(page);
					}
				});
			}
			else{
				nbLoaded++;
				if(nbLoaded == $(kiwik.responsivegallery.GALLERY_SELECTOR + ' li.page-'+page+' img').length){
					showPage(page);
				}
			}
		});
	}

});