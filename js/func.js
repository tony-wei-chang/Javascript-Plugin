//是否顯示錯誤訊息
var App_Debug = true;
//除了工單頁面 其他頁面的物件
var GridPanel_Object = {};

//物件水平垂直置中
jQuery.fn.center = function()
{
    try
	{
		this.css("position","absolute");
		this.css("top", Math.max(0,(($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
		this.css("left", Math.max(0,(($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
		return this;
	}
	catch(err)
	{
		if(App_Debug)
		{
			console.log(err);
		}
	}
}
//設定物件模糊效果
function addBlur_Css(id)
{
	try
	{
		if($('#'+id))
		{
			$('#'+id).addClass("Dom_Blur");
		}
	}
	catch(err)
	{
		console.log(err);
	}
}
//取消物件模糊效果
function removeBlur_Css(id)
{
	try
	{
		if($('#'+id))
		{
			$('#'+id).removeClass("Dom_Blur");
		}
	}
	catch(err)
	{
		console.log(err);
	}
}
//取得日期
function getDate(date)
{
	try
	{
		if(date)
		{
			var d = new Date(date);

			var month = d.getMonth()+1;
			var day = d.getDate();

			var output = d.getFullYear() + '/' +
				(month<10 ? '0' : '') + month + '/' +
				(day<10 ? '0' : '') + day;
			return output;
		}
		else
		{
			return ' ';
		}
	}
	catch(err)
	{
		if(App_Debug)
		{
			console.log(err);
		}		
	}
}
//取得時間
function getTime(date)
{
	try
	{
		if(date)
		{
			var d = new Date(date);

			var hours = d.getHours();
			var minutes = d.getMinutes();
			var seconds = d.getSeconds();

			var output = (hours<10 ? '0' : '') + hours + ':' +
				(minutes<10 ? '0' : '') + minutes;/* + ':' +
				(seconds<10 ? '0' : '') + seconds;*/
			return output;
		}
		else
		{
			return ' ';
		}
	}
	catch(err)
	{
		if(App_Debug)
		{
			console.log(err);
		}		
	}
}
//Ajax Get 共用
function jqueryAjax_Get(url,successFunc,errorFunc,failFunc)
{
	try
	{
		$.ajax
		({
			url:url,
			type:"GET",
			beforeSend:function(xhr)
			{
				xhr.setRequestHeader("Content-Type","application/json");
				xhr.setRequestHeader("Authorization","JAUTH "+localStorage.Auth);
			},
			success:function(result)
			{
				successFunc(result);
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				//在已經登入後才需顯示憑證失效
				if(JSON.parse(jqXHR.responseText).message == "憑證失效" && User_Infomation != null)
				{
					var ajaxMsg = showMsg("錯誤",allFunc_Language["Login_Timeout"][languageStatus],null,function()
					{
						location.reload();
					})
					//隱藏 No 按鈕
					$('#YesNo_Msg_No').css("display","none");
					//置中 Yes 按鈕
					$('#YesNo_Msg_Yes').css({"margin-left":"4px","width":"97%"});
				}
				else if(JSON.parse(jqXHR.responseText).message == "密碼到期,請變更密碼")
				{
					//密碼重設畫面
					edit_pw_fn();
				}
				else
				{
					if(errorFunc)
					{
						errorFunc(JSON.parse(jqXHR.responseText));
					}
				}
			}
		}).fail(function()
		{
			if(failFunc != null)
			{
				failFunc();
			}
		});
	}
	catch(err)
	{
		if(App_Debug)
		{
			console.log(err);
		}
	}
}
//Ajax Post 共用
function jqueryAjax_Post(url,data,successFunc,errorFunc,failFunc)
{
	try
	{
		$.ajax
		({
			url:url,
			type:"POST",
			data:data,
			beforeSend:function(xhr)
			{
				xhr.setRequestHeader("Content-Type","application/json");
				xhr.setRequestHeader("Authorization","JAUTH "+localStorage.Auth);
			},
			success:function(result)
			{
				if(successFunc)
				{
					successFunc(result);
				}
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				if(JSON.parse(jqXHR.responseText).message == "憑證失效")
				{
					var ajaxMsg = showMsg("錯誤",allFunc_Language["Login_Timeout"][languageStatus],null,function()
					{
						location.reload();
					})
					//隱藏 No 按鈕
					$('#YesNo_Msg_No').css("display","none");
					//置中 Yes 按鈕
					$('#YesNo_Msg_Yes').css({"margin-left":"4px","width":"97%"});
				}
				else if(JSON.parse(jqXHR.responseText).message == "密碼到期,請變更密碼")
				{
					//密碼重設畫面
					edit_pw_fn();
				}
				else
				{
					if(errorFunc)
					{
						errorFunc(JSON.parse(jqXHR.responseText));
					}
				}
			}
		}).fail(function()
		{
			if(failFunc != null)
			{
				failFunc();
			}
		});
	}
	catch(err)
	{
		if(App_Debug)
		{
			console.log(err);
		}
	}
}
//Ajax Delete 共用
function jqueryAjax_Delete(url,data,successFunc,errorFunc,failFunc)
{
	try
	{
		$.ajax
		({
			url:url,
			type:"Delete",
			data:data,
			beforeSend:function(xhr)
			{
				xhr.setRequestHeader("Content-Type","application/json");
				xhr.setRequestHeader("Authorization","JAUTH "+localStorage.Auth);
			},
			success:function(result)
			{
				if(successFunc)
				{
					successFunc(result);
				}
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				if(JSON.parse(jqXHR.responseText).message == "憑證失效")
				{
					var ajaxMsg = showMsg("錯誤",allFunc_Language["Login_Timeout"][languageStatus],null,function()
					{
						location.reload();
					})
					//隱藏 No 按鈕
					$('#YesNo_Msg_No').css("display","none");
					//置中 Yes 按鈕
					$('#YesNo_Msg_Yes').css({"margin-left":"4px","width":"97%"});
				}
				else
				{
					if(errorFunc)
					{
						errorFunc(JSON.parse(jqXHR.responseText));
					}
				}
			}
		}).fail(function()
		{
			if(failFunc != null)
			{
				failFunc();
			}
		});
	}
	catch(err)
	{
		if(App_Debug)
		{
			console.log(err);
		}
	}
}
//Ajax Put 共用
function jqueryAjax_Put(url,data,successFunc,errorFunc,failFunc)
{
	try
	{
		$.ajax
		({
			url:url,
			type:"Put",
			data:data,
			beforeSend:function(xhr)
			{
				xhr.setRequestHeader("Content-Type","application/json");
				xhr.setRequestHeader("Authorization","JAUTH "+localStorage.Auth);
			},
			success:function(result)
			{
				if(successFunc)
				{
					successFunc(result);
				}
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				if(JSON.parse(jqXHR.responseText).message == "憑證失效")
				{
					var ajaxMsg = showMsg("錯誤",allFunc_Language["Login_Timeout"][languageStatus],null,function()
					{
						location.reload();
					})
					//隱藏 No 按鈕
					$('#YesNo_Msg_No').css("display","none");
					//置中 Yes 按鈕
					$('#YesNo_Msg_Yes').css({"margin-left":"4px","width":"97%"});
				}
				else
				{
					if(errorFunc)
					{
						errorFunc(JSON.parse(jqXHR.responseText));
					}
				}
			}
		}).fail(function()
		{
			if(failFunc != null)
			{
				failFunc();
			}
		});
	}
	catch(err)
	{
		if(App_Debug)
		{
			console.log(err);
		}
	}
}
//產生Menu 選項
function createMainpage_Menu(Menu_Array)
{
	try
	{
		//Menu 參數
		var Title = Menu_Array.Title;
		var Content = Menu_Array.Content;
		var Content_Func = Menu_Array.Content_Func;
		//Title 沒有重複
		if(!checkMenu_Title(Title))
		{
			//新增Menu
			$('.Mainpage_Section_Outer').append
			(
				'<div class="Mainpage_Section">'+
					'<div id="Mainpage_Menu_Title_' + Mainpage_Menu_Counter + '">'+
						'<div class="Mainpage_Menu_div"></div>'+
						'<div class="Mainpage_Menu_Title translateHtml" myId="' + Title + '">' + Title + '</div>'+
					'</div>'+
					'<div id="Menu_' + Mainpage_Menu_Counter + '_Outer">'+
						'<div class="Mainpage_Menu_Content" id="Menu_' + Mainpage_Menu_Counter + '">'+
							//'<div class="translateHtml" id="Menu_' + Mainpage_Menu_Counter + '_Content" myId="' + Content + '">' + Content + '</div>'+
						'</div>'+
					'</div>'+
				'</div>'
			);
			//CSS
			$(".Mainpage_Menu_div").css
			({
				"height":"20px",
				"width":"30px",
				"margin":"5px 0px 0px 5px",
				"border-radius":"30px / 20px",
				"float":"left",
				"box-shadow":"rgb(136, 136, 136) 1px 2px 5px 1px",
				"background-color":"rgb(246, 125, 44)"
			});
			//點擊效果
			if(Mainpage_Menu_Counter == 1)
			{
				$("#Mainpage_Menu_Title_" + Mainpage_Menu_Counter).mousedown(function()
				{				
					$(this).css
					({
						"margin-top":"2px",
						"margin-bottom":"13px",
					});
				});
				$("#Mainpage_Menu_Title_" + Mainpage_Menu_Counter).mouseup(function()
				{				
					$(this).css
					({
						"margin-top":"0px",
						"margin-bottom":"15px",
					});
				});
			}
			else
			{
				$("#Mainpage_Menu_Title_" + Mainpage_Menu_Counter).mousedown(function()
				{				
					$(this).css
					({
						"margin-top":"17px",
						"margin-bottom":"13px",
					});
				});
				$("#Mainpage_Menu_Title_" + Mainpage_Menu_Counter).mouseup(function()
				{				
					$(this).css
					({
						"margin-top":"0px",
						"margin-bottom":"15px",
					});
				});
			}
		}
		//Title 有重複
		else
		{
			//新增至指定 DIV
			// $("div:contains('" + Title + "')").filter(function()
			// {
			//     return this.children.length == 0;
			// }).parent().parent().children().eq(1).append
			// (
			// 	'<div class="Mainpage_Menu_Content" id="Menu_' + Mainpage_Menu_Counter + '">'+
			// 		'<div class="translateHtml" id="Menu_' + Mainpage_Menu_Counter + '_Content" myId="' + Content + '">' + Content + '</div>'+
			// 	'</div>'
			// );
		}
		//新增 Mainpage_Menu_Title 滑鼠滑過
		$('#Mainpage_Menu_Title_' + Mainpage_Menu_Counter).css
		({
			"cursor":"pointer",
			"display":"block",
		    "margin":"0px 30px 15px 30px",
		    "width":"172px",
		    "height":"34px",
		    "background-color":"rgb(255, 242, 204)",
		    "box-shadow":"rgb(136, 136, 136) 2px 3px 5px"
		});
		//新增 Mainpage_Menu_Title_Content 點擊事件
		$('#Mainpage_Menu_Title_' + Mainpage_Menu_Counter).click(Content_Func);
		//新增 Menu Item 滑鼠滑過
		$('#Menu_' + Mainpage_Menu_Counter).children().css("cursor","pointer");
		//Menu 計算+1
		Mainpage_Menu_Counter++;
	}
	catch(err)
	{
		if(App_Debug)
		{
			console.log(err);
		}
	}
}
//確認 Title 是否有重複
function checkMenu_Title(Title)
{
	if($('.Mainpage_Menu_Title').length == 0)
	{
		return false;
	}
	else
	{
		oldArray = [];
		for(var i = 0; i < $('.Mainpage_Menu_Title').length; i++)
		{
			oldArray.push($('.Mainpage_Menu_Title').eq(i).text());
		};
		if(oldArray.indexOf(Title) == -1)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
}
//顯示視窗 共用
function showMsg(title,content,No_Func,Yes_Func)
{
	try
	{
		//建立 YesNo_Msg
		var YesNo_Msg = YesNo_Msg_Define.Initialize();
		YesNo_Msg.setMask(true);
		YesNo_Msg.setSmartdetect(true);
		YesNo_Msg.setWidth(300);
		YesNo_Msg.setHeight(168);
		YesNo_Msg.setId('YesNo_Msg');
		YesNo_Msg.setTitle(title);
		YesNo_Msg.show();
		YesNo_Msg.addMsgContent(content);
		YesNo_Msg.addYesNO_Button("取消","確認",
		//No
		function()
		{
			if(No_Func)
			{
				No_Func();
			}
		},
		//Yes
		function()
		{
			if(Yes_Func)
			{
				Yes_Func();
			}
		});
		//開啟物化效果
		addBlur_Css('Mainpage');
		//Debug
		$('#YesNo_Msg').css('z-index',100);
		$('#YesNo_Msg_Mask').css('z-index',99);
		//回傳自己
		return YesNo_Msg;
	}
	catch(err)
	{
		if(App_Debug)
		{
			console.log(err);
		}
	}
}
//預設錯誤訊息視窗
function normalError_Msg(content)
{
	var errorMsg = showMsg("錯誤",content,function()
	{
		errorMsg.close();
	},function()
	{
		errorMsg.close();
	});
	//隱藏 No 按鈕
	$('#YesNo_Msg_No').css("display","none");
	//置中 Yes 按鈕
	$('#YesNo_Msg_Yes').css({"margin-left":"4px","width":"97%"});
}
//預設錯誤訊息視窗 保留螢幕霧化效果
function normalError_Msg_Withmask(content)
{
	var errorMsg = showMsg("錯誤",content,function()
	{
		errorMsg.close();
		//開啟霧化效果
		addBlur_Css('Mainpage');
	},function()
	{
		errorMsg.close();
		//開啟霧化效果
		addBlur_Css('Mainpage');
	});
	errorMsg.close = function()
	{
		var ID = this.getId();
		//移除 Mask
		(this.getMask())?$('#' + ID + '_Mask').remove():'';
		//移除 Window Resize 監聽
		this.endResize();
		//智慧偵測 Ese->No Enter->Yes
		if(this.getSmartdetect())
		{
			this.endSmartdetect();
		}
		//移除物件
		$('#' + ID).remove();
	};
	//隱藏 No 按鈕
	$('#YesNo_Msg_No').css("display","none");
	//置中 Yes 按鈕
	$('#YesNo_Msg_Yes').css({"margin-left":"4px","width":"97%"});
	//回傳
	return errorMsg;
}
//預設錯誤訊息視窗
function normalSucceed_Msg(content)
{
	var errorMsg = showMsg(allFunc_Language["success"][languageStatus],content,function()
	{
		errorMsg.close()
	},function()
	{
		errorMsg.close()
	});
	//隱藏 No 按鈕
	$('#YesNo_Msg_No').css("display","none");
	//置中 Yes 按鈕
	$('#YesNo_Msg_Yes').css({"margin-left":"4px","width":"97%"});
}
//預設錯誤訊息視窗 保留螢幕霧化效果
function normalSucceed_Msg_Withmask(content)
{
	var Succeed_Msg = showMsg(allFunc_Language["success"][languageStatus],content,function()
	{
		Succeed_Msg.close();
		//開啟霧化效果
		addBlur_Css('Mainpage');
	},function()
	{
		Succeed_Msg.close();
		//開啟霧化效果
		addBlur_Css('Mainpage');
	});
	//隱藏 No 按鈕
	$('#YesNo_Msg_No').css("display","none");
	//置中 Yes 按鈕
	$('#YesNo_Msg_Yes').css({"margin-left":"4px","width":"97%"});
	//回傳
	return Succeed_Msg;
}
//新增 tab
function addTab(id,label)
{
	try
	{
		//顏色
		var color = ';';
		var a_color = ';';
		var colorful = true;
		if(id.split("_")[0] == "waitingProcess" && colorful)
		{
			color = "background:rgb(64,185,180);";
			a_color = "color:white;";
		}
		else if(id.split("_")[0] == "mainProcess" && colorful)
		{
			color = "background:rgb(248,118,67);";
			a_color = "color:white;";
		}
		else if(id.split("_")[0] == "alreadyProcess" && colorful)
		{
			color = "background:rgb(102,102,102);";
			a_color = "color:white;";
		}
		//不重複新增
		if($('#' + id + '_a').size() == 0)
		{
			//tab 樣版
			var tabTemplate = "<li id='" + id + "_li' title='" + label + "' style='" + color + "margin-top:-3px;margin-left:0.1px;'><a style='" + a_color + "height:calc(100% - 10px);' href='#{href}' id='" + id + "_a'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
			//tab 名字
			var label = label;
			//tab 編號
			var id = id;
			//tab li樣版
			var li = $( tabTemplate.replace( /#\{href\}/g, "#" + id ).replace( /#\{label\}/g, label ) );
			//新增 tab 
			$("#tabs").tabs().find(".ui-tabs-nav").append(li);
			$("#tabs").tabs().append("<div id='" + id + "'></div>");
			$("#tabs").tabs().tabs("refresh");
			//主動開啟 tab
			$('#' + id + "_a").click();
			//更改內容頁 css
			$('#' + id).css
			({
				"height":"calc(100% - 31px)",
				"padding":"0px",
	    		"margin-left":"-2px"
			});
		}
		//已新增過 開啟 tab
		else
		{
			//主動開啟 tab
			$('#' + id + "_a").click();
		}
		//新增滑鼠中鍵關閉分頁
		$("#" + id + "_li").click(function(e)
		{
			//滑鼠中鍵
			if(e.which == 2)
			{
				//正在開啟的上一頁編號
				var prevPageID = ($("#tabs .ui-state-active").prev().attr('id') == "HomeTab")?$("#tabs .ui-state-active").attr('id'):($("#tabs .ui-state-active").prev().attr('id') != undefined)?$("#tabs .ui-state-active").prev().attr('id').replace('_li',''):null;
				//正在開啟的頁面編號
				var currentPageID = ($("#tabs .ui-state-active").attr('id') == "HomeTab")?$("#tabs .ui-state-active").attr('id'):$("#tabs .ui-state-active").attr('id').replace('_li','');
				//正在開啟的下一頁編號
				var nextPageID = ($("#tabs .ui-state-active").next().size() == 0)?null:$("#tabs .ui-state-active").next().attr('id').replace('_li','');
				//如果要關掉的頁面 不等於 正在開啟的頁面
				if(currentPageID != id)
				{
					//關掉指定頁面
					deleteTab(id);
					//再重新聚焦在原先開啟的頁面
					$("#" + currentPageID + "_a").click();
				}
				//如果要關掉的頁面 等於 正在開啟的頁面
				else
				{
					//如果沒有下一頁
					if($("#tabs .ui-state-active").next().size() == 0)
					{
						//關掉指定頁面
						deleteTab(id);
						//再重新聚焦在上一個頁面 size=0需開起首頁 其他則開起上一頁
						if($("#" + prevPageID + "_a").size() == 0)
						{
							$("#HomeTab a").click();
							//首頁聚焦
							// getNewTaskPage_Record("all");
						}
						else
						{
							$("#" + prevPageID + "_a").click()
						}
					}
					//如果有下一頁
					else
					{
						//關掉指定頁面
						deleteTab(id);
						//再重新聚焦在下一個頁面
						$("#" + nextPageID + "_a").click();
					}
				}
			}
		});
		//新增語言翻譯 class
		$("#" + id + "_a").addClass('translateHtml');
	}
	catch(err)
	{
		if(App_Debug)
		{
			console.log(err);
		}
	}
}
//載入 js
function loadJs(fileUrl,callback)
{
	try
	{
		//載入指定 js 檔案
		$.getScript(fileUrl).done(function(script,textStatus)
		{
			(callback)?callback():null;
	  	}).fail(function(jqxhr,settings,exception)
	  	{
		    normalError_Msg("代碼不存在");
		});
	}
	catch(err)
	{
		if(App_Debug)
		{
			console.log(err);
		}
	}
}
//刪除 tab
function deleteTab(id)
{
	try
	{
		//刪除內容
		$('#'+id).remove();
		//刪除標籤
		$('#'+id+'_li').remove();
		//Debug
		$(window).resize();
	}
	catch(err)
	{
		if(App_Debug)
		{
			console.log(err);
		}
	}
}
//產生UUID
function guid()
{
	try
	{
		function s4()
		{
		  return Math.floor((1 + Math.random()) * 0x10000)
		    .toString(16)
		    .substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		  s4() + '-' + s4() + s4() + s4();
	}
	catch(err)
	{
		if(App_Debug)
		{
			console.log(err);
		}
	}
}
//由大到小
function sortItem_Desc(id,item)
{
	//排序共用
	sortAll_Use(id,item);
	//顯示新排序
	GridPanel_Object[id].setData
	(
		GridPanel_Object[id].getData().sort
		(
			function(a, b)
			{
			    if(new Date(a[item]) == "Invalid Date")
			    {
			    	return ((a[item] < b[item]) ? -1 : ((a[item] > b[item]) ? 1 : 0));
			    }
			    else
			    {
			    	return new Date(a[item]) - new Date(b[item]);
			    }
			}
		)
	);
}
//由小到大
function sortItem_Asc(id,item)
{
	//排序共用
	sortAll_Use(id,item);
	//顯示新排序
	GridPanel_Object[id].setData
	(
		GridPanel_Object[id].getData().sort
		(
			function(a, b)
			{
			    if(new Date(a[item]) == "Invalid Date")
			    {
			    	return ((b[item] < a[item]) ? -1 : ((b[item] > a[item]) ? 1 : 0));
			    }
			    else
			    {
			    	return new Date(b[item]) - new Date(a[item]);
			    }
			}
		)
	);
}
//排序共用
function sortAll_Use(id,item)
{
	//清空資料
	$('#' + id + '_Table').empty();
	//恢復其他標題排序
	var sortObject = $("#" + id + "_Header span");
	for(var i = 0; i < sortObject.length; i++)
	{
		if(sortObject.eq(i).attr('id') != undefined)
		{
			//將不是自己的排序圖示重設
			var myItem = sortObject.eq(i).attr('id').replace(GridPanel_Object[id].getId() + "_",'').replace("_Sort",'');
			if(myItem != item )
			{
				sortObject.eq(i).removeClass('Mainpage_Header_Asc');
				sortObject.eq(i).removeAttr('sort');
				sortObject.eq(i).removeClass('Mainpage_Header_Desc');
				sortObject.eq(i).removeAttr('sort');
				sortObject.eq(i).addClass('Mainpage_Header_All');
			}
		}
	};
}