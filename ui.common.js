// 스크롤 유무
$.fn.hasVerticalScrollbar = function(){
	return this.get(0).scrollHeight > this.height();
}

// Touch Prevent
function lockTouch(e){
	e.preventDefault();
}

// Bright BG Check
function getImageBrightness(imageSrc, callback){
	var img = document.createElement('img');

	img.src = imageSrc;
	img.style.display = 'none';

	document.body.appendChild(img);
	var colorSum = 0;

	img.onload = function(){
		var canvas = document.createElement('canvas');

		canvas.width = this.width;
		canvas.height = this.height;

		var ctx = canvas.getContext('2d');
		ctx.drawImage(this, 0, 0);

		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		var data = imageData.data;
		var r, g, b, avg;

		for(var x=0, len=data.length; x<len; x+=4){
			r = data[x];
			g = data[x+1];
			b = data[x+2];
			avg = Math.floor((r+g+b)/3);

			colorSum += avg;
		}

		var brightness = Math.floor(colorSum/(this.width*this.height));

		callback(brightness);
		document.body.removeChild(img);
	}
}


// is Mobile
function _isMobile(){
	var isMobile = (/iphone|ipod|android|blackberry|fennec/).test(navigator.userAgent.toLowerCase());
	return isMobile;
}

// videoPlay
function videoPlay($taret, type){
	$target.find('video').each(function(){
		if(type == 'play'){
			if(!_isMobile()){
				$(this).parent().addClass('on');
				this.play();
				var _this = $(this);
				setTimeout(function(){
					_this.css({'visibility' : 'visible'});
				}, 400);
			}
			else if(type == 'load'){
				$(this).parent().removeClas('on');
				this.load();
			}
			else{
				$(this).parent().removeClas('on');
				this.pause();
			}
		}
	});
}

// videoUI
function videoUI(){
	var el = $('.videoArea');

	if(el.length <= 0){
		return;
	}

	$('video').on('ended' , function(){
		if($(this).parent().hasClass('loadType')){
			videoPlay($(this).parent() , 'load');
		}
		else{
			videoPlay($(this).parent() , 'pause');
		}
	});

	if(_isMobile()){
		$('.videoMobile , .video.play').on('click' , function(e){
			$(this).find('video').each(function(){
				if(this.paused){
					$(this).parent().addClass('on');
					this.play();
					var _this = $(this);
					setTimeout(function(){
						_this.css({'visibility' : 'visible'});
					}, 400);
				}
				else{
					$(this).parent().removeClass('on');
					this.pause();
				}
			});
		});

		$('.videoMobile').each(function(){
			$(this).addClass('play');
		});
	}
	else{
		$('.video:not(".loop")').on('click' , function(){
			$(this).find('video').each(function(){
				if(this.paused){
					$(this).parent().addClass('on')
					this.play();
					var _this = $(this);
					setTimeout(function(){
						_this.css({'visibility' : 'visible'});
					}, 400);
				}
				else{
					$(this).parent().removeClass('on');
					this.pause();
				}
			});
		});
	}

	$('video').each(function(){
		var poster = $(this).attr('poster');
		$(this).parent().css({'background-image' : 'url('+poster+')'});

		if(_isMobile){
			this.autoplay = false;
		}
		else{
			if(this.autoplay){
				$(this).css({'visibility' : 'visible'});
			}
		}
	});


	var videos = document.querySelectorAll('video');
	var behavior = document.querySelector('#behavior');

	if(location.search === '?enabled=false'){
		behavior.innerHTML = '(module disabled everywhere via <code>?enabled=false</code>';
	}
	else if(location.search === '?enabled=true'){
		enableVideos(true);
		behavior.innerHTML = '(module disabled everywhere (whether it"s necessary or not) via <code>?enabled=true</code>';
	}
	else{
		enableVideos();
	}

	function enableButtons(video){
		var playBtn = video.parentNode.querySelector('.play');
		var fullscreenButton = video.parentNode.querySelector('.fullscreen');

		if(playBtn){
			playBtn.addEventListener('click' , function(){
				if(video.paused){
					video.play();
				}
				else{
					video.pause();
				}
			});
		}

		if(fullscreenButton){
			fullscreenButton.addEventListener('click', function(){
				video.webkitEnterFullScreen();
			});
		}
	}

	function debugEvents(video){
		[
			'loadstart',
			'progress',
			'suspend',
			'abort',
			'error',
			'emptied',
			'stalled',
			'loadedmetadata',
			'loaddata',
			'canplay',
			'canplaythrough',
			'playing',
			'waiting',
			'seeking',
			'seeked',
			'ended',
			'timeupdate',
			'play',
			'pause',
			'webkitbeginfullscreen',
			'webkitendfullscreen',
		].forEach(function(event){
			video.addEventListener(event, function(){
				// console.info('@', event);
			});
		});
	}

	function enableVideos(everywhere){
		for(var i = 0; i < videos.length; i++){
			window.makeVideoPlayableInline(videos[i] , !videos[i].hasAttribute('muted'), !everywhere);
			enableButtons(videos[i]);
			debugEvents(videos[i]);
		}
	}
}

//over_img
function over_img(img,n){
	var hover = '_'+n;
	if (img.hasClass('on') == false && img.find('img').length > 0){
		menuimg = img.find('img');

		if (menuimg.attr('src').indexOf('.jpg') > 0){
			menuimg_type = '.jpg';
		}else if (menuimg.attr('src').indexOf('.gif') > 0){
			menuimg_type = '.gif';
		}else if (menuimg.attr('src').indexOf('.png') > 0){
			menuimg_type = '.png';
		}


		menuimg_src = menuimg.attr('src').split('_off')[0];
		menuimg_src = menuimg_src.split('_on')[0];
		menuimg_src = menuimg_src.split('_select')[0];
		menuimg.attr('src',menuimg_src+hover+menuimg_type);
	}
}

//make selectbox
function makeSelect(obj, fn) {
	if(obj.parent().hasClass('selectStyle')) {
		return false;
	}

	// 부모 감싸기
	obj.wrap('<div class="selectStyle"></div>');
	obj.after('<div class="layerOption"></div>');

	$selectBox = obj.closest('.selectBoxWrap').eq(0);
	$selectBox.find('.selectStyle').each(function(){
		//select가 selected일때 a태그로 추출
		$(this).find('.select').after('<a href="#" class="selected">'+$(this).find('.select option:selected').text()+'</a>');

		$(this).find('.layerOption').width(obj.closest('.selectBoxWrap').eq(0).width() - 2);

		for(var i=0;i<=$(this).find('.select option').length-1;i++){
			var value = $(this).find('.select option').eq(i).attr('value');

			if(value){
				value = ' data-value="' + value + '"';
			}else{
				value = '';
			}

			$(this).find('.layerOption').append('<div class="option"><a href="#"' + value + ' >'+$(this).find('.select option').eq(i).text()+'</a></div>');
		}

		//option에 selected 일때
		$(this).find('.select').find('option').each(function(idx, obj){
			if($(obj).is(':selected')){
				var index = $(obj).index();

				$(this).closest($selectBox).find('.layerOption .option').removeClass('on');
				$(this).closest($selectBox).find('.layerOption .option').eq(index).addClass('on');
			}
		});

		// select option 정의
		$(this).find('.layerOption .option').each(function(idx, obj){
			if($(obj).hasClass('on')){
				$(obj).attr('data-selected', true);
			}
			else{
				$(obj).attr('data-selected', false);
			}
		});

		//select가 disabled 일때
		if($(this).find('.select').is(':disabled')){
			$(this).find('.selected').addClass('disabled');

			return;
		}

		//select option이 disabled 일때
		$(this).find('.select').find('option').each(function(idx, obj){
			if($(obj).is(':disabled')){
				var index = $(obj).index();

				$(this).closest($selectBox).find('.layerOption .option').eq(index).addClass('disabled');

				return
			}
		});
	});

	$selectBox.find('.selected').on({
		click : function(e){
			e.preventDefault();
			var windowInnerHeight = window.innerHeight || $(window).height();
			var $list = $(this).next('.layerOption');

			//select가 disabled 일때
			if($(this).prev('.select').is(':disabled')){
				$list.removeClass('on');

				return;
			}

			if($list.hasClass('on')){
				$list.removeClass('on').hide().css({zIndex: 5});
				$('.selectBoxWrap').removeClass('on');
			}
			else{
				$('.selectStyle').find('.layerOption').removeClass('on').hide().css({zIndex: 5});
				$list.addClass('on').show().css({zIndex: 10});
				$('.selectBoxWrap').removeClass('on');
				$(this).closest('.selectBoxWrap').addClass('on');
			}

			// 셀렉트 스크롤 생길시 
			if($list.hasVerticalScrollbar()){
				$list.addClass('scroll');
				$list.scrollTop($list.find('.option.on')[0].offsetTop - $(this)[0].offsetHeight); // 현재 option selected 스크롤 이동
			}
			else{
				$list.removeClass('scroll');
			}

			// 타켓이 바깥일 경우
			$(document).off('click.closeEvent').on('click.closeEvent' , function(e){
				// option disabled 클릭시
				if($(e.target).context.parentElement == $('div.option.disabled')[0]){
					return;
				}

				if($(e.target).next('.layerOption').size() == 0) {
					$('.selectStyle').find('.layerOption').removeClass('on').hide().css({zIndex: 5});
					$('.selectBoxWrap').removeClass('on');
				}
			});
		}
	});

	$selectBox.find('.layerOption .option a').on({
		click : function(e){
			e.preventDefault();

			// option이 disabled 일때
			if($(this).closest('.option').hasClass('disabled')){
				return;
			}

			var selectText = $(this).text();
			var idx = $(this).closest('.option').index();
			$(this).closest('.selectStyle').find('.selected').text(selectText);

			var $selectStyle = $(this).closest('.selectStyle');
			$(this).closest('.layerOption').removeClass('on').hide().css({zIndex: 5});

			//selected 초기화..
			$selectStyle.find('.select option').prop('selected', false);
			$selectStyle.find('.select option').eq(idx).prop('selected' , 'selected');
			$selectStyle.find('.select').trigger('change');
			$selectStyle.find('.layerOption .option').attr({'data-selected': false}).removeClass('on');
			$(this).closest('.option').attr({'data-selected': true}).addClass('on');

			fn && fn(); //callback
		}
	});
}

