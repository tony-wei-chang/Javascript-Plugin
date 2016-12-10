//Header 標題
var Mainpage_Header_Logo_Content = '雲端進銷存系統';
//預設語言-繁體
if(!localStorage.languageStatus)
{
	languageStatus="T";
}
else
{
	var languageStatus=localStorage.languageStatus;
}
//Menu 計算
var Mainpage_Menu_Counter = 1;
//使用者資訊
var User_Infomation = null;
//預設畫面
$(document).ready(function()
{
	try
	{
		//開啟主頁面
		createMainpage();
		//進度條下一步
		Y02_CurrentStage = Y02_TotalStage;
		goProcess();
		//載入自定義檔案
		//loadJs('js/systemAuthorization.js');
	}
	catch(err)
	{
		if(App_Debug)
		{
			console.log(err);
		}
	}
});
//產生登入畫面
function createLoginpage()
{
	try
	{
		Login_Window = Window_Define.Initialize();
		Login_Window.setMask(true);
		Login_Window.setWidth(300);
		Login_Window.setHeight(357);
		Login_Window.setId('Login_Window');
		Login_Window.setTitle(language["login"][languageStatus]);
		Login_Window.setSmartdetect(true);
		Login_Window.show();
		Login_Window.addTextfield('Account',language["account"][languageStatus]+' :');
		//覆寫
		$('#Account_Group').prepend('<img id="Account_Img" src="image/signin_account_icon00.png" style="float: left;width: 22px;height: 22px;margin-right: 5px;">');
		$('#Account_Label').width('21%');
		$('#Account').width('calc(72% - 15px)');
		$('#Account').focus(function()
		{
			$('#Account_Img').attr('src','image/signin_account_icon01.png');
		});
		$('#Account').blur(function()
		{
			$('#Account_Img').attr('src','image/signin_account_icon00.png');
		});
		//覆寫
		Login_Window.addTextfield('Password',language["password"][languageStatus]+' :');
		$('#Password').attr('type','password');
		$('#Password_Group').prepend('<img id="Password_Img" src="image/signin_Password_icon00.png" style="float: left;width: 22px;height: 22px;margin-right: 5px;">');
		$('#Password_Label').width('21%');
		$('#Password').width('calc(72% - 15px)');
		$('#Password').focus(function()
		{
			$('#Password_Img').attr('src','image/signin_account_icon01.png');
		});
		$('#Password').blur(function()
		{
			$('#Password_Img').attr('src','image/signin_account_icon00.png');
		});
		//YesNo
		Login_Window.addYesNO_Button('',language["login"][languageStatus],null,
		//Yes
		function()
		{
			//Loading Mask
			var loadingMask = Loading_Mask.Initialize();
			loadingMask.setTarget('Login_Window');
			loadingMask.show();
			//如果 api 資訊尚未載入
			if(localStorage.getItem('auth') == null || (localStorage.getItem('daily') == null) || (localStorage.getItem('human') == null) ||
			   localStorage.getItem('pic') == null || (localStorage.getItem('task') == null))
			{
				var domain = $('#Account').val();
				var domain_Array = domain.split("@");
				var account = (domain_Array[1] != undefined)?domain_Array[1].toLowerCase():'';
				var parameter = '{account:"' + account  + '"}';
				jqueryAjax_Post("https://ssl.ys3s.com/service?_Y02=" + new Date().getTime(),parameter,function(result)
				{
					//成功 儲存資訊
					localStorage.setItem("auth",result.data.auth);
					localStorage.setItem("daily",result.data.daily);
					localStorage.setItem("human",result.data.human);
					localStorage.setItem("pic",result.data.pic);
					localStorage.setItem("task",result.data.task);
					//執行登入
					login();
				},function(msg)
				{
					// Login_Window.endSmartdetect();
					// var loginMsg = showMsg('錯誤',msg.message,null,function()
					// {
					// 	loginMsg.close();
					// 	$('#Account').focus();
					// 	Login_Window.startSmartdetect();
					// });
					// loginMsg.setSmartdetect(true);
					// //隱藏 No 按鈕
					// $('#YesNo_Msg_No').css("display","none");
					// //置中 Yes 按鈕
					// $('#YesNo_Msg_Yes').css({"margin-left":"4px","width":"97%"});
				},function()
				{
					//Loading Mask close
					loadingMask.close();
					//顯示錯誤訊息
					if(App_Debug)
					{
						console.log("https://ssl.ys3s.com/service 連線失敗");
					}
				});
			}
			else
			{
				var domain = $('#Account').val().toLowerCase();
				var domain_Array = domain.split("@");
				//初步檢查帳號是否合法
				if(domain_Array[1]){
					//執行登入
					login();
				}else{
					var loginErr_Msg = YesNo_Msg_Define.Initialize();
					loginErr_Msg.setMask(false);
					loginErr_Msg.setSmartdetect(false);
					loginErr_Msg.setWidth(300);
					loginErr_Msg.setHeight(168);
					loginErr_Msg.setId('loginErr_Msg');
					loginErr_Msg.setTitle(language["system_error"][languageStatus]);
					loginErr_Msg.show();
					loginErr_Msg.addMsgContent(language["accountErr"][languageStatus]);
					loginErr_Msg.addYesNO_Button('',language["system_ok"][languageStatus],null,
					function()
					{
						//關閉 Msg
					    loginErr_Msg.close();
					    loadingMask.close();
					});
					//隱藏 No 按鈕
					$('#loginErr_Msg_No').css("display","none");
					//置中 Yes 按鈕
					$('#loginErr_Msg_Yes').css({"margin-left":"0px","width":"100%"});
				}
			}
			//執行登入
			function login()
			{
				var uuid=guid();
				var account = $("#Account").val().toLowerCase();
				var parameter = "{account:'" + $("#Account").val().toLowerCase() + "',password:'" + $("#Password").val() + "',type:" + "'webSite:" +uuid+ "'}";
				jqueryAjax_Post(localStorage.getItem("human") + "/oauth/accessToken?_Y02=" + new Date().getTime(),parameter,function(result)
				{					
					//設定憑證
					localStorage.setItem("Auth",result.data.userAccessToken);					
					//載入權限
					$.ajax
					({
						url:localStorage.getItem("human") + "/Employee/me/Power?_Y02=" + new Date().getTime(),
						type:"GET",
						beforeSend:function(xhr)
						{
							xhr.setRequestHeader("Content-Type","application/json");
							xhr.setRequestHeader("Authorization","JAUTH "+localStorage.Auth);
						},
						success:function(result)
						{
							//Loading Mask close
							loadingMask.close();
							//設定員工資訊
							User_Infomation = {"userAccount":account};
							//開啟主頁面
							createMainpage();
							//關閉登入畫面
							Login_Window.close();
							//存取權限
							Y02_System_Authorization = result.data;
							//載入自定義檔案
							loadJs('js/systemAuthorization.js');
						},
						error:function(jqXHR, textStatus, errorThrown)
						{
							
						}
					}).fail(function()
					{
						
					});
				},function(msg)
				{
					//Loading Mask close
					loadingMask.close();
					//關閉偵測
					Login_Window.endSmartdetect();
					var loginMsg = showMsg(language["system_error"][languageStatus],msg.message,null,function()
					{
						loginMsg.close();
						$('#Account').focus();
						Login_Window.startSmartdetect();
					});
					//隱藏 No 按鈕
					$('#YesNo_Msg_No').css("display","none");
					//置中 Yes 按鈕
					$('#YesNo_Msg_Yes').css({"margin-left":"4px","width":"97%"});
				},function()
				{
					//Loading Mask close
					loadingMask.close();
					//顯示錯誤訊息
					if(App_Debug)
					{
						console.log(localStorage.getItem("human") + "/oauth/accessToken 連線失敗");
					}
				});
			}
		});
		//帳號欄位自動聚焦
		$('#Account').ready(function()
		{
			$("#Account").focus();
		});
		//隱藏 No 按鈕
		$('#Login_Window_No').css("display","none");
		//置中 Yes 按鈕
		$('#Login_Window_Yes').css({"margin-left":"4px","width":"97%"});
		//圖片
		$('<div id="Login_Image" style="background:url(\'image/login.jpg\')"></div>').insertAfter('#Login_Window_Title');
		$('#Login_Image').css
		({
			"width":"125px",
			"height":"125px",
			"border-radius":"50%",
			"-webkit-border-radius":"50%",
			"-moz-border-radius":"50%",
			"margin":"auto",
			"margin-top":"20px",
			"border":"rgb(255,255,255) 2px solid"
		});
		$('#Login_Image').css('background-size','100% 100%');
		//Login_Window_Body Height Override
		$('#Login_Window_Body').height('calc(100% - 275px)');
		//載入員工圖片 且取得 Server 資訊
		$('#Account').blur(function()
		{
			var domain = $('#Account').val().toLowerCase();
			if(domain.length != 0)
			{
				var domain_Array = domain.split("@");
				var account = (domain_Array[1] != undefined)?domain_Array[1]:'';
				var parameter = '{account:"' + account  + '"}';
				jqueryAjax_Post("https://ssl.ys3s.com/service?_Y02=" + new Date().getTime(),parameter,function(result)
				{
					//成功 儲存資訊
					localStorage.setItem("auth",result.data.auth);
					localStorage.setItem("daily",result.data.daily);
					localStorage.setItem("human",result.data.human);
					localStorage.setItem("pic",result.data.pic);
					localStorage.setItem("task",result.data.task);
					$('#Login_Image').css
					({
						"background":'url('+localStorage.human+'/employee/'+domain+'/showImages?searchType=account)',
						"background-size": "125px 125px",
						"background-repeat": "no-repeat",
						"border-radius":"50%",
						"-webkit-border-radius":"50%",
						"-moz-border-radius":"50%",
						"margin":"auto",
						"margin-top":"20px",
						"border":"rgb(255,255,255) 2px solid"
					});
				},function(msg)
				{
					var loginErr_Msg = YesNo_Msg_Define.Initialize();
					loginErr_Msg.setMask(false);
					loginErr_Msg.setSmartdetect(false);
					loginErr_Msg.setWidth(300);
					loginErr_Msg.setHeight(168);
					loginErr_Msg.setId('loginErr_Msg');
					loginErr_Msg.setTitle(language["system_error"][languageStatus]);
					loginErr_Msg.show();
					loginErr_Msg.addMsgContent(language["accountErr"][languageStatus]);
					loginErr_Msg.addYesNO_Button('',language["system_ok"][languageStatus],null,
					function()
					{
						//關閉 Msg
					    loginErr_Msg.close();
					});
					//隱藏 No 按鈕
					$('#loginErr_Msg_No').css("display","none");
					//置中 Yes 按鈕
					$('#loginErr_Msg_Yes').css({"margin-left":"0px","width":"100%"});
					// //停止偵測
					// Login_Window.endSmartdetect();
					// var loginMsg = showMsg('錯誤',msg.message,null,function()
					// {
					// 	loginMsg.close();
					// 	$('#Account').focus();
					// 	Login_Window.startSmartdetect();
					// });
					// loginMsg.setSmartdetect(true);
					// //隱藏 No 按鈕
					// $('#YesNo_Msg_No').css("display","none");
					// //置中 Yes 按鈕
					// $('#YesNo_Msg_Yes').css({"margin-left":"4px","width":"97%"});
				},function()
				{
					//顯示錯誤訊息
					if(App_Debug)
					{
						console.log("https://ssl.ys3s.com/service 連線失敗");
					}
				});
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
//產生主畫面
function createMainpage()
{
	try
	{
		//建立 Mainpage
		$('body').append('<div id="Mainpage"></div>');
		//清空
		$('#Mainpage').empty();
		//建立 Mainpage_Header
		new function()
		{
			//新增 Mainpage_Header
			$('#Mainpage').append
			(
				'<div id="Mainpage_Header">'+
					'<div id="Mainpage_Header_Logo" class="Mainpage_Header_Logo">'+
						'<div class="Mainpage_Header_Logo_Content">'+Mainpage_Header_Logo_Content+'</div>'+
					'</div>'+
					'<div id="Mainpage_Header_person">'+
						'<img id="Mainpage_Header_person_img">'+
						'</img>'+
						'<div id="Mainpage_Header_person_main" class="translateHtml"></div>'+
					'</div>'+
					'<div class="Mainpage_Header_Message">'+
					'</div>'+
				'</div>'
			);
			//取得人名資訊
			$('#Mainpage_Header_person_main').html('黃軍韶');
			$('#Mainpage_Header_person').css
			({
				"color":"rgb(255, 255, 255)",
			    "font-size":"15px",
			    "position":"absolute",
			    "right":"10px",
			    "height":"75px"
			});
			$('#Mainpage_Header_person_img').attr("src",'image/personDefault.png');
			$('#Mainpage_Header_person_img').css
			({
				"height":"38px",
			    "width":"40px",
			    "margin-top":"10px"
			});
			$('#Mainpage_Header_person_main').css
			({
			    "color":"rgb(255, 255, 255)",
			    "font-family":"微軟正黑體",
			    "font-weight":"bold",
			    "text-align":"center",
			    "height":"60px",
			    "width":"60px",
			    "margin-left":"-10px"
			});

            //登出
            $('#Mainpage_Header_person_logout').click(function()
            {
            	location.reload(); 
            })

			//搜尋文字方塊 focus style
			$('.Mainpage_Header_Search_Input').focus(function()
			{
				$('.Mainpage_Header_Search_Div').css('background-color','#ffffff');
			});
			//搜尋文字方塊 blur style
			$('.Mainpage_Header_Search_Input').blur(function()
			{
				$('.Mainpage_Header_Search_Div').css('background-color','#e1ecf5');
			});
			//登出
			$('.Mainpage_Header_Logout').click(function()
			{
				//刪除主頁面
				$('#Mainpage').remove();
				//開啟登入畫面
				createLoginpage();
				//刪除憑證
				localStorage.removeItem('Auth');
			});
		}
		//建立 Mainpage_Menu
		new function()
		{
			//新增 Mainpage_Menu
			$('#Mainpage').append
			(
				'<div id="Mainpage_Menu">'+
					'<div class="Mainpage_Section_Outer">'+
					'</div>'+
				'</div>'
			);
			//新增功能碼輸入框
			$(".Mainpage_Section_Outer").append("<div id='T_InserFunction_Key'></div>");
			$("#T_InserFunction_Key").css
			({
				"width":"170px",
				"height":"50px",
				"margin-left":"30px",
				"margin-top":"10px"
			});
			//新增功能碼輸入框 左框
			$("#T_InserFunction_Key").append("<div id='T_InserFunction_Key_Label'>功能碼</div>");
			$("#T_InserFunction_Key_Label").css
			({
				"font-family":"微軟正黑體",
			    "font-size":"19px",
			    "width":"50%",
			    "float":"left",
			    "box-shadow":"2px 3px 5px #888888",
			    "text-align":"center"
			});
			//新增功能碼輸入框 右框
			$("#T_InserFunction_Key").append("<div id='T_InserFunction_Key_Input'></div>");
			$("#T_InserFunction_Key_Input").css
			({
				"width":"calc(50% - 5px)",
				"float":"left",
				"margin-top":"1px",
				"margin-left":"5px",
			    /*"box-shadow":"rgb(136, 136, 136) 5px 3px 5px"*/
			});
			//新增功能碼輸入框 右框 文字方塊
			$("#T_InserFunction_Key_Input").append("<input id='T_InserFunction_Key_Input_Input' onkeypress='return event.charCode >= 48 && event.charCode <= 57'></input>");
			$("#T_InserFunction_Key_Input_Input").css
			({
				"width":"100%",
				"height":"20px",
				"font-size":"19px",
				"text-align":"center"
			});
			$("#T_InserFunction_Key_Input_Input").attr('placeholder','輸入代碼');
			$("#T_InserFunction_Key_Input_Input").attr('maxlength','4');
			$("#T_InserFunction_Key_Input_Input").focus();
			$("#T_InserFunction_Key_Input_Input").keyup(function(e)
			{
				if($(this).val().length == 4 && e.keyCode == 13)
				{
					//開啟畫面
					loadJs("js/" + $(this).val() + ".js");
					//清空功能碼
					$(this).val("");
				}
			});
		}
		//建立 Mainpage_Main
		new function()
		{
			//新增 Mainpage_Main
			$('#Mainpage').append('<div id="Mainpage_Main"></div>');
			//Mainpage_Main 準備好
			$('#Mainpage_Main').ready(function()
			{
				//tab
				$('#Mainpage_Main').append('<div id="tabs" style="height:100%;">'+
				  	'<ul>'+
				    	'<li id="HomeTab" style="margin-top:-3px;">'+
				    		'<a href="#Home_Y02_a">'+
				    			'<div style="background: url(image/home.png) no-repeat center right;background-size: 20px 20px;width: 20px;height: 20px;"></div>'+
				    		'</a>'+
				    	'</li>'+
				  	'</ul>'+
				  	'<div id="Home_Y02_a">'+
				 	'</div>'+
				'</div>');
				//tabs 事件
				$(function()
				{
					var tabs = $( "#tabs" ).tabs();
					// close icon: removing the tab on click
					tabs.delegate( "span.ui-icon-close", "click", function()
					{
						var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
						$( "#" + panelId ).remove();
						tabs.tabs( "refresh" );
					});
					tabs.bind( "keyup", function(event)
					{
						if ( event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE )
						{
							var panelId = tabs.find( ".ui-tabs-active" ).remove().attr( "aria-controls" );
							$( "#" + panelId ).remove();
							tabs.tabs( "refresh" );
						}
					});
				});
			});
		}
		//載入權限檔案
		loadJs('js/systemPower.js');
	}
	catch(err)
	{
		if(App_Debug)
		{
			console.log(err);
		}
	}
};