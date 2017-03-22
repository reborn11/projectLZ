/*
 * Justified Gallery - v3.2.0
 * http://miromannino.com/projects/justified-gallery/
 * Copyright (c) 2014 Miro Mannino
 * Licensed under the MIT license.
 */
(function($) {

	/* Events
		jg.complete : called when all the gallery has been created
		jg.resize : called when the gallery has been resized
	*/

	$.fn.justifiedGallery = function (arg) {

		// Default options
		var defaults = {
			sizeRangeSuffixes : {
				'lt100': '_t', 
				'lt240': '_m', 
				'lt320': '_n', 
				'lt500': '', 
				'lt640': '_z',
				'lt1024': '_b'
			},
			rowHeight : 120,
			maxRowHeight : 0, //negative value = no limits, 0 = 1.5 * rowHeight
			margins : 1,
			lastRow : 'nojustify', // or can be 'justify' or 'hide'
			justifyThreshold: 0.35, // if available space / row width <= 0.35 it will be always justified
															// (lastRow setting is not considered)
			cssAnimation: false,
			captionsAnimationDuration : 500,
			captionsVisibleOpacity : 0.7, 
			imagesAnimationDuration : 300,
			fixedHeight : false,
			captions : true,
			rel : null, //rewrite the rel of each analyzed links
			target : null, //rewrite the target of all links
			extension : /\.[^.]+$/,
			refreshTime : 250,
			randomize : false
		};

		function getSuffix(width, height, context) {
			var longestSide;
			longestSide = (width > height) ? width : height;
			if (longestSide <= 100) {
				return context.settings.sizeRangeSuffixes.lt100;
			} else if (longestSide <= 240) {
				return context.settings.sizeRangeSuffixes.lt240;
			} else if (longestSide <= 320) {
				return context.settings.sizeRangeSuffixes.lt320;
			} else if (longestSide <= 500) {
				return context.settings.sizeRangeSuffixes.lt500;
			} else if (longestSide <= 640) {
				return context.settings.sizeRangeSuffixes.lt640;
			} else {
				return context.settings.sizeRangeSuffixes.lt1024;
			}
		}

		function onEntryMouseEnterForCaption (ev) {
			var $caption = $(ev.currentTarget).find('.caption');
			if (ev.data.settings.cssAnimation) {
				$caption.addClass('caption-visible').removeClass('caption-hidden');
			} else {
				$caption.stop().fadeTo(ev.data.settings.captionsAnimationDuration, ev.data.settings.captionsVisibleOpacity);
			}
		}

		function onEntryMouseLeaveForCaption (ev) {
			var $caption = $(ev.currentTarget).find('.caption');
			if (ev.data.settings.cssAnimation) {
				$caption.removeClass('caption-visible').removeClass('caption-hidden');
			} else {
				$caption.stop().fadeTo(ev.data.settings.captionsAnimationDuration, 0.0);
			}
		}

		function displayEntry($entry, x, y, imgWidth, imgHeight, rowHeight, context) {
			var $image = $entry.find('img');
			//$image.css('width', imgWidth);
			//$image.css('height', imgHeight);
			//$entry.width(imgWidth);
			//$entry.height(rowHeight);
			//$entry.css('top', y);
			//$entry.css('left', x);

			//DEBUG// console.log('displayEntry: $image.width() = ' + $image.width() + ' $image.height() = ' + $image.height());

			// Image reloading for an high quality of thumbnails
			var imageSrc = $image.attr('src');
			var newImageSrc = imageSrc.replace(context.settings.extension, '').replace(context.usedSizeRangeRegExp, '') +
								getSuffix(imgWidth, imgHeight, context) +
								imageSrc.match(context.settings.extension)[0];

			$image.one('error', function () {
				//DEBUG// console.log('revert the original image');
				$image.attr('src', $image.data('jg.originalSrc')); //revert to the original thumbnail, we got it.
			});

			var loadNewImage = function () {
				if (imageSrc !== newImageSrc) { //load the new image after the fadeIn
					$image.attr('src', newImageSrc);
				}
			};

			if (context.settings.cssAnimation) {
				$entry.addClass('entry-visible');
				loadNewImage();
			} else {
				$entry.stop().fadeTo(context.settings.imagesAnimationDuration, 1.0, loadNewImage);
			}

			// Captions ------------------------------
			//TODO option for caption always visible
			var captionMouseEvents = $entry.data('jg.captionMouseEvents');
			if (context.settings.captions === true) {
				var $imgCaption = $entry.find('.caption');
				//if ($imgCaption.length === 0) { // Create it if it doesn't exists
				//	var caption = $image.attr('alt');
				//	if (typeof caption === 'undefined') caption = $entry.attr('title');
				//	if (typeof caption !== 'undefined') { // Create only we found something
				//		$imgCaption = $('<div class="caption">' + caption + '</div>');
				//		$entry.append($imgCaption);
				//	}
				//}

				// Create events (we check again the $imgCaption because it can be still inexistent)
				if ($imgCaption.length !== 0 && typeof captionMouseEvents === 'undefined') {
					captionMouseEvents = {
						mouseenter: onEntryMouseEnterForCaption,
						mouseleave: onEntryMouseLeaveForCaption
					};
					$entry.on('mouseenter', undefined, context, captionMouseEvents.mouseenter);
					$entry.on('mouseleave', undefined, context, captionMouseEvents.mouseleave);
					$entry.data('jg.captionMouseEvents', captionMouseEvents);
				}
			} else {
				if (typeof captionMouseEvents !== 'undefined') {
					$entry.off('mouseenter', undefined, context, captionMouseEvents.mouseenter);
					$entry.off('mouseleave', undefined, context, captionMouseEvents.mouseleave);
					$entry.removeData('jg.captionMouseEvents');
				}
			}

		}

		function prepareBuildingRow(context, isLastRow) {
			var i, $entry, $image, stdImgW, newImgW, newImgH, justify = true;
			var minHeight = 0;
			var availableWidth = context.galleryWidth;
			var extraW = availableWidth - context.buildingRow.width - 
							((context.buildingRow.entriesBuff.length - 1) * context.settings.margins);

			//Skip the last row if we can't justify it and the lastRow == 'hide'
			if (isLastRow && context.settings.lastRow === 'hide' && (extraW / availableWidth > context.settings.justifyThreshold)) {
				for (i = 0; i < context.buildingRow.entriesBuff.length; i++) {
					$entry = context.buildingRow.entriesBuff[i];
					if (context.settings.cssAnimation) 
						$entry.removeClass('entry-visible');						
					else
						$entry.stop().fadeTo(0, 0);
				}
				return -1;
			}

			// With lastRow = nojustify, justify if (extraW / availableWidth <= context.settings.justifyThreshold)
			if (isLastRow && context.settings.lastRow === 'nojustify' && (extraW / availableWidth > context.settings.justifyThreshold)) 
				justify = false;

			//DEBUG// console.log('prepareBuildingRow: availableWidth: ' + availableWidth + ' extraW: ' + extraW);

			for (i = 0; i < context.buildingRow.entriesBuff.length; i++) {
				$image = context.buildingRow.entriesBuff[i].find('img');
				stdImgW = Math.ceil($image.data('jg.imgw') / ($image.data('jg.imgh') / context.settings.rowHeight));

				if (justify) {
					if (i < context.buildingRow.entriesBuff.length - 1) {
						// Scale proportionally of the image aspect ratio (the more is long, the more can be extended)
						newImgW = stdImgW + Math.ceil(stdImgW / context.buildingRow.width * extraW);
					} else {
						newImgW = availableWidth;
					}

					// Scale factor for the new width is (newImgW / stdImgW), hence:
					newImgH = Math.ceil(context.settings.rowHeight * (newImgW / stdImgW));

					// With fixedHeight the newImgH >= rowHeight. In some cases here this is not satisfied (due to the justification)
					if (context.settings.fixedHeight && newImgH < context.settings.rowHeight) {
						newImgW = stdImgW;
						newImgH = context.settings.rowHeight;
					}
				} else {
					newImgW = stdImgW;
					newImgH = context.settings.rowHeight;
				}

				$image.data('jg.imgw', newImgW);
				$image.data('jg.imgh', newImgH);

				//DEBUG// console.log($image.attr('alt') + ' new jq.imgw = ' + $image.data('jg.imgw') + ' new jg.imgh = ' + $image.data('jg.imgh'));
				
				availableWidth -= newImgW + ((i < context.buildingRow.entriesBuff.length - 1) ? context.settings.margins : 0);
				if (i === 0 || minHeight > newImgH) minHeight = newImgH;
			}

			//DEBUG// console.log('availableWidth: ' + availableWidth + ' extraW: ' + extraW);

			if (context.settings.fixedHeight) minHeight = context.settings.rowHeight;
			return minHeight;
		}

		function rewind(context) {
			context.lastAnalyzedIndex = -1;
			context.buildingRow.entriesBuff = [];
			context.buildingRow.width = 0;
			context.offY = 0;
			context.firstRowFlushed = false;
		}

		function flushRow(context, isLastRow) {
			var $entry, $image, minHeight, offX = 0;

			//DEBUG// console.log('flush (width: ' + context.buildingRow.width + ', galleryWidth: ' + context.galleryWidth + ', ' + 'isLastRow: ' + isLastRow + ')');

			minHeight = prepareBuildingRow(context, isLastRow);
			if (isLastRow && context.settings.lastRow === 'hide' && minHeight === -1) {
				context.buildingRow.entriesBuff = [];
				context.buildingRow.width = 0;
				return;
			}

			if (context.settings.maxRowHeight > 0 && context.settings.maxRowHeight < minHeight)
				minHeight = context.settings.maxRowHeight;
			else if (context.settings.maxRowHeight === 0 && (1.5 * context.settings.rowHeight) < minHeight)
				minHeight = 1.5 * context.settings.rowHeight;

			for (var i = 0; i < context.buildingRow.entriesBuff.length; i++) {
				$entry = context.buildingRow.entriesBuff[i];
				$image = $entry.find('img');
				displayEntry($entry, offX, context.offY, $image.data('jg.imgw'), $image.data('jg.imgh'), minHeight, context);
				offX += $image.data('jg.imgw') + context.settings.margins;
			}

			//Gallery Height
			context.$gallery.height(context.offY + minHeight +
				(context.spinner.active ? context.spinner.$el.innerHeight() : 0)
			);

			if(!isLastRow) {
				//Ready for a new row
				context.offY += minHeight + context.settings.margins;

				//DEBUG// console.log('minHeight: ' + minHeight + ' offY: ' + context.offY);

				context.buildingRow.entriesBuff = []; //clear the array creating a new one
				context.buildingRow.width = 0;
				context.firstRowFlushed = true;
				context.$gallery.trigger('jg.rowflush');
			}
		}

		function checkWidth(context) {
			context.checkWidthIntervalId = setInterval(function () {
				var galleryWidth = parseInt(context.$gallery.width(), 10);
				if (context.galleryWidth !== galleryWidth) {
					//DEBUG// console.log("resize. old: " + context.galleryWidth + " new: " + galleryWidth);
					
					context.galleryWidth = galleryWidth;
					rewind(context);

					// Restart to analyze
					startImgAnalyzer(context, true);
				}
			}, context.settings.refreshTime);
		}	

		function startLoadingSpinnerAnimation(spinnerContext) {
			clearInterval(spinnerContext.intervalId);
			spinnerContext.intervalId = setInterval(function () {
				if (spinnerContext.phase < spinnerContext.$points.length) 
					spinnerContext.$points.eq(spinnerContext.phase).fadeTo(spinnerContext.timeslot, 1);
				else
					spinnerContext.$points.eq(spinnerContext.phase - spinnerContext.$points.length).fadeTo(spinnerContext.timeslot, 0);
				spinnerContext.phase = (spinnerContext.phase + 1) % (spinnerContext.$points.length * 2);
			}, spinnerContext.timeslot);
		}

		function stopLoadingSpinnerAnimation(spinnerContext) {
			clearInterval(spinnerContext.intervalId);
			spinnerContext.intervalId = null;
		}

		function stopImgAnalyzerStarter(context) {
			context.yield.flushed = 0;
			if (context.imgAnalyzerTimeout !== null) clearTimeout(context.imgAnalyzerTimeout);
		}

		function startImgAnalyzer(context, isForResize) {
			stopImgAnalyzerStarter(context);
			context.imgAnalyzerTimeout = setTimeout(function () { analyzeImages(context, isForResize); }, 0.001);
			analyzeImages(context, isForResize);
		}

		function analyzeImages(context, isForResize) {
			
			//DEBUG// 
			/*var rnd = parseInt(Math.random() * 10000, 10);
			//DEBUG// console.log('analyzeImages ' + rnd + ' start');
			//DEBUG// console.log('images status: ');
			for (var i = 0; i < context.entries.length; i++) {
				var $entry = $(context.entries[i]);
				var $image = $entry.find('img');
				//DEBUG// console.log(i + ' (alt: ' + $image.attr('alt') + 'loaded: ' + $image.data('jg.loaded') + ')');
			}*/

			/* The first row */
			var isLastRow;
			
			for (var i = context.lastAnalyzedIndex + 1; i < context.entries.length; i++) {
				var $entry = $(context.entries[i]);
				var $image = $entry.find('img');

				//DEBUG// console.log('checking: ' + i + ' (loaded: ' + $image.data('jg.loaded') + ')');

				if ($image.data('jg.loaded') === true) {
					var newImgW = Math.ceil($image.data('jg.imgw') / ($image.data('jg.imgh') / context.settings.rowHeight));

					//DEBUG// console.log('analyzed img ' + $image.attr('alt') + ', imgW: ' + $image.data('jg.imgw') + ', imgH: ' + $image.data('jg.imgh') + ', rowWidth: ' + context.buildingRow.width);

					isLastRow = context.firstRowFlushed && (i >= context.entries.length - 1);

					// NOTE: If we have fixed height we need to never have a negative extraW, else some images can be hided.
					//				This is because the images need to have a smaller height, but fixed height doesn't allow it
					if (context.buildingRow.width + (context.settings.fixedHeight ? newImgW : newImgW / 2) + 
								(context.buildingRow.entriesBuff.length - 1) * 
								context.settings.margins > context.galleryWidth) {

						flushRow(context, isLastRow);

						if(++context.yield.flushed >= context.yield.every) {
							//DEBUG// console.log("yield");
							startImgAnalyzer(context, isForResize);
							return;
						}

					}

					context.buildingRow.entriesBuff.push($entry);
					context.buildingRow.width += newImgW;
					context.lastAnalyzedIndex = i;

				} else if ($image.data('jg.loaded') !== 'error') {
					return;
				}
			}

			// Last row flush (the row is not full)
			if (context.buildingRow.entriesBuff.length > 0) flushRow(context, context.firstRowFlushed);

			if (context.spinner.active) {
				context.spinner.active = false;
				context.$gallery.height(context.$gallery.height() - context.spinner.$el.innerHeight());
				context.spinner.$el.detach();
				stopLoadingSpinnerAnimation(context.spinner);
			}

			/* Stop, if there is, the timeout to start the analyzeImages.
					This is because an image can be set loaded, and the timeout can be set,
					but this image can be analyzed yet. 
			*/
			stopImgAnalyzerStarter(context);

			//On complete callback
			if (!isForResize) context.$gallery.trigger('jg.complete'); else context.$gallery.trigger('jg.resize');

			//DEBUG// console.log('analyzeImages ' + rnd +  ' end');
		}

		function checkSettings (context) {

			function checkSuffixesRange(range) {
				if (typeof context.settings.sizeRangeSuffixes[range] !== 'string')
					throw 'sizeRangeSuffixes.' + range + ' must be a string';
			}

			function checkOrConvertNumber(setting) {
				if (typeof context.settings[setting] === 'string') {
					context.settings[setting] = parseFloat(context.settings[setting], 10);
					if (isNaN(context.settings[setting])) throw 'invalid number for ' + setting;
				} else if (typeof context.settings[setting] === 'number') {
					if (isNaN(context.settings[setting])) throw 'invalid number for ' + setting;
				} else {
					throw setting + ' must be a number';
				}
			}

			if (typeof context.settings.sizeRangeSuffixes !== 'object')
				throw 'sizeRangeSuffixes must be defined and must be an object';

			checkSuffixesRange('lt100');
			checkSuffixesRange('lt240');
			checkSuffixesRange('lt320');
			checkSuffixesRange('lt500');
			checkSuffixesRange('lt640');
			checkSuffixesRange('lt1024');

			checkOrConvertNumber('rowHeight');
			checkOrConvertNumber('maxRowHeight');
			checkOrConvertNumber('margins');

			if (context.settings.lastRow !== 'nojustify' &&
					context.settings.lastRow !== 'justify' &&
					context.settings.lastRow !== 'hide') {
				throw 'lastRow must be "nojustify", "justify" or "hide"';
			}

			checkOrConvertNumber('justifyThreshold');
			if (context.settings.justifyThreshold < 0 || context.settings.justifyThreshold > 1)
				throw 'justifyThreshold must be in the interval [0,1]';
			if (typeof context.settings.cssAnimation !== 'boolean') {
				throw 'cssAnimation must be a boolean';	
			}
			
			checkOrConvertNumber('captionsAnimationDuration');
			checkOrConvertNumber('imagesAnimationDuration');

			checkOrConvertNumber('captionsVisibleOpacity');
			if (context.settings.captionsVisibleOpacity < 0 || context.settings.captionsVisibleOpacity > 1)
				throw 'captionsVisibleOpacity must be in the interval [0,1]';

			if (typeof context.settings.fixedHeight !== 'boolean') {
				throw 'fixedHeight must be a boolean';	
			}

			if (typeof context.settings.captions !== 'boolean') {
				throw 'captions must be a boolean';	
			}

			checkOrConvertNumber('refreshTime');

			if (typeof context.settings.randomize !== 'boolean') {
				throw 'randomize must be a boolean';	
			}

		}

		return this.each(function (index, gallery) {

			var $gallery = $(gallery);
			//$gallery.addClass('justified-gallery');

			var context = $gallery.data('jg.context');
			if (typeof context === 'undefined') {

				if (typeof arg !== 'undefined' && arg !== null && typeof arg !== 'object') 
					throw 'The argument must be an object';

				// Spinner init
				var $spinner = $('<div class="spinner"><span></span><span></span><span></span></div>');

				//Context init
				context = {
					settings : $.extend({}, defaults, arg),
					imgAnalyzerTimeout : null,
					entries : null,
					buildingRow : {
						entriesBuff : [],
						width : 0
					},
					lastAnalyzedIndex : -1,
					firstRowFlushed : false,
					yield : {
						every : 2, /* do a flush every context.yield.every flushes (
												* must be greater than 1, else the analyzeImages will loop */
						flushed : 0 //flushed rows without a yield
					},
					offY : 0,
					spinner : {
						active : false,
						phase : 0,
						timeslot : 150,
						$el : $spinner,
						$points : $spinner.find('span'),
						intervalId : null
					},
					checkWidthIntervalId : null,
					galleryWidth : $gallery.width(),
					$gallery : $gallery
				};

				$gallery.data('jg.context', context);

			} else if (arg === 'norewind') {
				// In this case we don't rewind, and analyze all the images
			} else {
				context.settings = $.extend({}, context.settings, arg);
				rewind(context);
			}
			
			checkSettings(context);

			context.entries = $gallery.find('> a, > div').toArray();
			if (context.entries.length === 0) return;

			// Randomize
			if (context.settings.randomize) {
				context.entries.sort(function () { return Math.random() * 2 - 1; });
				$.each(context.entries, function () {
					$(this).appendTo($gallery);
				});
			}

			context.usedSizeRangeRegExp = new RegExp("(" + 
				context.settings.sizeRangeSuffixes.lt100 + "|" + 
				context.settings.sizeRangeSuffixes.lt240 + "|" + 
				context.settings.sizeRangeSuffixes.lt320 + "|" + 
				context.settings.sizeRangeSuffixes.lt500 + "|" + 
				context.settings.sizeRangeSuffixes.lt640 + "|" + 
				context.settings.sizeRangeSuffixes.lt1024 + ")$"
			);

			if (context.settings.maxRowHeight > 0 && context.settings.maxRowHeight < context.settings.rowHeight)
				context.settings.maxRowHeight = context.settings.rowHeight;

			var imagesToLoad = false;
			$.each(context.entries, function (index, entry) {
				var $entry = $(entry);
				var $image = $entry.find('img');

				if ($image.data('jg.loaded') !== true) {
					$image.data('jg.loaded', false);

					//DEBUG// console.log('listed ' + $image.attr('alt'));

					imagesToLoad = true;

					// Spinner start
					if (context.spinner.active === false) {
						context.spinner.active = true;
						$gallery.append(context.spinner.$el);
						$gallery.height(context.offY + context.spinner.$el.innerHeight());
						startLoadingSpinnerAnimation(context.spinner);
					}

					// Link Rel global overwrite
					if (context.settings.rel !== null) $entry.attr('rel', context.settings.rel);

					// Link Target global overwrite
					if (context.settings.target !== null) $entry.attr('target', context.settings.target);

					// Image src
					var imageSrc = (typeof $image.data('safe-src') !== 'undefined') ? $image.data('safe-src') : $image.attr('src');
					$image.data('jg.originalSrc', imageSrc);
					$image.attr('src', imageSrc);

					/* Check if the image is loaded or not using another image object.
							We cannot use the 'complete' image property, because some browsers, 
							with a 404 set complete = true
					*/
					var loadImg = new Image();
					var $loadImg = $(loadImg);
					$loadImg.one('load', function imgLoaded () {
						//DEBUG// console.log('img load (alt: ' + $image.attr('alt') + ')');
						$image.off('load error');
						$image.data('jg.imgw', loadImg.width);
						$image.data('jg.imgh', loadImg.height);
						$image.data('jg.loaded', true);
						startImgAnalyzer(context, false);
					});
					$loadImg.one('error', function imgLoadError () {
						//DEBUG// console.log('img error (alt: ' + $image.attr('alt') + ')');
						$image.off('load error');
						$image.data('jg.loaded', 'error');
						startImgAnalyzer(context, false);
					});
					loadImg.src = imageSrc;

				}

			});

			if (!imagesToLoad) startImgAnalyzer(context, false);
			checkWidth(context);
		});

	};
	
}(jQuery));
/*---------------------------------------------------------------------------------------------

 @author       Constantin Saguin - @brutaldesign
 @link            http://csag.co
 @github        http://github.com/brutaldesign/swipebox
 @version     1.2.1
 @license      MIT License

 ----------------------------------------------------------------------------------------------*/
