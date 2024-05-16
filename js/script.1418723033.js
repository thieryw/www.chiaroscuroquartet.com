window.log=function(){log.history=log.history||[];log.history.push(arguments);if(this.console){arguments.callee=arguments.callee.caller;var a=[].slice.call(arguments);(typeof console.log==="object"?log.apply.call(console.log,console,a):console.log.apply(console,a))}};
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try{console.log();return window.console;}catch(err){return window.console={};}})());
// Log as JSON stringified for easy overview
window.logs=function(s){log(JSON.stringify&&JSON.stringify(s)||s)};

// Placeholdr, Copyright (c) 2013 Shane Carr
// https://github.com/vote539/placeholdr
// X11 License
(function(b,c,e,d){var h=function(){var a=b(this);a[d]()||(a.addClass(c),"password"===a.attr("type")&&(a.attr("type","text"),a.data(c+"-pwd",!0)),a[d](a.attr(e)))},f=function(){var a=b(this);a.removeClass(c);a.data(c+"-pwd")&&a.attr("type","password");if(a[d]()===a.attr(e))a[d]("")},k=function(){b(this).find("["+e+"]").each(function(){b(this).data(c)&&f.call(this)})};b.fn.placeholdr=function(){e in document.createElement("input")||(b(this).find("["+e+"]").each(function(){var a=b(this);a.data(c)||
(a.data(c,!0),h.call(this),a.focus(f),a.blur(h))}),b(this).find("form").each(function(){var a=b(this);a.data(c)||(a.data(c,!0),a.submit(k))}))};b.fn[d]=b.fn.val;b.fn.val=function(a){var g=b(this);if("undefined"===b.type(a)&&g.data(c)&&g[d]()===g.attr(e))return"";"string"===b.type(a)&&f.call(this);return b.fn[d].apply(this,arguments)};b(function(){b(document).placeholdr()});document.write("<style>.placeholdr{color:#AAA;}</style>")})(jQuery,"placeholdr","placeholder","placeholdrVal");

$.CMS = {
	FULL_URL_ROOT : $('script[data-full-root]').data('full-root'),
	URL_ROOT : $('script[data-root]').data('root')
};

/* Loadpic */
(function() {
	var pics = {};
	window.loadPic = function(url, callback) {
		var pic = pics[url];
		if(!pic) {
			pic = pics[url] = $('<img>').attr('src', url);
		}
		if(callback) {
			if(pic[0].complete) {
				callback();
			} else {
				pic.one('load', callback);
			}
		}
	};
	window.loadPics = function(urls, callback) {
		var i, n = urls.length;
		if(!n) {
			return callback();
		}
		function cb() {
			if(!--n) {
				callback();
			}
		}
		for(i = 0; i < urls.length; i++) {
			loadPic(urls[i], cb);
		}
	}
})();

jQuery.easing.easeInOutExpo = function (x, t, b, c, d) {
	if (t==0) return b;
	if (t==d) return b+c;
	if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
	return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
};

/* Search */
(function() {
	var search_last = '',
		search_timeout,
		search = $('#search'),
		searchAction = search.attr('action')+'.json',
		searchField = search.find(':text'),
		results;
	search.submit(function() {
		if(results) {
			if(results.find('.active').length) {
				location.href = results.find('.active').attr('href');
				return false;
			} else if(results.find('a').length == 1) {
				location.href = results.find('a').attr('href');
				return false;
			}
		}
	});
	searchField.on('change keyup', function() {
		var val = searchField.val();
		if(search_last == val) {
			return;
		}
		search_last = val;
		if(search_timeout) {
			clearTimeout(search_timeout);
		}
		search_timeout = setTimeout(function() {
			search_timeout = 0;
			$.get(searchAction, {s : val}, function(data) {
				if(!results) {
					results = $('<div class="results"></div>').appendTo(search);
				}
				results.empty();
				if(!data.length) {
					results.text(search.data('no-results') || '');
					return;
				}
				var i = 0;
				$.each(data, function() {
					var result = $('<a href="'+this.url+'"></a>'), text = $('<div class="text"></div>');
					if(this.pic) {
						result.append('<img src="'+CMS.thumbURL(this.pic, 50)+'" alt="">');
					}
					$('<div class="title"></div>').text(this.title || this.menuname).appendTo(text);
					$('<div class="short"></div>').html(this.text).appendTo(text);
					result.append(text).appendTo(results);
					if(++i == 4) {
						return false;
					}
				});
			}, 'json');
		}, 250);
	}).keydown(function(e) {
		if(!results) {
			return;
		}
		switch(e.which) {
			case 40:
				var active = results.find('.active');
				if(active.length && active.next().length) {
					active.removeClass('active').next().addClass('active');
					return false;
				}
				results.find('a:first').addClass('active').siblings().removeClass('active');
				return false;
			case 38:
				var active = results.find('.active');
				if(active.length && active.prev().length) {
					active.removeClass('active').prev().addClass('active');
					return false;
				}
				results.find('a:last').addClass('active').siblings().removeClass('active');
				return false;
		}
	});
})();

