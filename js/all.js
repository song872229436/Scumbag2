// 获取跨页面传递参数插件
$.extend({
	getUrlVars: function() {
		var vars = [],
			hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	},
	getUrlVar: function(name) {
		return $.getUrlVars()[name];
	}
})

/*————————————————页面加载————————————————*/
$(function() {
	var i = 1;
	var ai = null;
	var as = null;
	var ae = null;
	var s = null;
	var h = null;
	var c = null;

	$("#H-btn img").on("click",function(){
		window.location.href = "#ArticleList";
		// LoadArticleList(i);
		// history.go(0);
		LoadArticleList(i);


	});
	// $(".A-list-con").on("tap",function(){

	// })
	// debugger;
	// 文章列表
	function LoadArticleList(i) {
		var cities_id = $.getUrlVar('ai');
		var as = $.getUrlVar('as');
		var ae = $.getUrlVar('ae');
		var c = $.getUrlVar('c');
		var h = $.getUrlVar('h');
		var Url = "http://scumbag.chengbaoapp.com/front/list/" + i + "/10";
		if(cities_id != null) {
			Url += "?ai=" + cities_id;
			console.log(444);
		}
		if(as != null) {
			Url += "&as=" + as;
		}
		if(ae != null) {
			Url += "&ae=" + ae;
		}
		if(s != null) {
			Url += "&s=" + s;
		}
		if(h != null) {
			Url += "&h=" + h;
		}
		if(c != null) {
			Url += "&c=" + c;
		}
		$.ajax({
			type: "GET",
			url: Url,
			cache: false,
			dataType: "jsonp",
			jsonp: "jsonpcallback",
			success: function(data) {
				console.log(data);
				ScumBagList(data);
			},
			error: function() {
				console.log("error");
			}
		})
	}
	LoadArticleList(i);
// 向上滑动加载文章
	function upglide() {
		$("#ArticleList").bind("scroll", srcollEvent);
		$("#ArticleList").bind("touchstart", startEvent).bind("touchmove", moveEvent).bind("touchcancel", stopEvent).bind("touchend", stopEvent);
		var isScrollStop = true; //页面是否停止滚动 防止屏幕有滑动但还没到底部就开始加载数据
		var isMoveDown = false; //防止手指向上滑动屏幕开始加载数据
		var isLoading = false; //防止异步请求数据未返回到前端的时候重复提交请求
		var isMoved = false; //手指是否在滑动屏幕 防止出现手指触摸屏幕而没有滑动就加载数据
		var startY = 0;
		var startX = 0;

		function srcollEvent() {
			if($("#ArticleList").scrollTop() > 0) {
				isScrollStop = false;
			}
		}

		function startEvent() {
			startY = event.targetTouches[0].clientY;
			isScrollStop = true;
			isMoved = false;
			isMoveDown = false;
		}

		function moveEvent() {
			var Y = event.targetTouches[0].clientY;
			if(startY > Y) {
				isMoveDown = true;
			} else {
				isMoveDown = false;
			}
			isMoved = true;

		}

		function stopEvent() {
			if(isScrollStop && isMoved && !isLoading && isMoveDown) {
				console.log("分页加载");
				loadData();
			}
		}

		function loadData() {
			i++;
			var time=null;		
			LoadArticleList(i);
			//模拟向后台异步加载数据
			isLoading = true; //异步加载数据之前先设置为正在等待数据        
			//此时数据已返回到前端
			isLoading = false;
			isMoved = false;
		}

		function sleep() {
			var t1 = new Date();
			var t2 = new Date();
			while((t2 - t1) < 3000) {
				t2 = new Date();
			}
		}

	}
	upglide();
	// debugger;
	//总的城市的所有文章
	function ScumBagList(data) {
		var total = data.total;
		$(".total").html(total);

		var list_clone = $(".A-list-out").html();
		console.log(data.list.length);

		for(var i = 0; i < data.list.length; i++) {

			var title = data.list[i].title;
			var summary = data.list[i].summary;
			var date = data.list[i].created_at;
			var heightend = data.list[i].heightend;

			body = list_clone.replace("#title#", title);
			body = body.replace("#content#", summary);
			body = body.replace("#date#", date);
			body = body.replace("#heightend#", heightend);

			$("#" + i).html(data.list[i].title);
			$("#title-sum p" + i).html(data.list[i].summary);
			$("#date" + i).html(data.list[i].date);
			$("#heightend" + i).html(data.list[i].heightend);

			var imgUrl = "http://scumbag.chengbaoapp.com";
			var imgs = [];
			var bodyel = $(body);
			for(var j = 0; j < data.list[i].covers.length; j++) {
				var imgcontainer = $("<div> </div>").addClass('Alist-con-imgdiv' + data.list[i].covers.length);
				var img = $("<img>").attr("src", imgUrl + data.list[i].covers[j].address);
				imgcontainer.append(img);
				bodyel.find('.A-list-con-img').append(imgcontainer)
			}
			$(".Alist-con-imgdiv img").css({
				"width": "327px", "height": "auto", "margin-left": "0px", "margin-top": "-53px"
			})
			$(".A-list").append(bodyel.attr('articleid', data.list[i]._id));
			$("#list_out").css({
					"display": "none"
				})
		}

		// $(".A-list").find('.A-list-con-img').find('img').imageScale({
		// 	parent_css_selector: null,
		// 	scale: 'fill',
		// 	center: true,
		// 	fade_duration: 0,
		// 	rescale_after_resize: true
		// });

		$(".A-list-con").on("tap", function(i) {
			window.location.href = "#Article?id=" + $(this).attr('articleid');
			articledetail();
			// $('.A-list-con').css('pointer-events', 'none');

		 //    setTimeout(function(){
		 //        $('.A-list-con').css('pointer-events', 'auto');
		 //    }, 400);
		});

		$(".A-search-txt a").on("tap", function() {
			window.location.href = "#dregs";
		})
	}
	//选择城市后筛选的列表		
	function ScumBagList_fil(data) {
		var i = 1;
		// $(".A-list-con").remove();
		var cities_id = $.getUrlVar('ai');
		console.log(cities_id);
		var list_con_clone = $("#list_con").clone();
		$(".A-list-con").remove();
		$(".A-list-out").append($(list_con_clone));
		$(".A-list-out").css({
			"display": "block"
		})
		$.ajax({
			type: "GET",
			url: "http://scumbag.chengbaoapp.com/front/list/" + i + "/10?ai=" + cities_id,
			cache: false,
			dataType: "jsonp",
			jsonp: "jsonpcallback",
			success: function(data) {
				console.log(data);
				succFunction2(data);

			},
			error: function() {
				console.log("error");
			}
		})

		function succFunction2(data) {
			var list_clone = $(".A-list-out").html();
			var total =data.total;		
				$(".total").html(total);
				if (total==0) {
				alert("当前城市都是优质暖男，暂时没有发现更多人渣哦。欢迎到公众平台吐槽。");
			}
			for(var i = 0; i < data.list.length; i++) {
				var title = data.list[i].title;
				var summary = data.list[i].summary;
				var date = data.list[i].created_at;
				var heightend = data.list[i].heightend;
				

				body = list_clone.replace("#title#", title);
				body = body.replace("#content#", summary);
				body = body.replace("#date#", date);
				body = body.replace("#heightend#", heightend);

				$("#" + i).html(data.list[i].title);
				$("#title-sum p" + i).html(data.list[i].summary);
				$("#date" + i).html(data.list[i].date);
				$("#heightend" + i).html(data.list[i].heightend);


				// var imgUrl = "http://scumbag.chengbaoapp.com/"
				var imgUrl = "http://scumbag.chengbaoapp.com";
				var imgs = [];
				var bodyel = $(body);
				for(var j = 0; j < data.list[i].covers.length; j++) {
					var imgcontainer = $("<div> </div>").addClass('Alist-con-imgdiv' + data.list[i].covers.length);
					var img = $("<img>").attr("src", imgUrl + data.list[i].covers[j].address);
					imgcontainer.append(img);
					bodyel.find('.A-list-con-img').append(imgcontainer)
				}

				$(".A-list").append(bodyel.attr('articleid', data.list[i]._id));
				
			}
			$(".Alist-con-imgdiv img").css({
				"width": "327px", "height": "auto", "margin-left": "0px", "margin-top": "-53px"
			})
			$("#list_out").css({
						"display": "none"
					})
			// $(".A-list").find('.A-list-con-img').find('img').imageScale({
			// 	parent_css_selector: null,
			// 	scale: 'fill',
			// 	center: true,
			// 	fade_duration: 0,
			// 	rescale_after_resize: true
			// });

			$(".A-list-con").on("tap", function(i) {
				window.location.href = "#Article?id=" + $(this).attr('articleid');
				articledetail();
			})

		}
	}
	//条件选择后渲染的列表1
	function ConDition_fil() {
		history.go(0);
		i = 1;
		var cities_id = $.getUrlVar('ai');
		var as = $.getUrlVar('as');
		var ae = $.getUrlVar('ae');;
		var c = $.getUrlVar('c');;
		var h = $.getUrlVar('h');;
		console.log(cities_id);
		var list_con_clone = $("#list_con").clone();
		$(".A-list-con").remove();
		$(".A-list-out").append($(list_con_clone));
		$(".A-list-out").css({
			"display": "block"
		})
		$.ajax({
			type: "GET",
			url: "http://scumbag.chengbaoapp.com/front/list/" + i + "/10?ai=" + cities_id + "&as=" + as + "&ae=" + ae + "&h=" + h + "&c=" + c,
			cache: false,
			dataType: "jsonp",
			jsonp: "jsonpcallback",
			success: function(data) {
				console.log(data);
				succFunction2(data);

			},
			error: function() {
				console.log("error");
				// console.log(2);
			}
		})

		function succFunction2(data) {
			var list_clone = $(".A-list-out").html();
			var total =data.total;
			$(".total").html(total);
			if (total==0) {
				alert("当前城市都是优质暖男，暂时没有发现更多人渣哦。欢迎到公众平台吐槽。");
			}
				
			for(var i = 0; i < data.list.length; i++) {
				var title = data.list[i].title;
				var summary = data.list[i].summary;
				var date = data.list[i].created_at;
				var heightend = data.list[i].heightend;
				

				body = list_clone.replace("#title#", title);
				body = body.replace("#content#", summary);
				body = body.replace("#date#", date);
				body = body.replace("#heightend#", heightend);

				$("#" + i).html(data.list[i].title);
				$("#title-sum p" + i).html(data.list[i].summary);
				$("#date" + i).html(data.list[i].date);
				$("#heightend" + i).html(data.list[i].heightend);

				var imgUrl = "http://scumbag.chengbaoapp.com";
				var imgs = [];
				var bodyel = $(body);
				for(var j = 0; j < data.list[i].covers.length; j++) {
					var imgcontainer = $("<div> </div>").addClass('Alist-con-imgdiv' + data.list[i].covers.length);
					var img = $("<img>").attr("src", imgUrl + data.list[i].covers[j].address);
					imgcontainer.append(img);
					bodyel.find('.A-list-con-img').append(imgcontainer)
				}

				$(".A-list").append(bodyel.attr('articleid', data.list[i]._id));			
			}
			$(".Alist-con-imgdiv img").css({
				"width": "327px", "height": "auto", "margin-left": "0px", "margin-top": "-53px"
			})
			$("#list_out").css({
				"display": "none"
			})
			// $(".A-list").find('.A-list-con-img').find('img').imageScale({
			// 	parent_css_selector: null,
			// 	scale: 'fill',
			// 	center: true,
			// 	fade_duration: 0,
			// 	rescale_after_resize: true
			// });
			$(".A-list-con").on("tap", function(i) {
				window.location.href = "#Article?id=" + $(this).attr('articleid');
				articledetail();
			})
			$("#list_out").css({
				"display": "none"
			})
		}
	}
	// 渣中寻他			
	function SelectBy() {
		$.ajax({
			type: "GET",
			url: "http://scumbag.chengbaoapp.com/front/area",
			dataType: "jsonp",
			jsonp: "jsonpcallback",
			success: function(data) {
				console.log(data);
				var _this = $(this);
				for(var i = 0; i < data.length; i++) {
					var a = $("<option> </option>");
					$("#shengfen").append(a);
					$("#shengfen option").eq(i).attr('cities', data[i]._id);
					var areaname = data[i].areaname;
					$("#shengfen option").eq(i).html(areaname).attr("areaname", areaname);
					// console.log(_this.attr('cities'));
				}
				var s = 1;
				$(".man").on("tap", function() {
					var m = $(this).attr("value");
					s = m;
					$(".man img").show();
					$(".woman img").hide();
				});
				$(".woman").on("tap", function() {
					var w = $(this).attr("value");
					s = w;
					$(".woman img").show();
					$(".man img").hide();
				});
				$(".search-t2 a").on("click",function(){
					// window.location.href="#ArticleList";
					// history.go(-1);
				})
				$("#next").on("click", function() {
					var ai = $('#shengfen option:selected').attr('cities');
					var city_shengfen = $('#shengfen option:selected').attr('areaname');
					var as = $('#as').val();
					var ae = $('#ae').val();
					var c = $('#car').val();
					var h = $('#house').val();
					$(".city-shengfen").html(city_shengfen);
					console.log(c);
					window.location.href = "#ArticleList?ai=" + ai + "&as=" + as + "&ae=" + ae + "&s=" + s + "&h=" + h + "&c=" + c;

					ConDition_fil();
					history.go(0);
				})
			},
			error: function() {
				console.log("error2");
			}
		})
	}
	SelectBy();

	// 文章主要内容
	function articledetail() {
		var list_id = $.getUrlVar('id');
		// console.log(list_id);
		$.ajax({
			type: "GET",
			url: "http://scumbag.chengbaoapp.com/front/articledetail/" + list_id,
			dataType: "jsonp",
			jsonp: "jsonpcallback",
			// data: "name=sqx&email=songqixing@qq.com.cn&jsonpcallback=?",
			// beforeSend: LoadFunction, 
			success: function(data) {
				var title = data.title;
				var content = data.content;
				var date2 = data.created_at;
				var heightend = data.heightend;
				$("#title-sum2 h1").html(title);
				$("#content").html(content);
				$("#date2").html(date2);
				$("#heightend2").html(heightend);
				console.log(data);
				$("#content p img " ).attr("src");
				var imgUrl = $("#content p img " ).attr("src");
				var a = "http://scumbag.chengbaoapp.com/";
				var imgUrl = $("#content p img " ).attr("src",a+imgUrl); 
			},
			error: function() {
				console.log("articleid in error");
			}
		});
	};

	// 地区
	//搜索省份页面
	function SearchProvinces(){
		$.ajax({
		type: "GET",
		url: "http://scumbag.chengbaoapp.com/front/area",
		dataType: "jsonp",
		jsonp: "jsonpcallback", 
		success: function(data) {
			console.log(data);
			for(var i = 0; i < data.length; i++) {
				
				$("#provinces li").eq(i).attr('cities', data[i]._id);
				var areaname = data[i].areaname;
				$("#provinces li").eq(i).html(areaname).attr("areaname", areaname);

			}
			$(' #provinces li').on("click", function() {
				var _this = $(this);
				var s = $(this).text();
				$(".search-cs span").text(s);				
				$("#provinces li").hide();
				console.log(_this.attr('cities'));
				window.location.href = "#ArticleList?ai=" + _this.attr('cities');
				sessionStorage.setItem("city-shengfen",s);
				$(".city-shengfen").text(sessionStorage.getItem("city-shengfen"));
				ScumBagList_fil(data);
				// history.go(0);
				
			});
			$("#nationwide li").on("click",function(){
				var _this=$(this);
				var ss = $(this).text();
				$(".search-cs span").text(ss);
				$(".city-shengfen").text(ss);
				$("#provinces li").hide();	
				var i=1;
					
				window.location.href = "#ArticleList";

				LoadArticleList(i);	
				history.go(0);	
				
			})

			$('#fsearch a').on("click", function() {
				$("#provinces li").show();
				window.location.href = "#search-bar";

			});
		},
		error: function() {
			console.log("error2");
		}
		})

		$('#searchCityName').focus(function() {
			$("ul li").show();
		})
		$('#search-btn span').on("click", function() {
			searchCity();
		})
		$('.city-qiehuan').on("click", function() {
			$("#provinces li").show();
		})
		$('#searchCityName').bind('input propertychange', function() {
			searchCity();
		});

		function searchCity() {
			var searchCityName = $("#searchCityName").val();
			if(searchCityName == "") {
				$("#provinces li").show();
			} else {
				$("#provinces li").each(function() {
					// var pinyin = $(this).attr("pinyin");  
					var areaname = $(this).attr("areaname");
					if(areaname.indexOf(searchCityName) != -1) {
						$(this).show();
					} else {
						$(this).hide();
					}
				})
			}
		}
	}
	 SearchProvinces();
})