//make selectbox reFresh
function selectBoxReFresh(obj){
	var el;

	if (obj == null || obj == undefined || obj.length <= 0) {
		el = $('.select');
	} else {
		el = $(obj);
	}

	$selectBox = el.closest('.selectBoxWrap');
	$selectBox = $('.select').closest('.selectBoxWrap');
	$selectBox.find('.selectStyle').each(function(){
		//select가 selected일때 a태그로 추출
		$(this).find('.selected').text($(this).find('.select option:selected').text());

		$(this).find('.layerOption').remove();
		$(this).find('.selected').after('<div class="layerOption"></div>');
		$(this).find('.layerOption').width($(this).closest('.selectBoxWrap').eq(0).width() - 2);

		for(var i=0;i<=$(this).find('.select option').length-1;i++){
			var value = $(this).find('.select option').eq(i).attr('value');

			if(value){
				value = ' data-value="' + value + '"';
			}else{
				value = '';
			}
			$(this).find('.layerOption').append('<div class="option"><a href="#"' + value + ' >'+$(this).find('.select option').eq(i).text()+'</a></div>');
		}

		//option에 selected 일때
		$(this).find('.select').find('option').each(function(idx, obj){
			if($(obj).is(':selected')){
				var index = $(obj).index();

				$(this).closest($selectBox).find('.layerOption .option').removeClass('on');
				$(this).closest($selectBox).find('.layerOption .option').eq(index).addClass('on');
			}
		});

		// select option 정의
		$(this).find('.layerOption .option').each(function(idx, obj){
			if($(obj).hasClass('on')){
				$(obj).attr('data-selected', true);
			}
			else{
				$(obj).attr('data-selected', false);
			}
		});

		//select가 disabled 일때
		if($(this).find('.select').is(':disabled')){
			$(this).find('.selected').addClass('disabled');

			return;
		}
		else{
			$(this).find('.selected').removeClass('disabled');
		}

		//select option이 disabled 일때
		$(this).find('.select').find('option').each(function(idx, obj){
			if($(obj).is(':disabled')){
				var index = $(obj).index();
				$(this).closest($selectBox).find('.layerOption .option').eq(index).addClass('disabled');

				return
			}
			else{
				$(this).closest($selectBox).find('.layerOption .option').removeClass('disabled');
			}
		});
	});

	$selectBox.find('.layerOption .option a').on({
		click : function(e){
			e.preventDefault();

			// option이 disabled 일때
			if($(this).closest('.option').hasClass('disabled')){
				return;
			}

			var selectText = $(this).text();
			var idx = $(this).closest('.option').index();
			$(this).closest('.selectStyle').find('.selected').text(selectText);

			var $selectStyle = $(this).closest('.selectStyle');
			$(this).closest('.layerOption').removeClass('on').hide().css({zIndex: 5});

			//selected 초기화..
			$selectStyle.find('.select option').prop('selected', false);
			$selectStyle.find('.select option').eq(idx).prop('selected' , 'selected');
			$selectStyle.find('.layerOption .option').attr({'data-selected': false}).removeClass('on');
			$(this).closest('.option').attr({'data-selected': true}).addClass('on');
			$selectStyle.find('.select').trigger('change');
		}
	});
}

// UI FormControll
function formControl(){
	// 셀렉트 박스 경우
	if($('select').hasClass('select') == true){
		$('select.select').each(function(i) {
			makeSelect($(this));
		});
	}
}

// Device Check
function deviceCheckUI(){
	var width = document.documentElement.offsetWidth,
		devsize = [1440, 1024, 768, 359],
		sizeMode = width > devsize[0] ? 4 : width > devsize[1] ? 3 : width > devsize[2] ? 2 : 1,
		html5tags = ['article', 'aside', 'details', 'figcaption', 'figure', 'footer', 'header', 'hgroup', 'nav', 'main', 'section', 'summary'],
		i = 0,
		max = html5tags.length;

	for (i = 0; i < max; i++) {
		document.createElement(html5tags[i]);
	}
	document.documentElement.className += (' s'+ sizeMode +' s'+ (3 > sizeMode ? 12 : 34) + (360 > width ? ' s0' : ''));
}

// 이미지 웹/모바일 구분
function ResponsiveImages(){
	var winW = window.innerWidth;
	$('.responsive-image').each(function(){
		if(winW > 1024){
			var url = $(this).attr('data-media-pc');
			$(this).attr('data-media-type','pc');
			chgImg($(this),url,'pc');
		}
		if($(this).attr('data-media-tablet')){
			if(winW <= 1024 && winW >= 768){
				var url = $(this).attr('data-media-tablet');
				$(this).attr('data-media-type","tablet');
				chgImg($(this),url,'tablet');
			}
			else if(winW <= 767){
				var url = $(this).attr('data-media-mobile');
				$(this).attr('data-media-type","mobile');
				chgImg($(this),url,'mobile');
			}
		}
		else{
			if(winW <= 1024){
				var url = $(this).attr('data-media-mobile');
				$(this).attr('data-media-type","mobile');
				chgImg($(this),url,'mobile');
			}
		}
	});

	// 데이터 피커
	var datePickerTimer;
	clearTimeout(datePickerTimer);
	datePickerTimer = setTimeout(function(){
		$('.inputDate').each(function(idx, obj){
			if(winW > 1024){
				$(this).find('input').prop({'type' : 'text'});
				datepickerUI();
			}
			else if(winW <= 1024){
				$(this).find('input').prop({'type' : 'date'});
				$(this).find('input').datepicker('destroy');
			}
		});
	}, 10);


	function chgImg($target, url, type){
		$target.attr('src' , url);
		$target.attr('data-media-type' , type);
	}
}

//img hover
function imgHoverUI(){
	var el;
	el = $('.hover');

	if(el.length <= 0){
		return;
	}

	bindEvents();

	function bindEvents(){
		$(".hover").on({
			mouseenter : function(){
				over_img($(this),"on");
			},
			mouseleave : function(){
				over_img($(this),"off");
			},
			focusin : function(){
				over_img($(this),"on");
			},
			focusout : function(){
				over_img($(this),"off");
			}
		});
	}
}