/* Maps */
(function() {
	function init() {
		var that = $(this),
			data = that.data('coords').split(';'),
			name = that.data('name'),
			lat = data[0],
			lng = data[1],
			zoom = parseInt(data[2], 10),
			coords = new google.maps.LatLng(lat, lng),
			marker,
			map = new google.maps.Map(this, {
				zoom : zoom,
				mapTypeControl: true,
				mapTypeControlOptions: {
					style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
					position: google.maps.ControlPosition.TOP_RIGHT
				},
				panControl: true,
				panControlOptions: {
					position: google.maps.ControlPosition.TOP_LEFT
				},
				zoomControl: true,
				zoomControlOptions: {
					position: google.maps.ControlPosition.TOP_LEFT
				},
				streetViewControl: false,
				mapTypeId : google.maps.MapTypeId.ROADMAP
			});
		marker = new google.maps.Marker({
			map : map,
			position : coords,
			title : name
		});
		map.setCenter(coords);
	}
	window.initMaps = function() {
		$('#map, .map').each(init);
	};
	initMaps();
})();

/* Background */
(function(wnd) {
	var wind = $(wnd),
		retina = wnd.devicePixelRatio > 1 ? true : false,
		bgWidths = [240, 320, 480, 640, 720, 960, 1024, 1280, 1440, 1680, 1920, 2560],
		width,
		height,
		oldWidth,
		rev = false,
		BACKGROUND = 'background',
		BACKGROUND_PORTRAIT = 'background-portrait',
		BACKGROUND_IMAGE = BACKGROUND + '-image';
	wnd.bgSize = function(url) {
		return url.replace(/(\.[^.]+)$/, '='+width+'x'+height+'$1');
	};
	wnd.bgChange = function(elem, url) {
		url = cleanUrl(url);
		if(url != cleanUrl(elem.children(':last').data(elemBackgroundData(elem)))) {
			var sizedUrl = bgSize(url);
			loadPic(sizedUrl, function() {
				$('<div class="background fix-background"></div>').css('background-image', 'url('+sizedUrl+')').data(BACKGROUND, url).hide().appendTo(elem).fadeIn(2000, function() {
					$(this).prevAll().remove();
				});
			});
		}
	};
	wnd.fixSize = function() {
		var that = $(this),
			src = that.data(elemBackgroundData(that)) || cleanUrl(that.css(BACKGROUND_IMAGE));
		that.css(BACKGROUND_IMAGE, 'url('+bgSize(src)+')').data(BACKGROUND, src);
		if(retina) {
			that.css(BACKGROUND + '-size', (width / 2)+'px '+(height / 2)+'px');
		}
	};
	function elemBackgroundData(elem) {
		return rev ? (elem.data(BACKGROUND_PORTRAIT) ? BACKGROUND_PORTRAIT : BACKGROUND) : BACKGROUND;
	}
	function cleanUrl(url) {
		return url.replace(/^url\(|\)$|=[0-9]+x[0-9]+/g, '').replace($.CMS.FULL_URL_ROOT, '');
	}
	function findWidth() {
		var ww = wind.width(), wh = wind.height(), i, w, k = 8 / 5;
		rev = false;
		if(retina) {
			ww *= 2;
			wh *= 2;
		}
		if(wh > ww) {
			w = wh; wh = ww; ww = w; rev = true;
		}
		if(ww / wh < 1.2) {
			k = 1;
		}
		w = Math.max(ww, wh * k);
		for(i = 0; i < bgWidths.length; i++) {
			if(w <= bgWidths[i]) {
				width = bgWidths[i];
				break;
			}
		}
		if(!width) {
			width = bgWidths[i - 1];
		}
		height = Math.ceil(width / k);
		if(rev) {
			w = height;
			height = width;
			width = w;
		}
		if(width !== oldWidth) {
			$('.fix-'+BACKGROUND).each(fixSize);
		}
		oldWidth = width;
	}
	wind.resize(findWidth);
	findWidth();
})(window);