!function (window, document, $, undefined) {
	$.swipebox = function (elem, options) {
		var defaults = {
			useCSS: true,
			initialIndexOnArray: 0,
			hideBarsDelay: 3e3,
			videoMaxWidth: 1140,
			vimeoColor: "CCCCCC",
			beforeOpen: null,
			afterClose: null
		}, plugin = this, elements = [], elem = elem, selector = elem.selector, $selector = $(selector), isTouch = document.createTouch !== undefined || "ontouchstart" in window || "onmsgesturechange" in window || navigator.msMaxTouchPoints, supportSVG = !!window.SVGSVGElement, winWidth = window.innerWidth ? window.innerWidth : $(window).width(), winHeight = window.innerHeight ? window.innerHeight : $(window).height(), html = '<div id="swipebox-overlay">				<div id="swipebox-slider"></div>				<div id="swipebox-action">					<a id="swipebox-close"></a>							</div>		</div>';
		plugin.settings = {};
		plugin.init = function () {
			plugin.settings = $.extend({}, defaults, options);
			if ($.isArray(elem)) {
				elements = elem;
				ui.target = $(window);
				ui.init(plugin.settings.initialIndexOnArray)
			} else {
				$selector.click(function (e) {
					elements = [];
					var index, relType, relVal;
					if (!relVal) {
						relType = "rel";
						relVal = $(this).attr(relType)
					}
					if (relVal && relVal !== "" && relVal !== "nofollow") {
						$elem = $selector.filter("[" + relType + '="' + relVal + '"]')
					} else {
						$elem = $(selector)
					}
					$elem.each(function () {
						var title = null, href = null;
						if ($(this).attr("title"))title = $(this).attr("title");
						if ($(this).attr("href"))href = $(this).attr("href");
						elements.push({href: href, title: title})
					});
					index = $elem.index($(this));
					e.preventDefault();
					e.stopPropagation();
					ui.target = $(e.target);
					ui.init(index)
				})
			}
		};
		plugin.refresh = function () {
			if (!$.isArray(elem)) {
				ui.destroy();
				$elem = $(selector);
				ui.actions()
			}
		};
		var ui = {
			init: function (index) {
				if (plugin.settings.beforeOpen)plugin.settings.beforeOpen();
				this.target.trigger("swipebox-start");
				$.swipebox.isOpen = true;
				this.build();
				this.openSlide(index);
				this.openMedia(index);
				this.preloadMedia(index + 1);
				this.preloadMedia(index - 1)
			}, build: function () {
				var $this = this;
				$("body").append(html);
				if ($this.doCssTrans()) {
					$("#swipebox-slider").css({
						"-webkit-transition": "left 0.4s ease",
						"-moz-transition": "left 0.4s ease",
						"-o-transition": "left 0.4s ease",
						"-khtml-transition": "left 0.4s ease",
						transition: "left 0.4s ease"
					});
					$("#swipebox-overlay").css({
						"-webkit-transition": "opacity 1s ease",
						"-moz-transition": "opacity 1s ease",
						"-o-transition": "opacity 1s ease",
						"-khtml-transition": "opacity 1s ease",
						transition: "opacity 1s ease"
					});
					//$("#swipebox-action, #swipebox-caption").css({
					//    "-webkit-transition": "0.5s",
					//    "-moz-transition": "0.5s",
					//    "-o-transition": "0.5s",
					//    "-khtml-transition": "0.5s",
					//    transition: "0.5s"
					//})
				}
				//if (supportSVG) {
				//	var bg = $("#swipebox-action #swipebox-close").css("background-image");
				//	bg = bg.replace("png", "svg");
				//	$("#swipebox-action #swipebox-prev,#swipebox-action #swipebox-next,#swipebox-action #swipebox-close").css({"background-image": bg})
				//}
				$.each(elements, function () {
					$("#swipebox-slider").append('<div class="slide"></div>')
				});
				$this.setDim();
				$this.actions();
				$this.keyboard();
				$this.gesture();
				$this.animBars();
				$this.resize()
			}, setDim: function () {
				var width, height, sliderCss = {};
				if ("onorientationchange" in window) {
					window.addEventListener("orientationchange", function () {
						if (window.orientation == 0) {
							width = winWidth;
							height = winHeight
						} else if (window.orientation == 90 || window.orientation == -90) {
							width = winHeight;
							height = winWidth
						}
					}, false)
				} else {
					width = window.innerWidth ? window.innerWidth : $(window).width();
					height = window.innerHeight ? window.innerHeight : $(window).height()
				}
				sliderCss = {width: width, height: height};
				$("#swipebox-overlay").css(sliderCss)
			}, resize: function () {
				var $this = this;
				$(window).resize(function () {
					$this.setDim()
				}).resize()
			}, supportTransition: function () {
				var prefixes = "transition WebkitTransition MozTransition OTransition msTransition KhtmlTransition".split(" ");
				for (var i = 0; i < prefixes.length; i++) {
					if (document.createElement("div").style[prefixes[i]] !== undefined) {
						return prefixes[i]
					}
				}
				return false
			}, doCssTrans: function () {
				if (plugin.settings.useCSS && this.supportTransition()) {
					return true
				}
			}, gesture: function () {
				if (isTouch) {
					var $this = this, distance = null, swipMinDistance = 10, startCoords = {}, endCoords = {};
					var bars = $("#swipebox-caption, #swipebox-action");
					bars.addClass("visible-bars");
					$this.setTimeout();
					$("body").bind("touchstart", function (e) {
						$(this).addClass("touching");
						endCoords = e.originalEvent.targetTouches[0];
						startCoords.pageX = e.originalEvent.targetTouches[0].pageX;
						$(".touching").bind("touchmove", function (e) {
							e.preventDefault();
							e.stopPropagation();
							endCoords = e.originalEvent.targetTouches[0]
						});
						return false
					}).bind("touchend", function (e) {
						e.preventDefault();
						e.stopPropagation();
						distance = endCoords.pageX - startCoords.pageX;
						if (distance >= swipMinDistance) {
							$this.getPrev()
						} else if (distance <= -swipMinDistance) {
							$this.getNext()
						} else {
							if (!bars.hasClass("visible-bars")) {
								$this.showBars();
								$this.setTimeout()
							} else {
								$this.clearTimeout();
								$this.hideBars()
							}
						}
						$(".touching").off("touchmove").removeClass("touching")
					})
				}
			}, setTimeout: function () {
				if (plugin.settings.hideBarsDelay > 0) {
					var $this = this;
					$this.clearTimeout();
					$this.timeout = window.setTimeout(function () {
						$this.hideBars()
					}, plugin.settings.hideBarsDelay)
				}
			}, clearTimeout: function () {
				window.clearTimeout(this.timeout);
				this.timeout = null
			}, showBars: function () {
				var bars = $("#swipebox-caption, #swipebox-action");
				if (this.doCssTrans()) {
					bars.addClass("visible-bars")
				} else {
					$("#swipebox-caption").animate({top: 0}, 500);
					$("#swipebox-action").animate({bottom: 0}, 500);
					setTimeout(function () {
						bars.addClass("visible-bars")
					}, 1e3)
				}
			}, hideBars: function () {
				var bars = $("#swipebox-caption, #swipebox-action");
				if (this.doCssTrans()) {
					bars.removeClass("visible-bars")
				} else {
					$("#swipebox-caption").animate({top: "-50px"}, 500);
					$("#swipebox-action").animate({bottom: "-50px"}, 500);
					setTimeout(function () {
						bars.removeClass("visible-bars")
					}, 1e3)
				}
			}, animBars: function () {
				var $this = this;
				var bars = $("#swipebox-caption, #swipebox-action");
				bars.addClass("visible-bars");
				$this.setTimeout();
				$("#swipebox-slider").click(function (e) {
					if (!bars.hasClass("visible-bars")) {
						$this.showBars();
						$this.setTimeout()
					}
				});
				$("#swipebox-action").hover(function () {
					$this.showBars();
					bars.addClass("force-visible-bars");
					$this.clearTimeout()
				}, function () {
					bars.removeClass("force-visible-bars");
					$this.setTimeout()
				})
			}, keyboard: function () {
				var $this = this;
				$(window).bind("keyup", function (e) {
					e.preventDefault();
					e.stopPropagation();
					if (e.keyCode == 37) {
						$this.getPrev()
					} else if (e.keyCode == 39) {
						$this.getNext()
					} else if (e.keyCode == 27) {
						$this.closeSlide()
					}
				})
			}, actions: function () {
				var $this = this;
				if (elements.length < 2) {
					$("#swipebox-prev, #swipebox-next").hide()
				}
				$("#swipebox-close").bind("click touchend", function (e) {
					$this.closeSlide()
				})
			}, setSlide: function (index, isFirst) {
				isFirst = isFirst || false;
				var slider = $("#swipebox-slider");
				if (this.doCssTrans()) {
					slider.css({left: -index * 100 + "%"})
				} else {
					slider.animate({left: -index * 100 + "%"})
				}
				$("#swipebox-slider .slide").removeClass("current");
				$("#swipebox-slider .slide").eq(index).addClass("current");
				this.setTitle(index);
				if (isFirst) {
					slider.fadeIn()
				}
				$("#swipebox-prev, #swipebox-next").removeClass("disabled");
				if (index == 0) {
					$("#swipebox-prev").addClass("disabled")
				} else if (index == elements.length - 1) {
					$("#swipebox-next").addClass("disabled")
				}
			}, openSlide: function (index) {
				$("html").addClass("swipebox");
				$(window).trigger("resize");
				this.setSlide(index, true)
			}, preloadMedia: function (index) {
				var $this = this, src = null;
				if (elements[index] !== undefined)src = elements[index].href;
				if (!$this.isVideo(src)) {
					setTimeout(function () {
						$this.openMedia(index)
					}, 1e3)
				} else {
					$this.openMedia(index)
				}
			}, openMedia: function (index) {
				var $this = this, src = null;
				if (elements[index] !== undefined)src = elements[index].href;
				if (index < 0 || index >= elements.length) {
					return false
				}
				if (!$this.isVideo(src)) {
					$this.loadMedia(src, function () {
						$("#swipebox-slider .slide").eq(index).html(this)
					})
				} else {
					$("#swipebox-slider .slide").eq(index).html($this.getVideo(src))
				}
			}, setTitle: function (index, isFirst) {
				var title = null;
				$("#swipebox-caption").empty();
				if (elements[index] !== undefined)title = elements[index].title;
				if (title) {
					$("#swipebox-caption").append(title)
				}
			}, isVideo: function (src) {
				if (src) {
					if (src.match(/youtube\.com\/watch\?v=([a-zA-Z0-9\-_]+)/) || src.match(/vimeo\.com\/([0-9]*)/)) {
						return true
					}
				}
			}, getVideo: function (url) {
				var iframe = "";
				var output = "";
				var youtubeUrl = url.match(/watch\?v=([a-zA-Z0-9\-_]+)/);
				var vimeoUrl = url.match(/vimeo\.com\/([0-9]*)/);
				if (youtubeUrl) {
					iframe = '<iframe width="560" height="315" src="//www.youtube.com/embed/' + youtubeUrl[1] + '" frameborder="0" allowfullscreen></iframe>'
				} else if (vimeoUrl) {
					iframe = '<iframe width="560" height="315"  src="http://player.vimeo.com/video/' + vimeoUrl[1] + "?byline=0&amp;portrait=0&amp;color=" + plugin.settings.vimeoColor + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'
				}
				return '<div class="swipebox-video-container" style="max-width:' + plugin.settings.videomaxWidth + 'px"><div class="swipebox-video">' + iframe + "</div></div>"
			}, loadMedia: function (src, callback) {
				if (!this.isVideo(src)) {
					var img = $("<img>").on("load", function () {
						callback.call(img)
					});
					img.attr("src", src)
				}
			}, getNext: function () {
				var $this = this;
				index = $("#swipebox-slider .slide").index($("#swipebox-slider .slide.current"));
				if (index + 1 < elements.length) {
					index++;
					$this.setSlide(index);
					$this.preloadMedia(index + 1)
				} else {
					$("#swipebox-slider").addClass("rightSpring");
					setTimeout(function () {
						$("#swipebox-slider").removeClass("rightSpring")
					}, 500)
				}
			}, getPrev: function () {
				index = $("#swipebox-slider .slide").index($("#swipebox-slider .slide.current"));
				if (index > 0) {
					index--;
					this.setSlide(index);
					this.preloadMedia(index - 1)
				} else {
					$("#swipebox-slider").addClass("leftSpring");
					setTimeout(function () {
						$("#swipebox-slider").removeClass("leftSpring")
					}, 500)
				}
			}, closeSlide: function () {
				$("html").removeClass("swipebox");
				$(window).trigger("resize");
				this.destroy()
			}, destroy: function () {
				$(window).unbind("keyup");
				$("body").unbind("touchstart");
				$("body").unbind("touchmove");
				$("body").unbind("touchend");
				$("#swipebox-slider").unbind();
				$("#swipebox-overlay").remove();
				if (!$.isArray(elem))elem.removeData("_swipebox");
				if (this.target)this.target.trigger("swipebox-destroy");
				$.swipebox.isOpen = false;
				if (plugin.settings.afterClose)plugin.settings.afterClose()
			}
		};
		plugin.init()
	};
	$.fn.swipebox = function (options) {
		if (!$.data(this, "_swipebox")) {
			var swipebox = new $.swipebox(this, options);
			this.data("_swipebox", swipebox)
		}
		return this.data("_swipebox")
	}
}(window, document, jQuery);