// Header UI
function headerUI(){
	var el = $('.header');
	var gnbTimeout;
	var winH = window.innerHeight;
	var gnbOnIdx = el.find('.gnbWrap #gnb .dep1.on').index(); // 메뉴 활성화 index(만약 1뎁스에 on이 있을 경우)

	if(el.length <= 0){
		return;
	}

	// Gnb
	// 역사관일 경우
	if(el.find('.gnbWrap').hasClass('all')){
		el.find('.gnbWrap').prepend('<div class="gnbAllBg"></div>');

		var gnbQuery = [];
		el.find('#gnb .dep2Box').each(function(idx, obj){
			gnbQuery.push($(obj).outerHeight(true));
			var gnbAllBgH = Math.max.apply(null, gnbQuery); // 2dep 높이가 가장 큰수 구하기

			el.find('.gnbWrap').find('.gnbAllBg').css({height : gnbAllBgH + 1});
		});

		el.find('#gnb > li > a').on('mouseenter focusin', function(){
			clearTimeout(gnbTimeout);
			$(this).closest('li').addClass('on').siblings().removeClass('on');
			el.find('#gnb .dep2Box').stop().slideDown(300);
			el.find('.gnbAllBg').stop().slideDown(200);
		});

		el.find('#gnb > li').on('mouseenter' , function(){
			$(this).addClass('on').siblings().removeClass('on');
		});
	}
	else{
		el.find('#gnb > li > a').on('mouseenter focusin', function(){
			clearTimeout(gnbTimeout);
			$(this).closest('li').addClass('on').siblings().removeClass('on');
			el.find('#gnb .dep2Box').hide();

			if($(this).next('.dep2Box').length > 0){
				if(el.find('#gnb').hasClass('active')){
					$(this).next('.dep2Box').show();
				}
				else{
					el.find('#gnb').addClass('active');
					$(this).next('.dep2Box').stop().slideDown(300);
				}
			}
			else{
				el.find('#gnb').removeClass('active');
			}

			// 검색 레이어 닫기
			el.find('.schWrap').removeClass('on').removeAttr('style');
		});
	}

	el.find('#gnb .dep2Box, .gnbAllBg').on('mouseenter' , function(){
		clearTimeout(gnbTimeout);
	});

	el.find('#gnb .dep2Box, #gnb, .gnbAllBg').on('mouseleave' , function(){
		gnbCommHide();
	});

	el.find('#gnb .dep1:last .dep2Box .dep2:last').on('focusout', function(){
		gnbCommHide();
	});

	function gnbCommHide(){
		clearTimeout(gnbTimeout);
		gnbTimeout = setTimeout(function(){
			// 현재 Gnb 메뉴 1depth 활성화 
			if(gnbOnIdx >= 0){
				el.find('#gnb .dep1').removeClass('on').eq(gnbOnIdx).addClass('on');
			}
			else{
				el.find('#gnb .dep1').removeClass('on');
			}

			el.find('#gnb').removeClass('active');
			el.find('#gnb .dep2Box').stop().slideUp(300);
			el.find('.gnbWrap').find('.gnbAllBg').stop().slideUp(350);
		}, 350);
	}

	// 다국어 레이어
	el.find('.util .language a.now').on('click' , function(e){
		e.preventDefault();

		if($(this).closest('.language').hasClass('on')){
			$(this).closest('.language').removeClass('on');
		}
		else{
			$(this).closest('.language').addClass('on');
		}
	});

	el.find('.util .language a').not('.now').on('click' , function(){
		el.find('.util .language').removeClass('on');
	});

	$(document).off('click.closeLanguage').on('click.closeLanguage' , function(e){
		if($(e.target).closest('.language').size() == 0) {
			el.find('.util .language').removeClass('on');
		}
	});

	// 검색 레이어
	el.find('.btnIn .btn.search > a').on('click' , function(e){
		e.preventDefault();

		el.find('.schWrap').addClass('on');
		TweenMax.set(el.find('.schWrap') , {opacity : 0});
		TweenMax.to(el.find('.schWrap') , 0.3, {opacity : 1});
	});

	el.find('.schWrap .schClose a').on('click' , function(e){
		e.preventDefault();

		TweenMax.to(el.find('.schWrap') , 0.3, {opacity : 0, onComplete : function(){
			el.find('.schWrap').removeClass('on');
			el.find('.schWrap').removeAttr('style');
		}});
	});

	// 전체 메뉴 레이어
	var allmenuContH;
	var allmenuSpace = 136; // 전체메뉴 상단 Head + padding 여백
	var allmenuTimer;
	$(window).off('resize.allMenuResize').on('resize.allMenuResize' , function(){
		winH = window.innerHeight;
		allmenuContH = winH - allmenuSpace;

		clearTimeout(allmenuTimer);
		allmenuTimer = setTimeout(function(){
			el.find('.allMenuWrap .allMenuList').css({
				height : allmenuContH
			});
		}, 60);
		
	}).trigger('resize.allMenuResize');

	var allmenuOnIdx = el.find('.allMenuWrap #allMenu > li.on').index(); // 메뉴 활성화 index(만약 1뎁스에 on이 있을 경우)
	el.find('.btnIn .btn.allmenu > a').on('click' , function(e){
		e.preventDefault();

		$('html').addClass('closeHiddenOnly');

		// 현재 전체 메뉴 1depth 활성화 
		if(allmenuOnIdx > 0){
			el.find('.allMenuWrap #allMenu > li').removeClass('on').eq(allmenuOnIdx).addClass('on');
		}
		else{
			el.find('.allMenuWrap #allMenu > li').removeClass('on').eq(0).addClass('on');
		}

		// 메뉴 단독일 경우
		el.find('.allMenuWrap #allMenu .dep1').each(function(idx, obj){
			if($(obj).find('.dep2Box').length <= 0){
				$(obj).addClass('only');
			}
		});

		el.find('.allMenuWrap').addClass('on');
		setTimeout(function(){
			el.find('.allMenuWrap .allMenuList').scrollTop(0);
		}, 10);

		// 전체 메뉴 높이값 생성
		el.find('.allMenuWrap .allMenuList').css({
			height : allmenuContH
		});

		TweenMax.set(el.find('.allMenuWrap') , {opacity : 0});
		TweenMax.set(el.find('.allMenuWrap .allMenuBox') , {x : '100%'});

		TweenMax.to(el.find('.allMenuWrap') , 0.3, {opacity : 1});
		TweenMax.to(el.find('.allMenuWrap .allMenuBox') , 0.3,  {x : '0%'});
	});

	el.find('.allMenuWrap').find('.allMenuClose > a , .allMenuDim').on('click', function(e){
		e.preventDefault();

		TweenMax.to(el.find('.allMenuWrap .allMenuBox') , 0.3,  {x : '100%', onComplete : function(){
			TweenMax.to(el.find('.allMenuWrap') , 0.3, {opacity : 0, onComplete : function(){
				el.find('.allMenuWrap').removeClass('on').removeAttr('style');
				$('html').removeClass('closeHiddenOnly');
			}});
		}});
	});

	// 전체메뉴 모바일 경우
	el.find('.allMenuWrap #allMenu > li > a').on('click' , function(e){
		if($('html').hasClass('ui-m')){
			// 메뉴 단독일 경우
			if(!$(this).closest('.dep1').hasClass('only')){
				e.preventDefault();

				el.find('.allMenuWrap #allMenu .dep2.sub').removeClass('on');
				el.find('.allMenuWrap #allMenu > li').removeClass('on');
				$(this).closest('li').addClass('on');
			}
		}
	});

	el.find('.allMenuWrap #allMenu .dep2.sub > a').on('click' , function(e){
		// 모바일 경우
		if($('html').hasClass('ui-m')){
			e.preventDefault();

			if($(this).closest('.dep2.sub').hasClass('on')){
				$(this).closest('.dep2.sub').removeClass('on');
			}
			else{
				el.find('.allMenuWrap #allMenu .dep2.sub').removeClass('on');
				$(this).closest('.dep2.sub').addClass('on');
			}
		}
	});

	// 글자 크기 조정
	var nowZoom = 100;
	var maxZoom = 110;
	var minZoom = 90;

	el.find('.util .font > a').on('click' , function(e){
		e.preventDefault();

		// 더크게
		if($(this).hasClass('zoomIn')){
			if (nowZoom < maxZoom){
				nowZoom += 2;
			}
			else{
				return;
			}
		}
		// 더작게
		else if($(this).hasClass('zoomOut')){
			if (nowZoom > minZoom){
				nowZoom -= 2;
			}
			else{
				return;
			}
		}

		//TweenMax.to($('body') , 0.1, {zoom : nowZoom + '%'});
		$('body').css({zoom : nowZoom + '%'});
	});

	// 모바일 Header Fixed
	var headerfixTimer;
	$(window).off('resize.headerResize').on('resize.headerResize', function(){
		clearTimeout(headerfixTimer);
		headerfixTimer = setTimeout(function(){
			if($('html').hasClass('ui-m')){
				if($('.pageTitle').length > 0){
					el.removeClass('fixed');
					$('.pageTitle').addClass('fixed');
				}
				else{
					el.addClass('fixed');
					$('.pageTitle').removeClass('fixed');
				}
			}
			else{
				el.removeClass('fixed');
				$('.pageTitle').removeClass('fixed');
			}
		}, 60);

	}).trigger('resize.headerResize');
}

// Search UI
function searchUI(){
	var el = $('.schWrap.topSearch');
	var rankingEl = $('.schRanking');

	if(el.length <= 0 || rankingEl.length <= 0){
		return;
	}

	el.find('.detailBtn').on('click' , function(e){
		e.preventDefault();

		if($(this).closest(el).hasClass('open')){
			$(this).closest(el).removeClass('open');
			$(this).find('span.blind').text('열기');
			$(this).closest(el).find('.schDetail').removeAttr('tabindex');
		}
		else{
			$(this).closest(el).addClass('open');
			$(this).find('span.blind').text('닫기');
			$(this).closest(el).find('.schDetail').attr('tabindex' , -1).focus();
			if($('html').hasClass('ui-m')){
				$(window).scrollTop(0);
			}
		}
	});

	// 실시간 검색어
	$(document).off('scroll.rankingScroll').on('scroll.rankingScroll', function(){
		var sct = $(this).scrollTop();

		if(sct >= $('header.header')[0].clientHeight + el[0].clientHeight){
			rankingEl.stop().animate({
				marginTop : sct - ($('header.header').height() + el.outerHeight(true))
			}, 250);
		}
		else{
			rankingEl.stop();
			rankingEl.removeAttr('style');
		}

		if(sct >= $(document).height() - window.innerHeight - $('footer.footerWrap').height() - 50){
			rankingEl.stop();
			rankingEl.addClass('noFixed');
		}
		else{
			rankingEl.removeClass('noFixed');
		}
	}).trigger('scroll.rankingScroll');
}