var galDirection = true;
$('body').on('click', '.gallery a', function() {
	var that = $(this),
		pic = that.attr('href');

	var spinner = setTimeout(function() {
		spinner = false;
		$('.spinner').fadeIn();
	}, 200);
	loadPic(pic, function() {
		if(spinner) {
			clearTimeout(spinner);
		} else {
			$('.spinner').stop().fadeOut();
		}
		var img = $('<img>').attr('src', pic)[0],
			width = img.width,
			height = img.height,
			newWidth = Math.min($(window).width() - 50, 1680),
			newHeight = height / width * newHeight;
		$(img).css({
			width : newWidth,
			height :  newHeight
		});

		var img1 = $('<div/>').css('background-image', 'url('+pic+')');
		if($('.gallery-big .pic div').length) {
			var oldImg = $('.gallery-big .pic div').css({
				position : 'absolute',
				left : 0
			});
			img1.css({
				position : 'relative',
				left : galDirection ? '100%' : '-100%'
			}).appendTo('.gallery-big .pic');
			setTimeout(function() {
				oldImg.animate({
					left : galDirection ? '-100%' : '100%'
				}, {
					duration : 1000,
					easing : 'easeInOutExpo',
					complete : function() {
						$(this).remove();
					}
				});
				img1.animate({
					left : 0
				}, {
					easing : 'easeInOutExpo',
					duration : 1000
				});
			}, 500);
		} else {
			$('.gallery-big .pic').append(img1);
		}
		$('.gallery-big .gallery-title').text(that.attr('title'))[that.attr('title') ? 'show' : 'hide']();

		$('.gallery-big').fadeIn();
		$('.gallery-big .link').attr('href', pic);
		$('.gallery-big .next').off().on('click touchend', function() {
			galDirection = true;
			if(that.next().length) {
				that.next().click();
			} else {
				that.siblings().first().click();
			}
			return false;
		});
		$('.gallery-big .prev').off().on('click', function() {
			galDirection = false;
			if(that.prev().length) {
				that.prev().click();
			} else {
				that.siblings().last().click();1
			}
			return false;
		});
	});
	return false;
}).on('click', '.gallery-cover, .gallery-big .back', function() {
	if($('.gallery-big').is(':visible')) {
		$('.gallery-big').fadeOut(function() {
			$('.gallery-big .pic').empty();
		});
	}
	return false;
}).on('click', '.gallery-big', function(e) {
	e.stopPropagation();
	return false;
}).on('click', '.play-audio', function() {
	var that = $(this);
	$('.play-audio.playing').not(this).click();	
	if(that.is('.playing')) {
		pauseAudio();
		that.removeClass('playing');
	} else {
		playFile(that.attr('href'));
		that.addClass('playing');
	}
	return false;
}).on('click', '.gallery-big .link', function(e) {
	e.stopPropagation();
}).on('mousewheel', '.gallery-big', false);

/* Audio player */
(function() {
	var audio = document.createElement('audio');
	if(typeof audio.canPlayType !== 'function') {
		return;
	}
	window.playFile = function(src) {
		if(audio.src != src) {
			audio.src = src;
			audio.load();
		}
		audio.play();
	}
	window.pauseAudio = function() {
		audio.pause();
	}
})();

var wind = $(window);
function initContent() {
	setTimeout(function() {
		$('.press .quote .q-t:not(.fixed)').each(function() {
			var that = $(this).addClass('fixed'),
				h = (that.next('a').length ? 280 : 340) - 50,
				h2 = (that.next('a').length ? 280 : 340) - 100;
			if(that.height() < h) {
				that.addClass('medium');
			}
			if(that.height() > h) {
				that.removeClass('medium');
			} else {
				if(that.height() < h) {
					that.removeClass('medium').addClass('big');
				}
				if(that.height() > h2) {
					that.removeClass('big').addClass('medium');
				}
			}
		});
	}, 10);
	$('.box:not(.flipped)').each(function(i) {
		var that = $(this), images = [];
		that.addClass('flipping');
		function doTheFlip() {
			setTimeout(function() {
				setTimeout(function() {
					if(that.offset().top < wind.height() + wind.scrollTop()) {
						that.addClass('flipped');
					} else {
						that.addClass('canflip');
					}
				});
			}, i * 150);
		}
		that.find('img').add($(this).filter('img')).each(function() {
			images.push($(this).attr('src'));
		});
		loadPics(images, doTheFlip);
	});
	$('footer').css({top : (parseInt($('#bg-container').css('padding-bottom'),10)-40)/2});
}
initContent();
$(window).on('scroll', function() {
	var i = 0;
	$('.box.flipping.canflip').each(function() {
		var that = $(this);
		if(that.offset().top < wind.height() + wind.scrollTop()) {
			setTimeout(function() {
				that.addClass('flipped').removeClass('canflip');
			}, i++ * 150);
		}
	});
});

$('body').on('submit', '.contact form', function() {
	var form = $(this), ok = true, foc = false;
	$('label:visible', this).each(function() {
		var fieldOk = $(':input', this).val() != '';
		$(this).toggleClass('err', !fieldOk);
		if(!fieldOk && !foc) {
			ok = false;
			foc = true;
			$(this).focus();
		}
	});
	if(!ok) {
		return false;
	}
	$.post(form.attr('action')+'.json', form.serialize(), function(data) {
		if(data) {
			form.children().not('.thanks').fadeOut().promise().done(function() {
				form.find('.thanks').fadeIn();
			});
		}
	}, 'json');
	return false;
});