// Site Menu
function siteMenuUI(){
	var el = $('.siteWrap');

	if(el.length <= 0){
		return;
	}

	el.find('.siteList a.open').on('click' , function(e){
		e.preventDefault();

		window.focusBtn = e.currentTarget;

		// 웹일 경우
		if($('html').hasClass('ui-w')){
			if($(this).closest(el).hasClass('on')){
				var _this = $(this);
				el.find('.popBox').stop().slideUp(350, function(){
					el.find('.popBox').removeAttr('style');
					_this.closest(el).removeClass('on');
					_this.removeClass('close').addClass('open').find('span.blind').text('열기');

					if(window.focusBtn){
						window.focusBtn.focus();
					}
				});
			}
			else{
				$(this).closest(el).addClass('on');
				$(this).removeClass('open').addClass('close').find('span.blind').text('닫기');

				el.find('.popBox').stop().slideDown(350);
				$('body, html').stop().animate({
					scrollTop : $('.siteWrap').offset().top
				}, 500);
			}
		}
		// 모바일일 경우
		else if($('html').hasClass('ui-m')){
			var _this = $(this);
			_this.closest(el).addClass('on');
			_this.closest(el).find('.popBox').show();
			_this.closest(el).find('.siteList > a.open').removeClass('open').addClass('close').find('span.blind').text('닫기');
			$('html.ui-m').addClass('closeHidden');

			TweenMax.set(el, {opacity : 0, y : '100%'});
			TweenMax.to(el, 0.5, {opacity : 1, y : '0%'});
		}
	});

	// 모바일 닫기
	el.find('.siteList .popBox a.close').on('click' , function(e){
		e.preventDefault();

		var _this = $(this);
		TweenMax.to(el, 0.5, {opacity : 0, y : '100%', onComplete : function(){
			_this.closest(el).find('.siteList > a.close').removeClass('close').addClass('open').find('span.blind').text('열기');
			_this.closest(el).removeClass('on').removeAttr('style');
			_this.closest(el).find('.popBox').hide();			
			$('html.ui-m').removeClass('closeHidden');

			if(window.focusBtn){
				window.focusBtn.focus();
			}
		}});
	});

	// resize
	var siteTimer;
	$(window).off('resize.siteResize').on('resize.siteResize', function(){
		clearTimeout(siteTimer);
		siteTimer = setTimeout(function(){
			if(el.hasClass('on')){
				$('html.ui-w').removeClass('closeHidden');
				$('html.ui-m').addClass('closeHidden');
			}
		}, 100);
	}).trigger('resize.siteResize');
}

// Lnb Navigation
function lnbNavigation(){
	var el = $('.lnbWrap');
	var lnbTimeout;

	if(el.length <= 0){
		return;
	}

	el.find('.lnb li.dep2.sub').not('.on').find(' > a').on('click' , function(e){
		e.preventDefault();

		el.find('.lnb li.dep2.active').removeClass('active').find(' > ul').hide();
		$(this).closest('li').addClass('active').find(' > ul').show();
	});

	/*el.find('.lnb li.dep2').on('mouseleave' , function(){
		lnbCommHide();
	});
*/
	
	el.find('.lnb li.dep2.sub').find('> ul li:last-child a').on('focusout' , function(){
		el.find('.lnb li.dep2.active').removeClass('active').find(' > ul').hide();
	});

	el.find('.lnb li.dep2').on('mouseenter' , function(){
		clearTimeout(lnbTimeout);
	});

	function lnbCommHide(){
		clearTimeout(lnbTimeout);
		lnbTimeout = setTimeout(function(){
			el.find('.lnb li.dep2.active').removeClass('active').find(' > ul').hide();
		}, 250);
	}
}

// 스크롤 디자인
function designScroll(obj){
	var el = $('.scrollbar');

	if(el.length <= 0){
		return;
	}

	el.each(function(){
		if($(this).closest('.selectBox').length > 0){
			if($(this).closest('.selectBox').hasClass('on') == false){
				return;
			}
		}
	});

	bindEvents();

	function bindEvents(){
		el.each(function(){
			if($(this).closest('.selectBox').length <= 0){
				$(this).jScrollPane({
					mouseWheelSpeed : 100,
					animateScroll: true
				});
			}
			else{
				$(obj).filter(el).jScrollPane({
					mouseWheelSpeed : 100,
					animateScroll: true
				});
			}
		});
	}
}


// 레이어 팝업 콜백함수
function callbackFunc(){
	return;
}

// 레이어 팝업
function gfnOpenLayer(popupContent, _this){
	var settings = {
		width : '100%',
		minHeight : '100%',
		opacity : 0,
		y : 0
	}

	TweenMax.set(popupContent, settings);
	TweenMax.set(popupContent.find('.layerPopArea'), {y : -200 , opacity : 0});
	popupContent.show();
	popupContent.closest('html').addClass('closeHidden');

	TweenMax.to(popupContent, 0.5, {
		opacity : 1,
		y : 0,
		onComplete : function() {
			popupContent.css({transform : 'initial'});
		}
	});

	TweenMax.to(popupContent.find('.layerPopArea'), 0.7, {
		opacity : 1,
		y : 0,
		onComplete : function() {
			popupContent.find('.layerPopArea').css({transform : 'initial'});
			popupContent.find('.layerPopArea .layerHead .tit').attr('tabIndex' , -1).focus();
			popupContent.scrollTop(0);

			return callbackFunc(); // callback
		}
	});

	// 팝업 높이가 윈도우 높이 보다 클경우
	if(window.innerHeight - 100 <= popupContent.find('.layerPopArea').outerHeight()){
		popupContent.find('.layerPopArea').css({
			top : 120,
			marginBottom : 100
		});
	}
	else{
		//가운데 정렬
		popupContent.find('.layerPopArea').css({
			marginTop : -popupContent.find('.layerPopArea').outerHeight() / 2
		});
	}

	// 레이어 팝업 오픈시 셀렉트 박스 ReFresh
	selectBoxReFresh(popupContent.find('select.select'));

	// 레이어 닫기
	popupContent.find('.btnLayerClose').off('click.closeEvent').on('click.closeEvent', function(e){
		e.preventDefault();
		$(this).closest(popupContent).hide();
		$(this).closest(popupContent).find('.layerPopArea').removeAttr('style');
		$(this).closest('html').removeClass('closeHidden');

		if(window.focusBtn){
			window.focusBtn.focus();
		}
	});
}

// 레이어 팝업 닫기
function gfnCloseLayer(popupContent){
	$(popupContent).hide();
}

// 컨펌 레이어
function confirmLayer(message, type, btnConfirm, btnCancel){
	// type
	// save : 저장 / del : 삭제 / 선택 : select
	var htmlMarkup = '';

	htmlMarkup += '<div class="layerPop confirm ' + type + ' htmlAdd">',
	htmlMarkup += '<div class="layerPopArea">',
	htmlMarkup += '<div class="layerCont">',
	htmlMarkup += '<span class="ico"></span>',
	htmlMarkup += '<p class="message">' + message + '</p>',
	htmlMarkup += '<div class="btnArea">',
	htmlMarkup += '<span><a href="#" class="btn btnConfirm">' +  btnConfirm + '</a></span>',
	htmlMarkup += '<span><a href="#" class="btn bk btnClose">' +  btnCancel + '</a></span>',
	htmlMarkup += '</div>',
	htmlMarkup += '</div>',
	htmlMarkup += '<a href="#" class="btnLayerClose">레이어 닫기</a>',
	htmlMarkup += '</div>',
	htmlMarkup += '</div>'

	$('body').append(htmlMarkup);

	var defer = $.Deferred();
	var popupContent = $('.layerPop.confirm.htmlAdd');
	var settings = {
		position : 'fixed',
		width : '100%',
		minHeight : '100%',
		opacity : 0,
		y : 0
	}

	TweenMax.set(popupContent , settings);
	TweenMax.set(popupContent.find('.layerPopArea'), {y : -200 , opacity : 0});
	popupContent.show();

	TweenMax.to(popupContent , 0.4 ,{
		opacity : 1,
		y : 0,
		onComplete : function(){
			popupContent.css({transform : 'initial'});
		}
	});

	TweenMax.to(popupContent.find('.layerPopArea'), 0.7, {
		opacity : 1,
		y : 0,
		onComplete : function() {
			popupContent.find('.layerPopArea').css({transform : 'initial'});
			popupContent.find('.layerPopArea .layerCont .message').attr('tabIndex' , -1).focus();
			popupContent.scrollTop(0);
		}
	});

	// 레이어 닫기
	popupContent.find('.btnLayerClose').on('click', function(e){
		e.preventDefault();
		$(this).closest(popupContent).remove();

		if(window.focusBtn){
			window.focusBtn.focus();
		}

		defer.resolve(false);
	});

	// 레이어 취소 닫기
	popupContent.find('.btnClose').on('click', function(e){
		e.preventDefault();
		$(this).closest(popupContent).remove();

		if(window.focusBtn){
			window.focusBtn.focus();
		}

		defer.resolve(false);
	});

	// 레이어 수락 닫기
	popupContent.find('.btnConfirm').on('click', function(e){
		e.preventDefault();
		$(this).closest(popupContent).remove();

		if(window.focusBtn){
			window.focusBtn.focus();
		}

		defer.resolve(true);
	});

	return defer.promise();
}