/* Ajax */
//(function() {
//	var popped = ('state' in window.history), initialURL = location.href,
//		prevUrl = currentUrl(),
//		main = $('#content'),
//		body = $('body');
//	function loadContent(url) {
//		if(url == prevUrl) {
//			return;
//		}
//		prevUrl = url;
//		$.post(url.replace(/(?=\?)|$/, '.ajax'), function(data) {
//			var menuOld, menuNew, oldContent, newContent, oldBackground, newBackground;
//			
//			data = $(data);
//			
//			document.title = $('#page-title', data).text();
//			$('title').text(document.title);
//			
//			menuOld = $('header nav li.open').length ? $('header nav li.open').prevAll().length : -1;
//			$('header nav li').removeClass('open').children().removeClass('open');
//			$('header nav a[href="'+$('#page-menu a.open', data).attr('href')+'"]').addClass('open').parent().addClass('open');
//			menuNew = $('header nav li.open').length ? $('header nav li.open').prevAll().length : -1;
//
//			oldContent = $('#content').children();
//			newContent = $('#page-content', data).children();
//
//			oldBackground = $('#bg-container .bg-image:not(.going)').data('background');
//			newBackground = $('#page-content', data).data('background');
//
//			if(oldBackground != newBackground) {
//				$('#bg-container .bg-image:not(.going)').addClass('going').fadeOut().promise().done(function() {
//					$('#bg-container .bg-image.going').remove();
//				});
//			}
//
//			oldContent.fadeOut().promise().done(function() {
//				oldContent.remove();
//				newContent.appendTo('#content').hide().fadeIn();
//				window.scrollTo(0, 0);
//				$('body').attr('class', $('#page-content', data).attr('class'));
//
//				function chBg() {
//					if(oldBackground != newBackground) {
//						$('#bg-container').append($('<div class="bg-image"></div>').data('background', newBackground).css('background-image', 'url('+newBackground+')').hide().fadeIn());
//					}
//				}
//				if(newBackground) {
//					loadPic(newBackground, chBg);
//				} else {
//					chBg();
//				}
//				initContent();
//			});
//
//		}, 'html');
//	}
//	function currentUrl() {
//		return location.href.replace(/#.*$/, '').replace($.CMS.FULL_URL_ROOT, '');
//	}
//	function newState(url) {
//		if(!history.pushState) {
//			return;
//		}
//		history.pushState({}, '', url);
//		loadContent(url);
//		$('.spinner').fadeOut();
//		return false;
//	}
//	$(window).bind('popstate', function() {
//		var url = currentUrl();
//		// Ignore inital popstate that some browsers fire on page load
//		var initialPop = !popped && location.href == initialURL;
//		popped = true;
//		if(initialPop) {
//			return;
//		}
//		loadContent(url);
//	});
//	$('body').on('click', '#logo, header nav a, a.disc-box, a.news, .news-list a, .flip-box.button', function() {
//		if(body.width() <= 1024) {
//			return;
//		}
//		return newState($(this).attr('href').replace(/#.*/, ''));
//	});
//})();

if($(window).width() <= 1024) {
	if($('body').is('.module-frontpage')) {
		$('header nav').insertBefore('footer').addClass('mobile-nav');
	}
	$('body').on('click touchend', 'header nav', function() {
		$(this).toggleClass('open');
		return false;
	}).on('click touchend', 'header nav ul', function(e) {
		e.stopPropagation();
	});
	$('iframe').each(function() {
		var that = $(this), k = that.height() / that.width(), w = that.parent().width();
		that.css({
			width : w,
			height : w * k
		});
	});
}

var vid = 0;
$('body').on('click', '.video-player', function() {
	try{jwplayer().remove()}catch(e){}
	var that = $(this),
		videos = that.data('videos'),
		videoURL = that.data('video-url'),
		id = 'vuid-'+(vid++),
		levels = [],
		setup = {
			skin : $.CMS.URL_ROOT+'cms-base/lib/jwplayer/skins/chia/chia.xml',
			autostart : true,
			width : that.width(),
			height : that.height(),
			modes: [
				{type: 'flash', src: $.CMS.URL_ROOT+'cms-base/lib/jwplayer/player.swf'},
				{type: 'html5'}/*,
				{type: 'download'}*/
			],
			events : {
				onPlay : function() {
					pauseAudio();
				}
			}
		};
	if(videoURL) {
		setup.file = videoURL;
	}
	that.attr('id', id);
	console.log(videos, videoURL);
	if(videos) {
		$.each(videos, function(_, i) {
			levels.push({file : i});
		});
		//setup.levels = levels;
	}
	jwplayer(id).setup(setup);
});