//팝업 - 윈도우
function pop_window(url,w,h){
    window.open(url, "팝업" , "width="+w+",height="+h+', scrollbars=yes, resizable=no, toolbar=no, top=100, left=100');
}

// Main UI
function mainUI(){
	var el = $('.main');

	if(el.lengt <= 0){
		return;
	}

	// 비쥬얼 롤링
	var visualSwiper;
	var visualSize = el.find('.topRolling').find('li').length;

	// 2개 이상일때 슬라이드
	if(visualSize > 1){
		$(".topRolling > ul").bxSlider({
			auto: true,
			pager: true,
			controls: false,
			autoControls: true
		});
		
		/*visualSwiper = new Swiper(el.find('.topRolling'), {
			loop : true,
			autoplay : 5000,
			preventClicks : false,
			speed : 300,
			paginationClickable : true,
			slidesPerView : 1,
			simulateTouch : false,
			onInit : function(swiper){
				// dot html
				var dotHtml = '';
				for(var i=1; i <= visualSize; i++){
					dotHtml += '<a href="#">' + i +'번 비주얼로 이동</a>';
				}
				el.find('.topRolling .ctrlBox .dot').html(dotHtml);
				el.find('.topRolling .ctrlBox .dot > a').eq(0).addClass('on').append('<span class="blind">선택됨</span>');

				// reset
				el.find('.topRolling .ctrlBox .play').hide();

				// Play Button
				el.find('.topRolling .ctrlBox .play').on('click' , function(e){
					e.preventDefault();

					visualSwiper.startAutoplay();

					el.find('.topRolling .ctrlBox .play').hide();
					el.find('.topRolling .ctrlBox .stop').show();

					el.find('.topRolling .ctrlBox a').focus();
				});

				// Stop Button
				el.find('.topRolling .ctrlBox .stop').on('click' , function(e){
					e.preventDefault();

					visualSwiper.stopAutoplay();

					el.find('.topRolling .ctrlBox .stop').hide();
					el.find('.topRolling .ctrlBox .play').show();

					el.find('.topRolling .ctrlBox a').focus();
				});

				// dot Click
				el.find('.topRolling .ctrlBox .dot').find('> a').on('click' , function(e){
					e.preventDefault();

					var idx = $(this).index();

					visualSwiper.slideTo(idx+1);
					visualSwiper.stopAutoplay();

					el.find('.topRolling .ctrlBox .dot').find('> a').removeClass('on');
					el.find('.topRolling .ctrlBox .dot').find('> a').eq(idx).addClass('on');

					el.find('.topRolling .ctrlBox .dot').find('> a').find('span.blind').remove();
					el.find('.topRolling .ctrlBox .dot').find('> a').eq(idx).addClass('on').append('<span class="blind">선택됨</span>');

					el.find('.topRolling .ctrlBox .stop').hide();
					el.find('.topRolling .ctrlBox .play').show();
				});

				// aria-hidden
				resizeAttrFn(el.find('.topRolling'));

				// Resize swiper Update
				var visualTimer;
				$(window).off('resize.visualResize').on('resize.visualResize' , function(){
					clearTimeout(visualTimer);
					visualTimer = setTimeout(function(){
						swiper.update(true);
					}, 50);
				}).trigger('resize.visualResize');
			},
			onSlideChangeStart : function(swiper){
				var idx = swiper.activeIndex;

				if(idx > visualSize){
					idx = 1;
				}

				// dot html
				el.find('.topRolling .ctrlBox .dot').find('> a').removeClass('on');
				el.find('.topRolling .ctrlBox .dot').find('> a').eq(idx-1).addClass('on');

				el.find('.topRolling .ctrlBox .dot').find('> a').find('span.blind').remove();
				el.find('.topRolling .ctrlBox .dot').find('> a').eq(idx-1).addClass('on').append('<span class="blind">선택됨</span>');

				// aria-hidden
				resizeAttrFn(el.find('.topRolling'));
			},
			onAutoplayStop : function(){
				el.find('.topRolling .ctrlBox .stop').hide();
				el.find('.topRolling .ctrlBox .play').show();
			},
			breakpoints : {
				767 : {
					slidesPerView : 1,
					simulateTouch : true
				}
			}
		});*/
	}
	else{
		// 컨트롤 Hide
		el.find('.topRolling').find('.ctrlWrap').hide();
	}

	// 비쥬얼 배경 체크
	if(navigator.userAgent.indexOf("Trident/4") == -1 && navigator.userAgent.indexOf("Trident/5") == -1){
		el.find('.topRolling').find('.swiper-slide').each(function(idx, obj){
			for(var x=0; x<visualSize; x++){
				getImageBrightness($(obj).find('.img img').attr('src'), function(brightness){
					if(brightness <= 150){
						$(obj).addClass('turn');
					}
				});
			}
		});
	}

	// 팝업존 롤링
	var pZoneSwiper;
	var pZoneSize = el.find('.bnrRolling').find('li').length;

	// 2개 이상일때 슬라이드
	if(pZoneSize > 1){
		$(".bnrRolling > ul").bxSlider({
			auto: true,
			pager: false,
			controls: true,
			autoControls: true
		});
		/*pZoneSwiper = new Swiper(el.find('.bnrRolling'), {
			loop : true,
			autoplay : 6000,
			preventClicks : false,
			nextButton : el.find('.bnrRolling .ctrl .next'),
			prevButton : el.find('.bnrRolling .ctrl .prev'),
			speed : 300,
			paginationClickable : true,
			slidesPerView : 1,
			simulateTouch : false,
			onInit : function(swiper){
				// dot html
				var dotHtml = '';
				for(var i=1; i <= pZoneSize; i++){
					dotHtml += '<a href="#">' + i +'번 배너로 이동</a>';
				}
				el.find('.bnrRolling .ctrlBox .dot').html(dotHtml);
				el.find('.bnrRolling .ctrlBox .dot > a').eq(0).addClass('on').append('<span class="blind">선택됨</span>');

				// reset
				el.find('.bnrRolling .ctrlBox .play').hide();

				// Play Button
				el.find('.bnrRolling .ctrlBox .play').on('click' , function(e){
					e.preventDefault();

					pZoneSwiper.startAutoplay();

					el.find('.bnrRolling .ctrlBox .play').hide();
					el.find('.bnrRolling .ctrlBox .stop').show();

					el.find('.bnrRolling .ctrlBox a').focus();
				});

				// Stop Button
				el.find('.bnrRolling .ctrlBox .stop').on('click' , function(e){
					e.preventDefault();

					pZoneSwiper.stopAutoplay();

					el.find('.bnrRolling .ctrlBox .stop').hide();
					el.find('.bnrRolling .ctrlBox .play').show();

					el.find('.bnrRolling .ctrlBox a').focus();
				});

				// dot Click
				el.find('.bnrRolling .ctrlBox .dot').find('> a').on('click' , function(e){
					e.preventDefault();

					var idx = $(this).index();

					pZoneSwiper.slideTo(idx+1);
					pZoneSwiper.stopAutoplay();

					el.find('.bnrRolling .ctrlBox .dot').find('> a').removeClass('on');
					el.find('.bnrRolling .ctrlBox .dot').find('> a').eq(idx).addClass('on');

					el.find('.bnrRolling .ctrlBox .dot').find('> a').find('span.blind').remove();
					el.find('.bnrRolling .ctrlBox .dot').find('> a').eq(idx).addClass('on').append('<span class="blind">선택됨</span>');

					el.find('.bnrRolling .ctrlBox .stop').hide();
					el.find('.bnrRolling .ctrlBox .play').show();
				});

				// aria-hidden
				resizeAttrFn(el.find('.bnrRolling'));

				// Resize swiper Update
				var pZoneTimer;
				$(window).off('resize.pZoneResize').on('resize.pZoneResize' , function(){
					clearTimeout(pZoneTimer);
					pZoneTimer = setTimeout(function(){
						swiper.update(true);
					}, 50);
				}).trigger('resize.pZoneResize');
			},
			onSlideChangeStart : function(swiper){
				var idx = swiper.activeIndex;

				if(idx > pZoneSize){
					idx = 1;
				}

				// dot html
				el.find('.bnrRolling .ctrlBox .dot').find('> a').removeClass('on');
				el.find('.bnrRolling .ctrlBox .dot').find('> a').eq(idx-1).addClass('on');

				el.find('.bnrRolling .ctrlBox .dot').find('> a').find('span.blind').remove();
				el.find('.bnrRolling .ctrlBox .dot').find('> a').eq(idx-1).addClass('on').append('<span class="blind">선택됨</span>');

				// aria-hidden
				resizeAttrFn(el.find('.bnrRolling'));
			},
			onAutoplayStop : function(){
				el.find('.bnrRolling .ctrlBox .stop').hide();
				el.find('.bnrRolling .ctrlBox .play').show();
			},
			breakpoints : {
				767 : {
					slidesPerView : 1,
					simulateTouch : true
				}
			}
		});*/
	}
	else{
		// 컨트롤 Hide
		el.find('.bnrRolling').find('.ctrlBox').hide();
	}

	// 주요메뉴 롤링
	var menuSwiper;
	menuSwiper = new Swiper(el.find('.favorite .rolling .innerRolling'), {
		loop : false,
		nextButton : el.find('.favorite .rolling .ctrl .next'),
		prevButton : el.find('.favorite .rolling .ctrl .prev'),
		speed : 300,
		slidesPerView : 6,
		slidesPerGroup : 6,
		simulateTouch : false,
		onInit : function(swiper){
			// Resize swiper Update
			var menuTimer;
			$(window).off('resize.menuResize').on('resize.menuResize' , function(){
				clearTimeout(menuTimer);
				menuTimer = setTimeout(function(){
					swiper.update(true);
				}, 50);
			}).trigger('resize.menuResize');
		},
		breakpoints : {
			1024 : {
				slidesPerView : 3,
				slidesPerGroup : 3,
				simulateTouch : true
			},
			767 : {
				slidesPerView : 3,
				slidesPerGroup : 3,
				simulateTouch : true
			}
		}
	});

	// 메인배너 롤링
	var bnrSwiper;
	if($('.relationBnr .rolling').length > 0){
		setTimeout(function(){
			$('.relationBnr .rolling').slick({
				autoplay:true,
				slidesToShow:4,
				slidesToScroll:1,
				infinite:true,
				responsive:[
				    {
						breakpoint:1024,
						settings:{
							slidesToShow:3
						}
				    },
				    {
						breakpoint:767,
						settings:{
							slidesToShow:2
						}
				    }
				]
			});
			$('.relationBnr .stop').on('click',function(){
				$('.relationBnr .rolling').slick('slickPause');
				$('.relationBnr .ctrl button').removeClass('on');
				$(this).addClass('on');
			});
			$('.relationBnr .play').on('click',function(){
				$('.relationBnr .rolling').slick('slickPlay');
				$('.relationBnr .ctrl button').removeClass('on');
				$(this).addClass('on');
			});
			if($('.relationBnr .rolling a').length < 5){
				$('.relationBnr').addClass("buttonPcHide");
			}
		}, 100);		
	}
	/*bnrSwiper = new Swiper('.relationBnr .rolling', {
		loop : true,
		autoplay : 4000,
		preventClicks : false,
		paginationClickable : true,
		nextButton : '.relationBnr .ctrl .next',
		prevButton : '.relationBnr .ctrl .prev',
		speed : 300,
		slidesPerView : 4,
		simulateTouch : false,
		spaceBetween : 10,
		onInit : function(swiper){
			// Resize swiper Update
			var relationBnrTimer;
			$(window).off('resize.relationBnrResize').on('resize.relationBnrResize' , function(){
				clearTimeout(relationBnrTimer);
				relationBnrTimer = setTimeout(function(){
					swiper.update(true);
				}, 50);
			}).trigger('resize.relationBnrResize');

			// reset
			$('.relationBnr .ctrl .play').hide();

			// Play Button
			$('.relationBnr .ctrl .play').on('click' , function(e){
				e.preventDefault();
				bnrSwiper.startAutoplay();
				$('.relationBnr .ctrl .play').hide();
				$('.relationBnr .ctrl .stop').show();
				$('.relationBnr .ctrl a').focus();
			});

			// Stop Button
			$('.relationBnr .ctrl .stop').on('click' , function(e){
				e.preventDefault();
				bnrSwiper.stopAutoplay();
				$('.relationBnr .ctrl .stop').hide();
				$('.relationBnr .ctrl .play').show();
				$('.relationBnr .ctrl a').focus();
			});
		},
		breakpoints : {
			1024 : {
				slidesPerView : 3,
				simulateTouch : true,
				spaceBetween : 15
			},
			767 : {
				slidesPerView : 2,
				simulateTouch : true,
				spaceBetween : 15
			}
		}
	});*/

	function resizeAttrFn(obj){
		$(window).on('resize.slideResize' , function(){
			el.find(obj).find('.swiper-slide').each(function(idx, obj){
				$(obj).attr('aria-hidden' , true);
				$(obj).filter('.swiper-slide-active').attr('aria-hidden' , false);
			});
		}).trigger('resize.slideResize');
	}

	// 메인 탭
	el.find('.mainTab').closest('.mainCont').each(function(idx, obj){
		if($(obj).find('.mainTab > li').hasClass('on')){
			$(obj).find('.mainTab > li').each(function(){
				var idx = $(this).filter('.on').index();
				if(idx >= 0){
					$(obj).find('.mainTab > li').eq(idx).addClass('on').siblings().removeClass('on');
					$(obj).find('.mainTab > li span.blind').remove();
					$(obj).find('.mainTab > li.on > a').append('<span class="blind">선택됨</span>');
					$(obj).find('.mainTabCont > .tabCont').hide().eq(idx).show();
				}

			});
		}
		else{
			$(obj).find('.mainTab > li').eq(0).addClass('on').siblings().removeClass('on');
			$(obj).find('.mainTab > li span.blind').remove();
			$(obj).find('.mainTab > li.on > a').append('<span class="blind">선택됨</span>');
			$(obj).find('.mainTabCont > .tabCont').hide().eq(0).show();
		}

		bindEvents(obj);
	});

	function bindEvents(obj){
		var $this = $(obj);

		$this.find('.mainTab > li > a').on('click', function(e){
			e.preventDefault();
			var index = $(this).closest('li').index();

			if($this.find('.mainTabCont > .tabCont').eq(index).length <= 0){
				return;
			}

			$(this).closest('.mainCont').find('.mainTab > li span.blind').remove();
			$(this).append('<span class="blind">선택됨</span>');
			$(this).closest('.mainCont').find('.mainTab > li').eq(index).addClass('on').siblings().removeClass('on');
			$(this).closest('.mainCont').find('.mainTabCont > .tabCont').hide().eq(index).show();
		});
	}

}

// 탭 메뉴
function tabUI() {
	var el;

	el = $('.tabWrap');

	if(el.length <= 0){
		return;
	}

	el.each(function(idx, obj){
		if($(obj).find('.tab > li').hasClass('on')){
			$(obj).find('.tab > li').each(function(){
				var idx = $(this).filter('.on').index();
				if(idx >= 0){
					$(obj).find('.tab > li').eq(idx).addClass('on').siblings().removeClass('on');
					$(obj).find('.tab > li span.blind').remove();
					$(obj).find('.tab > li.on > a').append('<span class="blind">선택됨</span>');
					$(obj).find('> .tabCont').hide().eq(idx).show();
				}

			});
		}
		else{
			$(obj).find('.tab > li').eq(0).addClass('on').siblings().removeClass('on');
			$(obj).find('.tab > li span.blind').remove();
			$(obj).find('.tab > li.on > a').append('<span class="blind">선택됨</span>');
			$(obj).find('> .tabCont').hide().eq(0).show();
		}

		bindEvents(obj);
	});

	function bindEvents(obj){
		var $this = $(obj);

		$this.find('.tab > li > a').on('click', function(e){
			e.preventDefault();
			var index = $(this).closest('li').index();
			var tabPos = $(this).closest(el).find('.tab > li').eq(index).offset().left;

			if($this.find('> .tabCont').eq(index).length <= 0){
				return;
			}

			$(this).closest(el).find('.tab > li span.blind').remove();
			$(this).append('<span class="blind">선택됨</span>');
			$(this).closest(el).find('.tab > li').eq(index).addClass('on').siblings().removeClass('on');
			$(this).closest(el).find('> .tabCont').hide().eq(index).show();
			$(this).closest('.tabArea').scrollLeft(tabPos);

			// 셀렉트 박스가 있을 경우
			if($this.find('.tabCont').find('.selectBoxWrap').length > 0){
				selectBoxReFresh($this.find('.tabCont').find('select.select'));
			}
		});
	}
}

// datepickerUI ( 달력 UI)
function datepickerUI(){
	var el;
	var elBtn;
	var elIco;

	el = $('.inputDate').find('input:text');
	elBtn = $('.ui-datepicker-trigger');
	elIco = $('.btnCalendar');

	bindEvents();

	function defaultOption(){
	    if($.datepicker && !window.GROBAL_DATAPICKER){
	        $.datepicker.regional["ko"] = {
	            closeText: "닫기",
	            prevText: "이전달",
	            nextText: "다음달",
	            currentText: "오늘",
	            monthNames: ["01","02","03","04","05","06","07","08","09","10","11","12"],
	            monthNamesShort: ["01","02","03","04","05","06","07","08","09","10","11","12"],
	            dayNames: ["일", "월", "화", "수", "목", "금", "토"],
	            dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
	            dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
	            weekHeader: "Wk",
	            dateFormat: "yy-mm-dd",
	            buttonText: '달력보기',
	            showMonthAfterYear: true,
	            yearSuffix: "",
	            //yearRange: "1930:2047",
	            //selectOtherMonths: true,
	            showOtherMonths: true,
	            showButtonPanel: false,
	            changeMonth: false,
	            changeYear: false,
	            constrainInput: true,
	            showOn: 'button',
	            //buttonImageOnly:true,
	            buttonText:'Select date',
	            onSelect : function(dateText, inst){
	                $(this).focus();
	            }
	        };
	        $.datepicker.setDefaults($.datepicker.regional['ko']);
	        window.GROBAL_DATAPICKER = true;
	    }
	}

	function bindEvents(){
	    defaultOption();

	    if($.datepicker){
	        el.datepicker();

	        elBtn = $('.ui-datepicker-trigger');
	        elIco = $('.btnCalendar');
	        elBtn.hide();

	        // 키보드 접근 불가능하게 하기 위해 href 제거
	        elIco.attr('aria-hidden', true);
	        elIco.removeAttr('href').css('cursor','pointer');
	        elIco.off('click.eventCalendar').on('click.eventCalendar' , function(e){
	            e.preventDefault();
	            $(this).closest('.inputDate').find('.ui-datepicker-trigger').trigger('click');
	            $(this).closest('.inputDate').find('input:text').trigger('focus');
	        });

	        $(document).off('click.eventCalendar').on('click.eventCalendar' , '.inputDate input:text',  function(e){ // 동적으로 클릭으로 변경
	            e.preventDefault();
	            $(this).closest('.inputDate').find('.ui-datepicker-trigger').trigger('click');
	            $(this).closest('.inputDate').find('input:text').trigger('focus');
	        });
	    }
	}
}

// 파일 첨부
function fileUploadUI(){
	var el = $('.fileBox');

	if(el.length <= 0){
		return;
	}

	$(".uploadBtn").change(function(){
		var filename = $(this).val().split('/').pop().split('\\').pop();
		$(this).siblings('.fileName').val(filename);
	});
	
	/*el.each(function(idx, obj){
		var uploadFile = $(obj).find('.uploadBtn');

        $(document).on('change', uploadFile, function(e){
            var filename;
            if(window.FileReader){
                if( e.data[0].files[0] )		filename = e.data[0].files[0].name;
                else							filename = '';
            } else {
                filename = $(this).val().split('/').pop().split('\\').pop();
            }
            $(e.data[0]).siblings('.fileName').val(filename);
        });
	});*/
}

// 아코디언
function accodianUI() {
	var el;

	el = $('.toggleList');

	if(el.length <= 0){
		return;
	}

	el.find('>ul>li').removeClass('on');
	el.find('>ul>li>dl>dt>a').append('<span class="blind">접기</span>');

	bindEvents();

	function bindEvents(){
		el.find('>ul>li>dl>dt>a').off('click.accodianEvt').on('click.accodianEvt', function(e){
			e.preventDefault();

			var index = $(this).closest('li').index();

			el.find('>ul>li').each(function(idx, obj){
				if(idx == index){
					if($(obj).hasClass('on')){
						$(obj).removeClass('on');
						$(obj).find('dl>dt>a').find('span.blind').remove();
						$(obj).find('dl>dt>a').append('<span class="blind">접기</span>');
					}else{
						$(obj).addClass('on');
						$(obj).find('dl>dt>a').find('span.blind').remove();
						$(obj).find('dl>dt>a').append('<span class="blind">펼치기</span>');
					}
				}else{
					$(obj).find('dl>dt>a').find('span.blind').remove();
					$(obj).find('dl>dt>a').append('<span class="blind">접기</span>');
					$(obj).removeClass('on');
				}
			});

		});
	}
}

// imagesMapsUI
function imagesMapsUI(){
	setTimeout(function(){
		var el = $('img[usemap]');

		if(el.length <= 0){
			return;
		}

		el.each(function(idx, obj){
			jQuery(obj).rwdImageMaps();
		});
	},100);
}

// graphToggleUI(){
function graphToggleUI(){
	var el = $('.graphToggle');

	if(el.length <= 0){
		return;
	}

	el.find('.imgGraph map area').on('click', function(e){
		e.preventDefault();

		var idx = $(this).index();
		var sct;

		if($('html').hasClass('ui-w')){
			sct = el.find('.infoBox.on').offset().top;
		}
		else if($('html').hasClass('ui-m')){
			sct = el.find('.infoBox.on').offset().top - ($('header.header').outerHeight(true) + $('.pageTitle').outerHeight(true));
		}

		el.find('.infoBox').removeClass('on');
		el.find('.infoBox').eq(idx).addClass('on');

		$('body, html').stop().animate({
			scrollTop : sct
		});
	});
}

// Footer UI
function footerUI(){
	var el = $('#footer');

	if(el.length <= 0){
		return;
	}

	// 푸터 블로그 레이어 Open
	el.find('.blog').on('click', function(e){
		e.preventDefault();

		window.focusBtn = e.currentTarget;
		gfnOpenLayer($('.layerPop#blogList') , $(this));
	});
}

// CmdBoxChangeUI // 역사 체험관 일부 콘텐츠 해당
function cmdBoxChangeUI(){
	var el = $('.cmdBox.etc');

	if(el.length <= 0){
		return;
	}

	var imgPaste = el.find('.imgDeco').clone();
	var imgpasteTimer;
	$(window).off('resize.cmdEtcResize').on('resize.cmdEtcResize' , function(){
		clearTimeout(imgpasteTimer);

		imgpasteTimer = setTimeout(function(){
			var winW = window.innerWidth;

			if(winW > 1024){
				el.find('.imgDeco').remove();
				el.append(imgPaste);
			}
			else if(winW <= 1024){
				el.find('.imgDeco').remove();
				el.prepend(imgPaste);
			}
		}, 50);
	}).trigger('resize.cmdEtcResize');
}

$(function(){
	deviceCheckUI();
	ResponsiveImages();
	$(window).on('resize', function(){
		ResponsiveImages();
	});
	formControl();
	headerUI();
	searchUI();
	lnbNavigation();
	siteMenuUI();
	designScroll();
	imgHoverUI();
	mainUI();
	datepickerUI();
	fileUploadUI();
	videoUI();
	tabUI();
	accodianUI();
	imagesMapsUI();
	graphToggleUI();
	footerUI();
	cmdBoxChangeUI();

	// 상단 비쥬얼 모바일일 경우 Show / Hide
	$(document).on('click' , '.cmdBox .cmdBtn', function(e){
		e.preventDefault();

		$(this).parent('dd').toggleClass('on');
		$(this).closest('.cmdInfo').toggleClass('on');
	});
	// 평가하기
	$(document).on('click' , '.evalWrap .link', function(e){
		e.preventDefault();

		$(this).closest('.evalWrap').toggleClass('on');
	});
	
	//IE버전체크
	if(navigator.userAgent.indexOf("Trident/4") != -1){
		$("html").addClass("ie8");
	}else if(navigator.userAgent.indexOf("Trident/5") != -1){
		$("html").addClass("ie9");
	}
	
	$(document).on("click", "html.ie9 a", function(e){
		if($(this).attr("href").indexOf("fileDownload") != -1){
			e.preventDefault();
			var fileUrl = $(this).attr("href");
			var fileName = fileUrl.split("file_name=")[1].split("&")[0];
			var fileNameEncode = encodeURIComponent(fileName);
			var fileUrlEncode = fileUrl.replace(fileName, fileNameEncode);
			if($(this).attr("target") == "_blank"){
				window.open(fileUrlEncode);
			}else{
				location.href = fileUrlEncode;
			}
			console.log(fileUrlEncode);
		}
	});
	
	//상단메뉴 너비조정
	if($("#gnb.menu > .dep1").length > 6){
		var gnbWidthSub = 0;
		$("#gnb.menu > .dep1 > a").each(function(){
			gnbWidthSub += parseInt($(this).width());
		});
		var marginLeft = (780 - gnbWidthSub - (5*$("#gnb.menu > .dep1").length))/$("#gnb.menu > .dep1").length;
		$("#gnb.menu > .dep1").css("margin-left",marginLeft+"px");
	}
	
	//지방청 공지사항 슬라이드
	if($(".notiBar ul").length > 0){
		$(".notiBar ul").bxSlider({
			auto:true,
			mode:'vertical',
			pager:false,
			controls:false
		});
	}
	
	var el = $('#footer');

	if(el.length <= 0){
		return;
	}

	// 유관기관배너 전체보기
	$('.relationBnr .more').on('click', function(e){
		e.preventDefault();

		window.focusBtn = e.currentTarget;
		gfnOpenLayer($('.layerPop#relationList') , $(this));
	});
	
	//뒤로가기
	$(".pageTitle .btnBack").click(function(e){
		e.preventDefault();
		goBack();		
	});	
	
	$(document).on("click",".mainLayer",function(){
		$(".mainLayer").removeClass("active");
		$(this).addClass("active");
	});

	// 팝업 레이어 닫기
/*	popupContent.find('.btnLayerClose').off('click.closeEvent').on('click.closeEvent', function(e){
		e.preventDefault();
		$(this).closest(popupContent).hide();
		$(this).closest(popupContent).find('.layerPopArea').removeAttr('style');
		$(this).closest('html').removeClass('closeHidden');

		if(window.focusBtn){
			window.focusBtn.focus();
		}
	});*/
	
	
	$(document).on("click",".img_mainLayerClose",function(){
		var mainLayerId = $(this).parents(".mainLayer").attr("id");	
        if ( $("#"+mainLayerId +" input").is(":checked")){						
			setCookieCommon(mainLayerId, "Y", 1);	
		} 
		$(this).parents(".mainLayer").hide();
	});	
	
	/*2020 웹접근성 checkbox 로 변경
	$(document).on("click",".btn_mainLayerClose",function(){
		$(this).parents(".mainLayer").hide();
	});
	*/
	/** 2020 웹접근성 (checkbox 사용) 200518 */
	$(document).on("click",".btn_mainLayerClose",function(){
		var mainLayerId = $(this).parents(".mainLayer").attr("id");	
        if ( $("#"+mainLayerId +" input").is(":checked")){						
			setCookieCommon(mainLayerId, "Y", 1);	
		} 
		$(this).parents(".mainLayer").hide();
	});
		
	$(document).on("click",".btn_mainLayerToday",function(){
		var mainLayerId = $(this).parents(".mainLayer").attr("id");
		setCookieCommon(mainLayerId, "Y", 1);
		$(this).parents(".mainLayer").hide();
	});
	
	$(".topRolling li p").each(function(){
		if($("html").hasClass("ui-m")){
			if($(window).width() > 767){
				$(this).css("color",$(this).attr("data-media-tablet"));
			}else{
				$(this).css("color",$(this).attr("data-media-mobile"));
			}
		}else{
			$(this).css("color",$(this).attr("data-media-pc"));
		}
	});	
	
	/* 게시판 이미지 새창열기 */
	var windowWidth = $(window).width();
	$(document).on("click",".ui-m .brdView dl.view dd .cont img", function(){
		if(windowWidth < 768 && $(this).parent("a").length == 0 && $(this).prop("naturalWidth") > windowWidth){
			window.open("/html/img_viewer.html?url="+$(this).attr("src"));
		}
	});
	
	/* 웹접근성 포커스 */
	$(".btn.search a").click(function(e){
		e.preventDefault();
		$(".schArea input[type='text']").focus();
	});
	$(".schClose a").click(function(e){
		e.preventDefault();
		$(".btn.search a").focus();
	});
	$(".allMenuClose a").click(function(e){
		e.preventDefault();
		$(".btn.allmenu a").focus();
	});
	$(".selectBox .layerOption .option a").click(function(e){
		e.preventDefault();
		$(this).parents(".layerOption").siblings(".selected").focus();
	});
	
	
	/* 웹접근성 메인 탭 포커스  */
	$(document).on("keydown",".mainTab li a", function(e){
		e.preventDefault();
		if(e.shiftKey && e.keyCode == 9){
			if($(this).parents(".mainTab").find("li.on").prev().find("a").length > 0){
				$(this).parents(".mainTab").find("li.on").prev().find("a").focus().trigger("click");
			}else{
				$(this).parents(".mainCont").prev().find("a").focus();
			}
		}else if(e.keyCode == 9){
			if($(this).parents(".mainTab").siblings(".mainTabCont").children(".tabCont").eq($(this).parent().index()).find("a").length > 0){				
				$(this).parents(".mainTab").siblings(".mainTabCont").children(".tabCont").eq($(this).parent().index()).find("a").eq(0).focus();
			}else{
				if($(this).parents(".mainTab").find("li.on").next().length > 0){
					e.preventDefault();
					$(this).parents(".mainTab").find("li.on").next().find("a").eq(0).focus().trigger("click");
				}
			}
		}
	});
	$(".mainTabCont .tabCont").each(function(){
		$(this).find("a").last().keydown(function(e){
			e.preventDefault();
			if(e.shiftKey && e.keyCode == 9){				
				$(this).parent().prev().find("a").last().focus();
			}else if(e.keyCode == 9){
				if($(this).parents(".mainTabCont").siblings(".mainTab").find("li.on").next().length > 0){
					$(this).parents(".mainTabCont").siblings(".mainTab").children("li.on").next().children("a").focus().trigger("click");
				}else{
					$(this).parents(".mainCont").next().find("a").first().focus();				
				}
			// 2020 웹접근성 추가 0522				
			}else if(e.keyCode == 13){
				if($(this).attr("href").length > 0){
					location.href = $(this).attr("href");
				}
			}				
			//-end
		});
		$(this).find("a").first().keydown(function(e){
			if(e.shiftKey && e.keyCode == 9){
				e.preventDefault();
				$(this).parents(".mainTabCont").siblings(".mainTab").find("li.on").find("a").focus();
			}
		});
	});
	/* 접근성 추가 js*/
	$(".bx-viewport").each(function(){
		$(this).find("a").eq(0).focus(function(){
			$(this).parents("ul").eq(0).css("transform","translate3d(0px, 0px, 0px)");
		});
	});
	
	var titleText = $("title").text().split('-')[0];
	if($(".tabArea .tab li").length > 0){
		
		var currTab = $(".tabArea .tab li.on a").text();
		var currTabNot = currTab.replace('선택됨','');
		if($(".tabArea").next(".tabsArea").length > 0){
			var currTab2 = $(".tabsArea .tabs li.on a").text();
			var currTabNot2 = currTab2.replace('선택됨','');
			titleText += "> " + currTabNot + "> " + currTabNot2 ;
		}else{
			titleText += "> " + currTabNot ;
		}	
	}
	if($(".uCertiWrap").length > 0){
		titleText += ">" + " 본인확인";
	}
	$("title").text(titleText + "- 대검찰청");
	
});

$(window).resize(function(){
	$(".topRolling li p").each(function(){
		if($("html").hasClass("ui-m")){
			if($(window).width() > 767){
				$(this).css("color",$(this).attr("data-media-tablet"));
			}else{
				$(this).css("color",$(this).attr("data-media-mobile"));
			}
		}else{
			$(this).css("color",$(this).attr("data-media-pc"));
		}
	});
	/*$('a').each(function(){		
		if($(this).attr("href").indexOf("kics.go.kr") != -1){	
			
			if($("html").hasClass("ui-m")){					
				$(this).attr("href", "http://m.kics.go.kr");
			}else{
				$(this).attr("href", kicsUrl);
			}
		}
	});*/
});

// Mobile tab Activity
$(window).on('load' , function(){
	if($('.ui-m .tabArea').length > 0 || $('.ui-m .tabsArea').length > 0){
		$('.ui-m .tabArea, .ui-m .tabsArea').each(function(idx, obj){
			var tabPos = $(obj).find('li.on').offset().left;

			$(obj).scrollLeft(tabPos);
		});
	}	
	
	$('.ui-m a').each(function(){
		if($(this).attr("href").indexOf("http://www.kics") != -1){	
			kicsUrl = $(this).attr("href");
			$(this).attr("href", "http://m.kics.go.kr");
		}
	});	
	
	
});

function printView(){
	window.open("/site/spo/common/Print.do", "p_pop", "width=850,height=650,top=50,left=50,scrollbars=yes,resizable=yes,toolbar=no,status=no,menubar=no");
}

function goBack(){
	history.go(-1);
	$('.allMenuWrap').removeClass('on');
}

/*Cookie*/
function setCookieCommon(id,value,expiredays){	
	var today = new Date();
	today.setDate(today.getDate()+expiredays);
	document.cookie = id+'='+escape(value)+';path=/;expires='+today.toGMTString()+';';
}
function getCookieCommon(name){
	var prefix = name + "=";
	var cookieStartIndex = document.cookie.indexOf(prefix);
	if (cookieStartIndex == -1) return null;
	var cookieEndIndex = document.cookie.indexOf(";", cookieStartIndex + prefix.length);
	if (cookieEndIndex == -1) cookieEndIndex = document.cookie.length;
	return unescape(document.cookie.substring(cookieStartIndex + prefix.length, cookieEndIndex));
}
