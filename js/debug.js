//儲存所有的 Window Resize 方法及屬性
var Resizer_Array = [];
//判定客戶端作業系統
function getClintOS()
{
	var OSName="Unknown OS";
	if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
	if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
	if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
	if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
	return OSName;
}
//定義 Grid_Panel
var Grid_Panel_Define = 
{
	//初始化定義
	Initialize : function(View)
	{
		try
		{			
			//主物件
			var Grid_Panel = {};
			//設定表個內容高度
			Grid_Panel.Table_Lineheight = "60px";
			//判斷是否已經針對捲軸修改物件寬度
			Grid_Panel.Scroll_Change = false;
			//定義物件編號
			Grid_Panel.getId = function()
			{
				return Grid_Panel.ID;
			}
			Grid_Panel.setId = function(ID)
			{
				//定義標題內容
				Grid_Panel.ID = ID;				
				//清空 View
				$('#'+ID).empty();
			}
			//定義標題內容
			Grid_Panel.getHeader_Title = function()
			{
				return Grid_Panel.Content;
			}
			Grid_Panel.setHeader_Title = function(Content)
			{
				//定義標題內容
				Grid_Panel.Content = Content;
			}
			//定義標題寬度
			Grid_Panel.getHeader_Width = function()
			{
				return Grid_Panel.Width;
			}
			Grid_Panel.setHeader_Width = function(Width)
			{
				//定義標題內容
				Grid_Panel.Width = Width;
			}
			//定義一次資料顯示筆數
			Grid_Panel.getPagesize = function()
			{
				return Grid_Panel.Pagesize;
			}
			Grid_Panel.setPagesize = function(Pagesize)
			{
				//定義標題內容
				Grid_Panel.Pagesize = Pagesize;
			}
			//定義搜尋起始值
			Grid_Panel.getStart = function()
			{
				return (Grid_Panel.Start)?Grid_Panel.Start:0;
			}
			Grid_Panel.setStart = function(Start)
			{
				//定義標題內容
				Grid_Panel.Start = Start;
			}
			//定義搜尋起始值
			Grid_Panel.getPage = function()
			{
				return (Grid_Panel.Page)?Grid_Panel.Page:1;
			}
			Grid_Panel.setPage = function(Page)
			{
				//定義標題內容
				Grid_Panel.Page = Page;
				//重設 Start
				var currentPage = Grid_Panel.getPage() - 1;
				var pageSize = Grid_Panel.getPagesize();
				Grid_Panel.Start = currentPage * pageSize;
			}
			//定義 Model
			Grid_Panel.getModel = function()
			{
				return Grid_Panel.Model;
			}
			Grid_Panel.setModel = function(Model)
			{
				//定義標題內容
				Grid_Panel.Model = Model;
			}
			//定義 是否顯示
			Grid_Panel.getVisiablity = function()
			{
				return Grid_Panel.Visiablity;
			}
			Grid_Panel.setVisiablity = function(Visiablity)
			{
				//定義標題內容
				Grid_Panel.Visiablity = Visiablity;
			}
			//定義 fieldShow
			Grid_Panel.getfieldShow = function()
			{
				return Grid_Panel.fieldShow;
			}
			Grid_Panel.setfieldShow = function(fieldShow)
			{
				Grid_Panel.fieldShow = fieldShow;
			}
			//建立工作列 Header
			Grid_Panel.createToolbar = function()
			{
				var Toolbar = Grid_Panel.getId() + '_Toolbar';
				//如果物件產生過就不重複產生
				if($('#' + Toolbar).length === 0)
				{
					//新增 Toolbar
					$('#'+this.getId()).append("<div id='" + Toolbar + "' class='Mainpage_Main_Toolbar'></div>");
				}		
				//清空 Toolbar
				$('#' + Toolbar).empty();
			}
			//建立 header
			Grid_Panel.createHeader = function()
			{
				var content = Grid_Panel.getHeader_Title();
				var width = Grid_Panel.getHeader_Width();
				var Header = Grid_Panel.getId() + '_Header';
				$("#" + Header).empty();
				//如果物件產生過就不重複產生
				if($('#' + Header).length === 0)
				{
					//新增 header
					$('#'+this.getId()).append("<div id='" + Header + "' class='Mainpage_Main_Header'></div>");
				}
				//確認內容與寬度陣列
				if(!content || !width || content.length !== width.length)
				{
					throw "Content and Width 數量不一致";
				}			
				//清空 header
				$('#' + Header).empty();
				//自動計算總寬度 把剩下的寬度在最後一格補上
				var totalWidth = 0;
				var tdWidth = 0;
				//取得最後一筆有顯示的項目編號 翻轉陣列 取得翻轉回來的正常編號
				var lastShow_ID = Grid_Panel.getfieldShow().length - 1 - jQuery.inArray(true,Grid_Panel.getfieldShow().reverse());
				//取得後翻轉回來
				Grid_Panel.getfieldShow().reverse();
				//依序產生 header 物件
				for(var i=0;i<content.length;i++)
				{
					//依照是否顯示
					var fieldShow_Css = (Grid_Panel.getfieldShow()[i])?'':'display:none;';
					//如果是最後一筆 且有顯示
					if(i == lastShow_ID && Grid_Panel.getfieldShow()[i])
					{
						tdWidth = (100 - totalWidth) + "%";
					}
					else if(Grid_Panel.getfieldShow()[i])
					{
						tdWidth = width[i];
					}
					//產生表格並設定寬度
					if(Grid_Panel.getModel()[i] == "checkbox" || Grid_Panel.getModel()[i] == "CheckBox")
					{
						//核取方塊
						$('#' + Header).append("<div header_width='" + ((Grid_Panel.getHeader_Width()[i] == "0%")?"0%":tdWidth) + "' fieldShow='" + Grid_Panel.getfieldShow()[i] + "' name='" + Grid_Panel.getModel()[i] + "' class='Mainpage_Main_Header_div translateHtml' style='text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:calc(" + tdWidth + " - 3px);" + fieldShow_Css + "' myId='" + content[i] + "'><input id='" + Grid_Panel.getId() + "_" + Grid_Panel.getModel()[i] + "' type='checkbox' style='width: 20px;height: 20px;cursor: pointer;margin-top: 20px;'></div>");
						//新增全選監聽
						$("#" + Grid_Panel.getId() + "_" + Grid_Panel.getModel()[i]).change(function()
						{
							if($(this).prop("checked"))
							{
								$("#" + Grid_Panel.getId() + " input[name='checkbox']").prop("checked",true);
								//選定其他的選定
								var item = $("#" + Grid_Panel.getId() + "_Table").children();
								for(var i = 0; i < item.length; i++)
								{
									item.eq(i).addClass("Mainpage_Main_Table_Active");
								};
							}
							else
							{
								$("#" + Grid_Panel.getId() + " input[name='checkbox']").prop("checked",false);
								//去除其他的選定
								var item = $("#" + Grid_Panel.getId() + "_Table").children();
								for(var i = 0; i < item.length; i++)
								{
									item.eq(i).removeClass("Mainpage_Main_Table_Active");
								};
							}
						});
					}
					else
					{
						//一般表格 設定寬度
						$('#' + Header).append("<div header_width='" + ((Grid_Panel.getHeader_Width()[i] == "0%")?"0%":tdWidth) + "' fieldShow='" + Grid_Panel.getfieldShow()[i] + "' id='" + Grid_Panel.getId() + "_" + Grid_Panel.getModel()[i] + "' name='" + Grid_Panel.getModel()[i] + "' class='Mainpage_Main_Header_div translateHtml' style='text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:calc(" + tdWidth + " - 2px);" + fieldShow_Css + "' myId='" + content[i] + "'>" + content[i] + "</div>");
						//新增排序圖示
						$('#' + Header).append("<span class='Mainpage_Header_All' id='" + Grid_Panel.getId() + "_" + Grid_Panel.getModel()[i] + "_Sort' style='" + fieldShow_Css + "'></span>");
						//新增點擊排序
						$("#" + Grid_Panel.getId() + "_" + Grid_Panel.getModel()[i] + "_Sort").click(function()
						{
							//如果沒有排序過 由大到小
							if($(this).attr('sort') == "Asc")
							{
								//改變狀態
								$(this).attr('sort','Desc');
								//刪除舊 Class
								$(this).removeClass('Mainpage_Header_Asc');
								$(this).removeClass('Mainpage_Header_All');
								//新增 Class
								$(this).addClass('Mainpage_Header_Desc');
								//實施排序
								sortItem_Desc(Grid_Panel.getId(),$(this).prev().attr('name'));
							}
							//由小到大
							else if($(this).attr('sort') == undefined || $(this).attr('sort') == "Desc")
							{
								//改變狀態
								$(this).attr('sort','Asc');
								//刪除舊 Class
								$(this).removeClass('Mainpage_Header_Desc');
								$(this).removeClass('Mainpage_Header_All');
								//新增 Class
								$(this).addClass('Mainpage_Header_Asc');
								//實施排序
								sortItem_Asc(Grid_Panel.getId(),$(this).prev().attr('name'));
							}
						});
					}
					//紀錄寬度
					totalWidth = parseFloat(totalWidth) + parseFloat(width[i].replace('%',''));
				}
				//判定標題是否能移動
				if(Grid_Panel.getHeaderMoveable())
				{
					$("#" + Grid_Panel.getId() + "_Header").sortable
					({
						revert: true,
						axis: "x",
						start:function()
						{
							//先隱藏排序圖示
							$("#" + Grid_Panel.getId() + "_Header span").hide();
						},
						stop:function(e)
						{
							//移動後 model
							var endModel = [];
							//移動後 fieldShow
							var endfieldShow = [];
							//移動後 Header_Width
							var endHeader_Width = [];
							//移動後 Header
							var endHeader = [];
							//新增 Model 資訊
							var endModel_Object = $("#" + Grid_Panel.getId() + "_Header div");
							for(var i = 0; i < endModel_Object.length; i++)
							{
								//新增修改後資訊
								endModel.push(endModel_Object.eq(i).attr('name'));
								endfieldShow.push((endModel_Object.eq(i).attr('fieldShow') == "true")?true:false);
								endHeader_Width.push(endModel_Object.eq(i).attr('header_width'));
								endHeader.push(endModel_Object.eq(i).attr('myid'));
							};
							//更新 GridPanel 資訊
							Grid_Panel.setModel(endModel);
							Grid_Panel.setfieldShow(endfieldShow);
							Grid_Panel.setHeader_Width(endHeader_Width);
							Grid_Panel.setHeader_Title(endHeader);
							Grid_Panel.setData(Grid_Panel.getData());
							//恢復排序圖示
							$("#" + Grid_Panel.getId() + "_Header span").show();
							var Model = Grid_Panel.getModel();
							for(var i = 0; i < Model.length; i++)
							{
								var divId = Grid_Panel.getId() + "_" + Model[i];
								var div_SortId = Grid_Panel.getId() + "_" + Model[i] + "_Sort";
								$("#" + div_SortId).insertAfter($("#" + divId));
							};
						}
				  	});
					$("#" + Grid_Panel.getId() + "_Header").disableSelection();
				}
			}
			//建立 table
			Grid_Panel.createTable = function()
			{
				var Table = Grid_Panel.getId() + '_Table';
				//新增 table
				$('#'+this.getId()).append("<div id='" + Table + "' class='Mainpage_Main_Table'></div>");
				//新增 Grid_Panel 紀錄
				GridPanel_Object[Grid_Panel.getId()] = Grid_Panel;
				//開始 Window 大小改變監聽
				this.startResize();
			}
			//設定 table 值
			Grid_Panel.load = function()
			{
				//設定之前先清空
				$('#' + this.getId() + '_Table').children().remove();
				//顯示 Loading
				var loadingMask = Loading_Mask.Initialize();
				loadingMask.setTarget('Mainpage_Main');
				//如果 Grid_Panel 有顯示才要出現 loading mask
				(Grid_Panel.getVisiablity() || Grid_Panel.getVisiablity() == undefined)?loadingMask.show():null;
				var url = Grid_Panel.getUrl();
				//Ajax Get 共用
				jqueryAjax_Get(url,function(response)
				{
					//隱藏 Loading
					loadingMask.close();
					//回傳資料
					var Result = jQuery.parseJSON(response);
					if(Result.success)
					{
						//設定資料
						Grid_Panel.setData(Result.data);
						//如果沒有資料
						if(Grid_Panel.getData().length == 0)
						{
							//設定目前頁數
							$('#' + Grid_Panel.getId() + '_Pagging_Page').val(0);
							//設定總頁數
							$('#' + Grid_Panel.getId() + '_Pagging_TotalPage').html(0);
							//設定從第幾筆開始
							$('#' + Grid_Panel.getId() + '_Pagging_Record_1').html(0);
							//設定單頁總共幾筆
							$('#' + Grid_Panel.getId() + '_Pagging_Record_3').html(0);
							//設定總筆數
							$('#' + Grid_Panel.getId() + '_Pagging_Record_5').html(0);
						}
						else
						{
							//最大數量
							var maxCount = (Result.maxCount)?Result.maxCount:Result.count;
							//設定目前頁數
							$('#' + Grid_Panel.getId() + '_Pagging_Page').val((Grid_Panel.getPage())?Grid_Panel.getPage():0);
							//設定總頁數
							var totalPage = Math.ceil(parseInt(maxCount) / parseInt(Grid_Panel.getPagesize()));
							Grid_Panel.setTotalpage(totalPage);
							$('#' + Grid_Panel.getId() + '_Pagging_TotalPage').html(totalPage);
							//設定從第幾筆開始
							var currentPage = Grid_Panel.getPage() - 1;
							var pageSize = Grid_Panel.getPagesize();
							var startCount = 1 + (currentPage * pageSize);
							$('#' + Grid_Panel.getId() + '_Pagging_Record_1').html(startCount);
							//設定單頁總共幾筆
							var endCount = ((Grid_Panel.getData().length)?Grid_Panel.getData().length:1) + (Grid_Panel.getPage() - 1) * (Grid_Panel.getPagesize());
							$('#' + Grid_Panel.getId() + '_Pagging_Record_3').html(endCount);
							//設定總筆數
							var totalCount = maxCount;
							$('#' + Grid_Panel.getId() + '_Pagging_Record_5').html(totalCount);
						}
					}
					else
					{
						//顯示錯誤訊息
						var Mainpage_Main_Msg = YesNo_Msg_Define.Initialize();
						Mainpage_Main_Msg.setMask(true);
						Mainpage_Main_Msg.setSmartdetect(true);
						Mainpage_Main_Msg.setWidth(300);
						Mainpage_Main_Msg.setHeight(168);
						Mainpage_Main_Msg.setId('Mainpage_Main_Msg');
						Mainpage_Main_Msg.setTitle('失敗');
						Mainpage_Main_Msg.show();
						Mainpage_Main_Msg.addMsgContent(Result.Message);
						Mainpage_Main_Msg.addYesNO_Button('取消','確認',
						//No
						function()
						{
							//關閉物化效果
							removeBlur_Css('Mainpage_Main');
							//關閉 Msg
						    Mainpage_Main_Msg.close();
						},
						//Yes
						function()
						{
							//關閉物化效果
							removeBlur_Css('Mainpage_Main');
							//關閉 Msg
						    Mainpage_Main_Msg.close();
						});
						//開啟物化效果
						addBlur_Css('Mainpage_Main');
					}
				},function(error)
				{
					//隱藏 Loading
					loadingMask.close();
					var Mainpage_Main_Msg = YesNo_Msg_Define.Initialize();
					Mainpage_Main_Msg.setMask(true);
					Mainpage_Main_Msg.setSmartdetect(true);
					Mainpage_Main_Msg.setWidth(300);
					Mainpage_Main_Msg.setHeight(168);
					Mainpage_Main_Msg.setId('Mainpage_Main_Msg');
					Mainpage_Main_Msg.setTitle('警告');
					Mainpage_Main_Msg.show();
					Mainpage_Main_Msg.addMsgContent(error.message);
					Mainpage_Main_Msg.addYesNO_Button('','確認',null,
					function()
					{
						//關閉 Msg
					    Mainpage_Main_Msg.close();
					});
					//隱藏 No 按鈕
					$('#Mainpage_Main_Msg_No').css("display","none");
					//置中 Yes 按鈕
					$('#Mainpage_Main_Msg_Yes').css({"margin-left":"0px","width":"100%"});
				},function()
				{

				});
			}
			//定義 load callback
			Grid_Panel.getLoad_Callback = function()
			{
				return Grid_Panel.Load_Callback;
			}
			Grid_Panel.setLoad_Callback = function(Load_Callback)
			{
				//定義標題內容
				Grid_Panel.Load_Callback = Load_Callback;
			}
			//定義是否能多選 如果沒有設定預設單選
			Grid_Panel.getMulti_Selectable = function()
			{
				return (Grid_Panel.Multi_Selectable == undefined)?false:Grid_Panel.Multi_Selectable;
			}
			Grid_Panel.setMulti_Selectable = function(Multi_Selectable)
			{
				//定義標題內容
				Grid_Panel.Multi_Selectable = Multi_Selectable;
			}
			//定義標題是否能移動
			Grid_Panel.getHeaderMoveable = function()
			{
				return (Grid_Panel.HeaderMoveable == undefined)?false:Grid_Panel.HeaderMoveable;
			}
			Grid_Panel.setHeaderMoveable = function(HeaderMoveable)
			{
				//定義標題內容
				Grid_Panel.HeaderMoveable = HeaderMoveable;
			}
			//設定 table 值
			Grid_Panel.setData = function(Content_Array)
			{
				//如果data不存在
				if(typeof(Content_Array) == "undefined")
				{
					return;
				}
				//如果本頁沒有資料了 且不是在第一頁
				if(Content_Array.length == 0 && Grid_Panel.getPage() != 1)
				{
					Grid_Panel.prevPage();
				}
				//恢復 checkBox 沒選狀態
				$("#" + Grid_Panel.getId() + "_Header input").prop("checked",false);
				//設定之前先清空
				$('#' + this.getId() + '_Table').children().remove();
				//依照 Model 資料存入
				var This_Model = this.getModel();
				//儲存回傳資料
				Grid_Panel.Data = Content_Array;
				//大於0筆的狀況
				if(Content_Array.length > 0)
				{
					//回傳內容
					for(var i=0;i<Content_Array.length;i++)
					{
						var Temp_Array = [];
						//Model 欄位
						for(var j=0;j<This_Model.length;j++)
						{
							//將資料轉存成陣列
							Temp_Array.push(Content_Array[i][This_Model[j]]);
							if(j == This_Model.length - 1)
							{
								var This_ID = this.getId();
								//總共新增了幾筆
								var Count = $('#' + This_ID + '_Table').children().length;
								//要新增的 div id
								var Current_ID = This_ID + "_Table_Inner_" + Count;
								//新增區別 div
								$('#' + This_ID + '_Table').append("<div id='" + Current_ID + "'></div>");
								//如果有需要多選
								if(Grid_Panel.getMulti_Selectable())
								{
									//新增滑鼠按下監聽 Ctrl
									$('#' + Current_ID).mousedown(function(e)
									{
										//單選
										if(!ctrlKey && !shiftKey)
										{
											var item = $("#" + This_ID + "_Table").children();
											for(var i = 0; i < item.length; i++)
											{
												item.eq(i).removeClass("Mainpage_Main_Table_Active");
											};
											$("#" + Grid_Panel.getId() + " input[name='checkbox']").prop("checked",false);
											$("#" + Grid_Panel.getId() + "_Header input").prop("checked",false);
										}
										//顯示目前選定 判斷要選定或取消
										(!$(this).hasClass("Mainpage_Main_Table_Active"))?$(this).addClass("Mainpage_Main_Table_Active"):$(this).removeClass("Mainpage_Main_Table_Active");
										//如果不是直接點擊核取方塊 則需要協助顯示
										if($(e.target)[0]['name'] != "checkbox")
										{
											(!$(this).find("input").prop("checked"))?$(this).find("input").prop("checked",true):$(this).find("input").prop("checked",false);
										}
										//Shift 多選
										if(shiftKey)
										{
											//取得第一個選擇的項目編號 由上至下搜尋
											var selectStart_ID = $("#" + Grid_Panel.getId() + "_Table .Mainpage_Main_Table_Active").eq(0).attr('id');
											var selectStart_Number = selectStart_ID.split('_')[selectStart_ID.split('_').length - 1];
											//取得第最後一個選擇的項目編號
											var selectEnd_ID = $(e.target)[0]['parentNode'].id;
											var selectEnd_Number = selectEnd_ID.split('_')[selectEnd_ID.split('_').length - 1];
											//如果第一個與最後一個相同 代表應該從後面開始找第一個選擇的項目編號
											if(selectStart_Number == selectEnd_Number)
											{
												//取得第一個選擇的項目編號 由下至上搜尋
												selectStart_ID = $("#" + Grid_Panel.getId() + "_Table .Mainpage_Main_Table_Active").eq($("#" + Grid_Panel.getId() + "_Table .Mainpage_Main_Table_Active").length - 1).attr('id');
												selectStart_Number = selectStart_ID.split('_')[selectStart_ID.split('_').length - 1];
											}
											//如果第一個項目編號比較小 依照第一個與最後一個的編號多選之間的項目
											if(selectStart_Number < selectEnd_Number)
											{
												for(var i = selectStart_Number; i <= selectEnd_Number; i++)
												{
													$("#" + Grid_Panel.getId() + "_Table_Inner_" + i).addClass("Mainpage_Main_Table_Active");
													$("#" + Grid_Panel.getId() + "_Table_Inner_" + i).find("input").prop("checked",true);
												};
											}
											//如果第一個項目編號比較大 依照第一個與最後一個的編號多選之間的項目
											if(selectStart_Number > selectEnd_Number)
											{
												for(var i = selectStart_Number; i >= selectEnd_Number; i--)
												{
													$("#" + Grid_Panel.getId() + "_Table_Inner_" + i).addClass("Mainpage_Main_Table_Active");
													$("#" + Grid_Panel.getId() + "_Table_Inner_" + i).find("input").prop("checked",true);
												};
											}								
										}
										//判斷是否全選
										var selectItem_Count = $(this).parent().find('.Mainpage_Main_Table_Active').length;
										var gridPanel_Pagesize = Grid_Panel.getPagesize();
										if(selectItem_Count == gridPanel_Pagesize)
										{
											$("#" + Grid_Panel.getId() + "_Header div[name='CheckBox']").find('input').prop("checked",true);
										}
										else
										{
											$("#" + Grid_Panel.getId() + "_Header div[name='CheckBox']").find('input').prop("checked",false);
										}
									});
								}
								//新增文字不能被選取
								$('#' + Current_ID).addClass("noSelected");
								//新增區別 div 的 Contextmenu
								this.createContextmenu(Current_ID);
								//取得 header content
								var Width = this.getHeader_Width();
								//自動計算總寬度 把剩下的寬度在最後一格補上
								var totalWidth = 0;
								var tdWidth = 0;
								//取得最後一筆有顯示的項目編號 翻轉陣列 取得翻轉回來的正常編號
								var lastShow_ID = Grid_Panel.getfieldShow().length - 1 - jQuery.inArray(true,Grid_Panel.getfieldShow().reverse());
								//取得後翻轉回來
								Grid_Panel.getfieldShow().reverse();
								//產生 table 內容 寬度必須對應
								for(var k=0;k<Width.length;k++)
								{
									//依照是否顯示
									var fieldShow_Css = (Grid_Panel.getfieldShow()[k])?'':'display:none;';
									//欄位內值
									var fieldValue = (Temp_Array[k])?Temp_Array[k]:'';
									//如果是最後一筆 且有顯示
									if(k == lastShow_ID && Grid_Panel.getfieldShow()[k])
									{
										tdWidth = (100 - totalWidth) + "%";
									}
									else if(Grid_Panel.getfieldShow()[k])
									{
										tdWidth = Width[k];
									}
									//設定寬度
									$('#'+Current_ID).append("<div class='translateHtml' Header_Width='" + ((Grid_Panel.getHeader_Width()[k] == "0%")?"0%":tdWidth) + "' fieldShow='" + Grid_Panel.getfieldShow()[k] + "' name='" + Grid_Panel.getModel()[k] + "' style='width:calc(" + tdWidth + " - 1px);line-height:" + this.Table_Lineheight + ";display:inline-block;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;height:60px;" + fieldShow_Css + "'>" + fieldValue + "</div>");
									//紀錄寬度
									totalWidth = parseFloat(totalWidth) + parseFloat(Width[k].replace('%',''));
								}
							}
						}
						//最後執行 Callback
						if(i == Content_Array.length - 1)
						{
							//如果有 Callback
							if(Grid_Panel.getLoad_Callback())
							{
								Grid_Panel.getLoad_Callback()();
							}
						}
					}
				}
				//判斷是否要針對捲軸的出現做大小改變
				this.getResizer();
			}
			Grid_Panel.getData = function()
			{
				return Grid_Panel.Data;
			}
			//定義搜尋起始值
			Grid_Panel.getTotalpage = function()
			{
				return (Grid_Panel.Totalpage)?Grid_Panel.Totalpage:0;
			}
			Grid_Panel.setTotalpage = function(Totalpage)
			{
				//定義標題內容
				Grid_Panel.Totalpage = Totalpage;
			}
			//第一頁
			Grid_Panel.firstPage = function()
			{
				//如果不是第一頁
				if(Grid_Panel.getPage() != 1)
				{
					Grid_Panel.setPage(1);
					Grid_Panel.load();
				}
			}
			//上一頁
			Grid_Panel.prevPage = function()
			{
				//如果總頁數大於零 且 目前頁數沒有比總頁數還要大
				if(Grid_Panel.getPage() > 1)
				{
					Grid_Panel.setPage(parseInt(Grid_Panel.getPage()) - parseInt(1));
					Grid_Panel.load();
				}
			}
			//下一頁
			Grid_Panel.nextPage = function()
			{
				//如果總頁數大於零 且 目前頁數沒有比總頁數還要大
				if(Grid_Panel.getTotalpage() != 0 && Grid_Panel.getPage() < Grid_Panel.getTotalpage())
				{
					Grid_Panel.setPage(parseInt(Grid_Panel.getPage()) + parseInt(1));
					Grid_Panel.load();
				}
			}
			//最後一頁
			Grid_Panel.lastPage = function()
			{
				//如果不是最後一頁
				if(Grid_Panel.getPage() != Grid_Panel.getTotalpage())
				{
					Grid_Panel.setPage(Grid_Panel.getTotalpage());
					Grid_Panel.load();
				}
			}
			//建立 Contextmenu
			Grid_Panel.createContextmenu = function(id)
			{
				//如果設定為產生 Contextmenu 且產生方法內有弄容 才執行產生
				if(this.getContextmenu())
				{
					this.getContextmenu_Func()(id);
				}
			}
			//定義 Contextmenu_Func
			Grid_Panel.getContextmenu_Func = function()
			{
				return Grid_Panel.Contextmenu_Func;
			}
			Grid_Panel.setContextmenu_Func = function(Contextmenu_Func)
			{
				Grid_Panel.Contextmenu_Func = Contextmenu_Func;
			}
			//定義 Contextmenu
			Grid_Panel.getContextmenu = function()
			{
				return Grid_Panel.Contextmenu;
			}
			Grid_Panel.setContextmenu = function(Contextmenu)
			{
				Grid_Panel.Contextmenu = Contextmenu;
			}
			//建立 Pagging
			Grid_Panel.createPagging = function()
			{
				var Pagging = Grid_Panel.getId() + '_Pagging';
				//建立 Pagging 內容
				$('#' + this.getId()).append("<div id='" + Pagging + "' class='Mainpage_Main_Pagging'></div>");
				$('#' + Pagging).append("<div id='" + Pagging + "_First_Page' class='First_Page'></div>");
				$('#' + Pagging).append("<div id='" + Pagging + "_Previous_Page' class='Previous_Page'></div>");
				$('#' + Pagging).append("<div class='Separator'></div>");
				$('#' + Pagging).append("<div class='translateHtml'>第</div>");
				$('#' + Pagging).append("<input id='" + Pagging + "_Page' type='text' value='0' onkeypress='return event.charCode >= 48 && event.charCode <= 57'></input>");
				$('#' + Pagging).append("<div class='translateHtml'>頁，共</div>");
				$('#' + Pagging).append("<div id='" + Pagging + "_TotalPage'>0</div>");
				$('#' + Pagging).append("<div class='translateHtml'>頁</div>");
				$('#' + Pagging).append("<div class='Separator'></div>");
				$('#' + Pagging).append("<div id='" + Pagging + "_Next_Page' class='Next_Page'></div>");
				$('#' + Pagging).append("<div id='" + Pagging + "_Last_Page' class='Last_Page'></div>");
				$('#' + Pagging).append("<div class='Separator'></div>");
				$('#' + Pagging).append("<div id='" + Pagging + "_Refresh_Page' class='Refresh_Page'></div>");
				$('#' + Pagging).append("<div id='" + Pagging + "_Record_0' class='Record_0 translateHtml'>紀錄 : 從</div>");
				$('#' + Pagging).append("<div id='" + Pagging + "_Record_1' class='Record_1'>0</div>");
				$('#' + Pagging).append("<div id='" + Pagging + "_Record_2' class='Record_2'> - </div>");
				$('#' + Pagging).append("<div id='" + Pagging + "_Record_3' class='Record_3'>0</div>");
				$('#' + Pagging).append("<div id='" + Pagging + "_Record_4' class='Record_4 translateHtml'>共</div>");
				$('#' + Pagging).append("<div id='" + Pagging + "_Record_5' class='Record_5'>0</div>");
				$('#' + Pagging).append("<div id='" + Pagging + "_Record_6' class='Record_6 translateHtml'>筆</div>");
				//頁數 Input
				$('#' + Pagging + '_Page').keyup(function(e)
				{
					if(e.keyCode == 13)
					{
						if($('#' + Pagging + '_Page').val() <= 0)
						{
							$('#' + Pagging + '_Page').val(1);
						}
						else if($('#' + Pagging + '_Page').val() > Grid_Panel.getTotalpage())
						{
							$('#' + Pagging + '_Page').val(Grid_Panel.getTotalpage());
						}
						else if($('#' + Pagging + '_Page').val() > 0 && $('#' + Pagging + '_Page').val() <= Grid_Panel.getTotalpage())
						{
							Grid_Panel.setPage($('#' + Pagging + '_Page').val());
							Grid_Panel.load();
						}
					}
				});
				//第一頁
				$('#' + Pagging + '_First_Page').click(function()
				{
					Grid_Panel.firstPage();
				});
				//上一頁
				$('#' + Pagging + '_Previous_Page').click(function()
				{
					Grid_Panel.prevPage();
				});
				//下一頁
				$('#' + Pagging + '_Next_Page').click(function()
				{
					Grid_Panel.nextPage();
				});
				//最後一頁
				$('#' + Pagging + '_Last_Page').click(function()
				{
					Grid_Panel.lastPage();
				});
				//重整按鈕
				$('#' + Pagging + '_Refresh_Page').click(function()
				{
					Grid_Panel.load();
				});
			}
			//新增 Pagging 文字方塊
			Grid_Panel.addPagging_Textfield = function(ID,defautValue)
			{
				var Pagging = Grid_Panel.getId() + '_Pagging';
				//文字方塊
				$('#' + Pagging).append("<input id='" + ID + "' type='text' placeholder='" + defautValue + "' class='translatePlaceholder'></input>");
				$('#' + ID).css({"height":"19px",
								 "width":"72px",
								 "margin":"10px 0 0 13px",
								 "float":"left",
								 "text-align":"center",
								 "border-radius":"4px",
								 "border-width":"1px",
								 "border-style":"solid",
								 "border-color":"#cecece"
								});
			}
			//新增 Pagging 下拉式選單
			Grid_Panel.addPagging_Combobox = function(ID)
			{
				var Pagging = Grid_Panel.getId() + '_Pagging';
				//下拉式選單
				$('#' + Pagging).append("<select id='" + ID + "'></select>");
				$('#' + ID).css
				({
					"text-indent":"5px",
					"height":"23px",
					"width":"72px",
					"margin":"10px 0 0 13px",
					"float":"left",
					"text-align":"center",
					"border-radius":"4px",
					"border-width":"1px",
					"border-style":"solid",
					"border-color":"#cecece",
					"cursor":"pointer"
				});
			}
			//新增 Pagging 按鈕
			Grid_Panel.addPagging_Button = function(ID,defautValue)
			{
				var Pagging = Grid_Panel.getId() + '_Pagging';
				//按鈕
				$('#' + Pagging).append("<input type='button' id='" + ID + "' value='" + defautValue + "' class='translateHtml'></input>");
				$('#' + ID).css
				({
					"height":"19px",
					"width":"80px",
					"margin":"12px 0 0 13px",
					"float":"left",
					"text-align":"center",
					"border-radius":"4px",
					"border-width":"1px",
					"border-style":"solid",
					"border-color":"#cecece",
					"cursor":"pointer",
				    "background-color":"white"
				});
			}
			//新增 Pagging 日期選擇
			Grid_Panel.addPagging_DatetimePicker = function(Pagging,ID,defautValue)
			{
				//日期選擇
				$('#' + Pagging).append("<input type='text' value='' id='" + ID + "'/>");
				//設定語言選項
				$.datetimepicker.setLocale('zh');
				//產生日期選擇
				$('#' + ID).datetimepicker();
				//Css
				$('#' + ID).css
				({
					"height":"23px",
					"width":"266px",
					"margin":"10px 0 0 13px",
					"float":"left",
					"text-align":"center",
					"border-radius":"4px",
					"border-width":"1px",
					"border-style":"solid",
					"border-color":"#cecece",
					"cursor":"pointer"
				});
			}
			//定義 Window Resize Event 編號
			Grid_Panel.getResizer_ID = function()
			{
				return Grid_Panel.Resizer_ID;
			}
			Grid_Panel.setResizer_ID = function(Resizer_ID)
			{
				//定義標題內容
				Grid_Panel.Resizer_ID = Resizer_ID;
			}
			//Window 大小改變
			Grid_Panel.getResizer = function()
			{
				//確認要新增的監聽是否已經新增過 而且作業系統是 Windows 才需要因為捲軸改變大小  如果都沒有才能新增監聽
				if(jQuery.inArray(Grid_Panel.getId(),Resizer_Array) == -1 && getClintOS() == 'Windows')
				{
					//取得是否出現卷軸套件(垂直)
					function checkHasScrollbar(id)
					{
						div = document.getElementById(id);
						var hasHorizontalScrollbar = div.scrollWidth > div.clientWidth;
						var hasVerticalScrollbar = div.scrollHeight > div.clientHeight;
						return hasVerticalScrollbar;
					}
					//依照畫面大小改變 有可能會出現倦軸
					if($('#' + Grid_Panel.getId() + '_Header').length == 1)
					{
						var Header_Count = null;
						//Grid_Panel 存在
						if(Grid_Panel)
						{
							Header_Count = Grid_Panel.getHeader_Title().length;
						}
						//如果捲軸出現 且還沒因為捲軸出現而做過寬度改變
						if(checkHasScrollbar(Grid_Panel.getId() + '_Table') && !Grid_Panel.Scroll_Change)
						{
							//則因為捲軸寬度進行改變
							for(var i=0;i<$('#' + Grid_Panel.getId() + '_Header').children().length;i++)
							{
								var scrollWidth = 17 / Header_Count;
								$('#' + Grid_Panel.getId() + '_Header').children().eq(i).css('width','calc(' + $('#' + Grid_Panel.getId() + '_Header').children()[i].style.width + ' - ' + scrollWidth + 'px)');
							}
							Grid_Panel.Scroll_Change = true;
						}
						else
						{
							//如果捲軸已經沒有出現
							if(!checkHasScrollbar(Grid_Panel.getId() + '_Table'))
							{
								Grid_Panel.createHeader(Grid_Panel.getId() + '_Header');
								Grid_Panel.Scroll_Change = false;
							}
						}
					}
				}
			}
			//開始 Window 大小改變監聽
			Grid_Panel.startResize = function()
			{
				//如果作業系統是 Windows 才需要依照捲軸大小改面畫面寬度
				if(getClintOS() == 'Windows')
				{
					var Found = false;
					for (var i = 0; i < Resizer_Array.length; i++)
					{
						if(Resizer_Array[i].Resizer_ID == Grid_Panel.getId())
						{
							Found = true;
							break;
						}
					};
					//如果沒有發現重複 才能新增 Windows Resize
					if(!Found)
					{
						//沒有新增過 Resize Event 則新增進 Resizer 陣列
						var Temp_Array = [];
						Temp_Array.Resizer_ID = Grid_Panel.getId();
						Temp_Array.Resizer_Object =  Grid_Panel;
						Temp_Array.Resizer_Target =  'Grid_Panel';
						Resizer_Array.push(Temp_Array);
						//新增監聽
						$(window).resize(Grid_Panel.getResizer);
						//立即判斷
						Grid_Panel.getResizer();
					}
					//如果有找到重複 則移除重複 Resize Event 且從 Resizer_Array 中移除
					else if(Found)
					{
						//要刪除的項目
						var removeItem = Grid_Panel.getId();
						//移除重複 Resize Event
						jQuery.grep(Resizer_Array, function(value)
						{
							//如果找到一樣的編號 則移除物件 Resize 監聽
							if(value.Resizer_ID == removeItem)
							{
								//移除物件 Resize 監聽
								value.Resizer_Object.endResize();
							}
						});
						//更新 Resizer_Array
						Resizer_Array = jQuery.grep(Resizer_Array, function(value)
						{
							return value.Resizer_ID != removeItem;
						});
						//更新後 再新增自己需要新增的 Resizer
						Grid_Panel.startResize();
					}
				}
			}
			//結束 Window 大小改變監聽
			Grid_Panel.endResize = function()
			{
				$(window).off("resize",Grid_Panel.getResizer);
			}
			//回傳物件
			return Grid_Panel;
		}
		catch(err)
		{
			if(App_Debug)
			{
				console.log(err);
			}
		}
	}
}
//定義 Window
var Window_Define = 
{
	//初始化定義
	Initialize : function()
	{
		try
		{
			//主物件
			var Window = {};

			//定義視窗標題
			Window.getTitle = function()
			{
				return Window.Title;
			}
			Window.setTitle = function(Title)
			{
				//定義視窗標題
				Window.Title = Title;
			}
			//定義視窗寬度
			Window.getWidth = function()
			{
				return Window.Width;
			}
			Window.setWidth = function(Width)
			{
				//定義視窗寬度
				Window.Width = Width;
			}
			//定義視窗高度
			Window.getHeight = function()
			{
				return Window.Height;
			}
			Window.setHeight = function(Height)
			{
				//定義視窗高度
				Window.Height = Height;
			}
			//定義物件編號
			Window.getId = function()
			{
				return Window.ID;
			}
			Window.setId = function(ID)
			{
				//定義視窗高度
				Window.ID = ID;
				//避免重複 清空物件
				$('#'+ID).empty();
			}
			//定義物件 Mask
			Window.getMask = function()
			{
				return Window.Mask;
			}
			Window.setMask = function(Mask)
			{
				//定義視窗高度
				Window.Mask = Mask;
			}
			//建立 Window
			Window.create = function()
			{
				//取得物建長寬
				var Width = this.getWidth();
				var Height = this.getHeight();
				var ID = this.getId();
				var marginLeft = "-" + (Width/2) + "px";
				var marginTop = "-" + (Height/2) + "px";
				//建立 Window
				$('body').append("<div id='" + ID + "'></div>");
				//Css
				$('#' + ID).css
				({
					"width":Width+"px",
					"height":Height+"px",
					"z-index":"99",
					"box-shadow":"0px 0px 10px #888888",
					"border-radius":"4px",
					"overflow":"auto",
					"background-color":"white"
				});
				//水平垂直置中
				$('#' + ID).center();
				//建立 Window Title
				this.createTitle();
				//建立 Window Body
				this.createBody();
				//建立 Window Resize 監聽
				this.startResize();
				//建立全螢幕Mask
				this.createMask();
				//智慧偵測 Ese->No Enter->Yes
				if(this.getSmartdetect())
				{
					this.startSmartdetect();
				}
			}
			//建立全螢幕Mask
			Window.createMask = function()
			{
				var This_ID = this.getId();
				if(this.getMask())
				{
					//建立 Mask
					$('body').append("<div id='" + This_ID + "_Mask'></div>");
					//Css
					$('#' + This_ID + '_Mask').css
					({
						"width":"100%",
						"height":"100%",
						"position":"absolute",
						"left":"0px",
						"top":"0px",
						"z-index":"98"
					});
					if(Window.getId() != "Login_Window")
					{
						//Click
						$('#' + This_ID + '_Mask').click(function()
						{
							Window.close();
						});
					}
				}
			}
			//建立 Window Title
			Window.createTitle = function()
			{
				var ID = this.getId();
				var Width = this.getWidth() + "px";
				//建立 Window Title
				// $('#' + ID).append("<div id='" + ID + "_Closed' class='Window_Closed'></div>");
				// $('#' + ID + '_Closed').css
				// ({
				// 	"height":"13px",
				//     "width":"13px",
				//     "margin-top":"14px",
				//     "margin-left":"12px",
				//     "position":"absolute",
				//     "cursor":"pointer",
				//     "background-image":"url('image/window_closed.png')",
				//     "background-size":"100% 100%"
				// });
				// $('#' + ID + '_Closed').click(function()
				// {
				// 	Window.close();
				// });
				$('#' + ID).append("<div id='" + ID + "_Title' class='translateHtml'>" + this.getTitle() + "</div>");
				$('#' + ID + '_Title').css
				({
					"width":Width,
					"height":"38px",
					"background":"rgb(84,116,165)",
					"background":"-moz-linear-gradient(left, rgb(84,116,165) 1%, rgb(102,144,190) 100%)",
					"background":"-webkit-linear-gradient(left, rgb(84,116,165) 1%,rgb(102,144,190) 100%)",
					"background":"linear-gradient(to right, rgb(84,116,165) 1%,rgb(102,144,190) 100%)",
					"filter":"progid:DXImageTransform.Microsoft.gradient( startColorstr='#5474a5', endColorstr='#6690be',GradientType=1 )",
					"border-radius":"4px",
					"display":"table-cell",
					"overflow":"hidden",
					"white-space":"nowrap",
					"-o-text-overflow":"ellipsis",
					"text-overflow":"ellipsis",
					"vertical-align":"middle",
					"font-weight":"bold",
					"color":"rgb(255,255,255)",
					"font-size":"16pt",
					"text-align":"center"
				});
			}
			//建立 Window Body
			Window.createBody = function()
			{
				var ID = this.getId();
				//建立 Window Body
				$('#' + ID).append("<div id='" + ID + "_Body'></div>");
				$('#' + ID + '_Body').css
				({
					"height":"calc(100% - 78px)",
					"padding":"10px 20px 20px 20px"
				});
			}
			//新增 Window Textfield
			Window.addTextfield = function(ID,Label)
			{
				var This_ID = this.getId();
				//建立 Window Textfield 群組 Div
				$('#' + This_ID + "_Body").append("<div id='" + ID + "_Group'></div>");
				//建立 Window Textfield label
				$('#' + ID + "_Group").append("<div class='Font translateHtml' id='" + ID + "_Label'>" + Label + "</div>");
				//建立 Window Textfield text
				$('#' + ID + "_Group").append("<input class='Font Window_Textfield' id='" + ID + "' type='text'></input>");
				//Group Css
				$('#' + ID + "_Group").css
				({
					"margin-top":"15px"
				});
				//label Css
				$('#' + ID + "_Label").css
				({
					"float":"left",
					"width":"95px"
				});
				//Textfield Css
				$('#' + ID).css
				({
					"width":"calc(100% - 100px)",
					"border":"0px",
					"border-bottom":"rgb(152,152,152) 1px solid",
					// "margin-top":"-5px"
				});
				//建立 Textfield Focus
				$('#' + ID).focus(function()
				{
					$('#' + this.id).css("border-bottom","rgb(69,200,200) 1px solid");
					$('#' + this.id).prev().css("color","rgb(69,200,200)");
				});
				//建立 Textfield Blur
				$('#' + ID).blur(function()
				{
					$('#' + this.id).css("border-bottom","rgb(152,152,152) 1px solid");
					$('#' + this.id).prev().css("color","rgb(60,60,60)");
				});
			}
			//新增 Window Radio
			Window.addRadio = function(ID,Label,Radio_Name,Radio1,Radio2,Radio1_Value,Radio2_Value)
			{
				var This_ID = this.getId();
				//建立 Window Radio 群組 Div
				$('#' + This_ID + "_Body").append("<div id='" + ID + "_Group'></div>");
				//建立 Window Radio label
				$('#' + ID + "_Group").append("<div class='Font' id='" + ID + "_Label'>" + Label + "</div>");
				//建立 Window Radio1
				$('#' + ID + "_Group").append("<input class='Font' name='" + Radio_Name + "' id='" + ID + "_1' type='radio' value='" + Radio1_Value + "'></input>");
				//建立 Window Radio1 text
				$('#' + ID + "_Group").append("<div class='Font' id='" + ID + "_1_Div'>" + Radio1 + "</div>");
				//建立 Window Radio2
				$('#' + ID + "_Group").append("<input class='Font' name='" + Radio_Name + "' id='" + ID + "_2' type='radio' value='" + Radio2_Value + "'></input>");
				//建立 Window Radio2 text
				$('#' + ID + "_Group").append("<div class='Font' id='" + ID + "_2_Div'>" + Radio2 + "</div>");
				//Group Css
				$('#' + ID + "_Group").css
				({
					"margin-top":"15px"
				});
				//label Css
				$('#' + ID + "_Label").css
				({
					"float":"left",
					"width":"95px"
				});
				//Radio Css
				$('#' + ID + "_1").css
				({
					"border":"0px",
					"border-bottom":"rgb(152,152,152) 1px solid",
					"float":"left",
					"margin-top":"6px",
					"cursor":"pointer"
				});
				//Radio Css
				$('#' + ID + "_1_Div").css
				({
					"float":"left",
					"cursor":"pointer"
				});
				//Radio Css
				$('#' + ID + "_2").css
				({
					"margin-left":"25%",
					"border":"0px",
					"border-bottom":"rgb(152,152,152) 1px solid",
					"float":"left",
					"margin-top":"6px",
					"cursor":"pointer"
				});
				//Radio Css
				$('#' + ID + "_2_Div").css
				({
					"cursor":"pointer",
					"display":"table"
				});
				//建立 Radio_Div Focus
				$('#' + ID + "_1_Div").click(function()
				{
					$('#' + ID + "_Label").css("color","rgb(69,200,200)");
					document.getElementById(ID + "_1").checked = true;
					$('#' + this.id).css("color","rgb(69,200,200)");
					$('#' + this.id).next().next().css("color","rgb(69,60,60)");
				});
				//建立 Radio_Div Focus
				$('#' + ID + "_2_Div").click(function()
				{
					$('#' + ID + "_Label").css("color","rgb(69,200,200)");
					document.getElementById(ID + "_2").checked = true;
					$('#' + this.id).css("color","rgb(69,200,200)");
					$('#' + this.id).prev().prev().css("color","rgb(69,60,60)");
				});
				//建立 Radio Focus
				$('input[type=radio][name=' + Radio_Name + ']').change(function()
				{
			        $("#" + this.id).next().click();
			    });
			}
			//新增 Window Combobox
			Window.addCombobox = function(ID,Label)
			{
				var This_ID = this.getId();
				//建立 Window Combobox 群組 Div
				$('#' + This_ID + "_Body").append("<div id='" + ID + "_Group'></div>");
				//建立 Window Combobox label
				$('#' + ID + "_Group").append("<div class='Font translateHtml' id='" + ID + "_Label'>" + Label + "</div>");
				//建立 Window Combobox text
				$('#' + ID + "_Group").append("<select class='Font Window_Textfield' id='" + ID + "'></select>");
				//Group Css
				$('#' + ID + "_Group").css
				({
					"margin-top":"15px"
				});
				//label Css
				$('#' + ID + "_Label").css
				({
					"float":"left",
					"width":"95px"
				});
				//Combobox Css
				$('#' + ID).css
				({
					"width":"calc(100% - 100px)",
					"border":"0px",
					"border-bottom":"rgb(152,152,152) 1px solid",
					"margin-top":"-1px",
			        "-webkit-appearance":"none",
    				"border-radius":"0px",
    				"background-color":"white",
    				"font-size":"13pt"
				});
				//建立 Combobox Focus
				$('#' + ID).focus(function()
				{
					$('#' + this.id).css("border-bottom","rgb(69,200,200) 1px solid");
					$('#' + this.id).prev().css("color","rgb(69,200,200)");
				});
				//建立 Combobox Blur
				$('#' + ID).blur(function()
				{
					$('#' + this.id).css("border-bottom","rgb(152,152,152) 1px solid");
					$('#' + this.id).prev().css("color","rgb(60,60,60)");
				});
			}
			//新增 Window Combobox 使用的話 Window 寬度建議大於 480px
			Window.addComboboxPagging = function(ID,Label,Pagging_Parameter) //Pagging_Parameter .Url .rootProperty .displayField 
			{																 //.valueField .pageSize .searchUrl .searchPlaceholder .searchKey
				//宣告物件編號
				var _Pagging = {"ID":ID};
				var _Pagging_Object = {};
				//新增函數
				new function()
				{
					//取得選擇值
					_Pagging_Object.getComboboxPagging_Value = function(field)
					{
						var _field = '';
						if(field == 'displayField' || field == 'displayfield')
						{
							_field = '_displayField';
						}
						else if(field == 'valueField' || field == 'valuefield')
						{
							_field = '_valueField';
						}
						else
						{
							_field = '_valueField';
						}
						return $("#" + ID + _field).html();
					}
					//設定選擇值
					_Pagging_Object.setComboboxPagging_Value = function(value)
					{
						//代表有找到
						if(findHtml(value,$('#' + ID).parent()).length == 1)
						{
							var valueField_ID = findHtml(value,$('#' + ID).parent())[0].id;
							var displayField_ID = valueField_ID.replace(/_valueField/,"")
							//設定對應值
							$("#" + ID).val($("#" + displayField_ID).html());
							//清空 callback
							Window[_Pagging.ID].ComboboxPagging_callBack = null;
							//設定選擇的 displayField valueField
							$('#' + ID + '_displayField').html($('#' + displayField_ID).html());
							$('#' + ID + '_valueField').html($('#' + valueField_ID).html());
						}
						else
						{
							//如果還沒到最後一頁 就一直跳下一頁尋找
							if(Window[_Pagging.ID].ComboboxPagging_getPage() != Window[_Pagging.ID].ComboboxPagging_getTotalpage())
							{
								//下一頁
								Window[_Pagging.ID].ComboboxPagging_nextPage();
								//load callback
								Window[_Pagging.ID].ComboboxPagging_callBack = function()
								{
									//再找一次
									Window[_Pagging.ID].setComboboxPagging_Value(value);	
								};
							}
							//找完了都沒找到 直接設定值
							else
							{
								//清空 callback
								Window[_Pagging.ID].ComboboxPagging_callBack = null;
								//設定對應值
								$("#" + ID).val(value);
								//停止
								return;
							}
						}
						//在指定的物件裡尋找 innerHTML
						function findHtml(search, element)
						{
						    var d, e, ef;
						    e = [];
						    ef = [];

						    if(element)
						    {
						        d = $(":contains(\""+ search + "\"):not(script)", element);
						    }
						    else
						    {
						        d = $(":contains(\""+ search + "\"):not(script)");
						    }

						    if(d.length == 1)
						    {
						        e.push(d[0]);
						    }
						    else
						    {
						        d.each(function()
						        {
						            var i, r = findHtml(search, this);
						            if(r.length === 0)
						            {
						                e.push(this);
						            }
						            else
						            {
						                for(i = 0; i < r.length; ++i)
						                {
						                    e.push(r[i]);
						                }
						            }
						        });
						    }
						    $.each(e, function()
						    {
						        for(var i = 0; i < ef.length; ++i)
						        {
						            if(this === ef[i]) return;
						        }
						        ef.push(this);
						    });
						    return ef;
						}
					}
					//定義一次資料顯示筆數
					_Pagging_Object.ComboboxPagging_getPagesize = function()
					{
						return Window[_Pagging.ID].ComboboxPagging_Pagesize;
					}
					_Pagging_Object.ComboboxPagging_setPagesize = function(Pagesize)
					{
						//定義標題內容
						Window[_Pagging.ID].ComboboxPagging_Pagesize = Pagesize;
					}
					//定義資料內容
					_Pagging_Object.ComboboxPagging_getData = function()
					{
						return Window[_Pagging.ID].ComboboxPagging_Data;
					}
					_Pagging_Object.ComboboxPagging_setData = function(Data)
					{
						//定義標題內容
						Window[_Pagging.ID].ComboboxPagging_Data = Data;
					}
					//定義搜尋起始值
					_Pagging_Object.ComboboxPagging_getStart = function()
					{
						return (Window[_Pagging.ID].ComboboxPagging_Start)?Window[_Pagging.ID].ComboboxPagging_Start:0;
					}
					_Pagging_Object.ComboboxPagging_setStart = function(Start)
					{
						//定義標題內容
						Window[_Pagging.ID].ComboboxPagging_Start = Start;
					}
					//定義搜尋起始值
					_Pagging_Object.ComboboxPagging_getPage = function()
					{
						return (Window[_Pagging.ID].ComboboxPagging_Page)?Window[_Pagging.ID].ComboboxPagging_Page:1;
					}
					_Pagging_Object.ComboboxPagging_setPage = function(Page)
					{
						//定義標題內容
						Window[_Pagging.ID].ComboboxPagging_Page = Page;
						//重設 Start
						var currentPage = Window[_Pagging.ID].ComboboxPagging_getPage() - 1;
						var pageSize = Window[_Pagging.ID].ComboboxPagging_getPagesize();
						Window[_Pagging.ID].ComboboxPagging_Start = currentPage * pageSize;
					}
					//定義搜尋起始值
					_Pagging_Object.ComboboxPagging_getTotalpage = function()
					{
						return (Window[_Pagging.ID].ComboboxPagging_Totalpage)?Window[_Pagging.ID].ComboboxPagging_Totalpage:0;
					}
					_Pagging_Object.ComboboxPagging_setTotalpage = function(Totalpage)
					{
						//定義標題內容
						Window[_Pagging.ID].ComboboxPagging_Totalpage = Totalpage;
					}
					//第一頁
					_Pagging_Object.ComboboxPagging_firstPage = function()
					{
						//如果不是第一頁
						if(Window[_Pagging.ID].ComboboxPagging_getPage() != 1)
						{
							Window[_Pagging.ID].ComboboxPagging_setPage(1);
							Window[_Pagging.ID].ComboboxPagging_load();
						}
					}
					//上一頁
					_Pagging_Object.ComboboxPagging_prevPage = function()
					{
						//如果總頁數大於零 且 目前頁數沒有比總頁數還要大
						if(Window[_Pagging.ID].ComboboxPagging_getPage() > 1)
						{
							Window[_Pagging.ID].ComboboxPagging_setPage(Window[_Pagging.ID].ComboboxPagging_getPage() - 1);
							Window[_Pagging.ID].ComboboxPagging_load();
						}
					}
					//下一頁
					_Pagging_Object.ComboboxPagging_nextPage = function()
					{
						//如果總頁數大於零 且 目前頁數沒有比總頁數還要大
						if(Window[_Pagging.ID].ComboboxPagging_getTotalpage() != 0 && Window[_Pagging.ID].ComboboxPagging_getPage() < Window[_Pagging.ID].ComboboxPagging_getTotalpage())
						{
							Window[_Pagging.ID].ComboboxPagging_setPage(Window[_Pagging.ID].ComboboxPagging_getPage() + 1);
							Window[_Pagging.ID].ComboboxPagging_load();
						}
					}
					//最後一頁
					_Pagging_Object.ComboboxPagging_lastPage = function()
					{
						//如果不是最後一頁
						if(Window[_Pagging.ID].ComboboxPagging_getPage() != Window[_Pagging.ID].ComboboxPagging_getTotalpage())
						{
							Window[_Pagging.ID].ComboboxPagging_setPage(Window[_Pagging.ID].ComboboxPagging_getTotalpage());
							Window[_Pagging.ID].ComboboxPagging_load();
						}
					}
					//設定下拉式選單值
					_Pagging_Object.ComboboxPagging_load = function()
					{
						var newUrl = '';
						var isSearch = false;
						var oldSearchKey = '';
						//改變 searchUrl or Url
						if($("#" + ID + '_Combobox_Pagging_Top_Input').val().length != 0)
						{
							newUrl = Pagging_Parameter.searchUrl + "&" + Pagging_Parameter.searchKey + "=" + $('#' + ID + '_Combobox_Pagging_Top_Input').val() + "&start=" + Window[_Pagging.ID].ComboboxPagging_getStart() + "&limit=" + Window[_Pagging.ID].ComboboxPagging_getPagesize();
							oldSearchKey = $('#' + ID + '_Combobox_Pagging_Top_Input').val();
							isSearch = true;
						}
						else
						{
							newUrl = Pagging_Parameter.Url + "&start=" + Window[_Pagging.ID].ComboboxPagging_getStart() + "&limit=" + Window[_Pagging.ID].ComboboxPagging_getPagesize();
						}
						//清空下拉式選單
						$('#' + ID + '_Combobox_Pagging').empty();
						//建立 Pagging
						createPagging();
						//建立 Search bar
						createSearchbar();
						//如果是做搜尋則回復搜尋值
						if(isSearch)
						{
							//回復原始狀態
							$('#' + ID + '_Combobox_Pagging_Top_Input').val(oldSearchKey);
							$('#' + ID + '_Combobox_Pagging_Top_Input').removeAttr('name');;
						}
						//聚焦搜尋列
						$('#' + ID + '_Combobox_Pagging_Top_Input').focus();
						//顯示 Loading
						loadingMask = Loading_Mask.Initialize();
						loadingMask.setTarget(ID + '_Combobox_Pagging');
						if($("#" + ID + '_Combobox_Pagging').css('display') != 'none')
						{
							loadingMask.show();
						}
						//讀取下拉式選單資料
						jqueryAjax_Get(newUrl,function(result)
						{
							loadingMask.close();
							//20160215 應對回傳資訊有可能非陣列 進行更新
							if(result[Pagging_Parameter.rootProperty].length)
							{
								data = result[Pagging_Parameter.rootProperty];
							}
							else
							{
								var data_array = [];
								data_array[0] = result[Pagging_Parameter.rootProperty];
								data = data_array;
							}
							//data = result[Pagging_Parameter.rootProperty]
							//20160215 應對回傳資訊有可能非陣列 進行更新
							Window[_Pagging.ID].ComboboxPagging_setData(data);
							for(var i = 0; i < data.length; i++)
							{
								//創造下拉式選單
								$('#' + ID + '_Combobox_Pagging').append("<div id='" + ID + "_Combobox_Pagging_" + i + "'></div>");
								$('#' + ID + '_Combobox_Pagging_' + i).html(data[i][Pagging_Parameter.displayField]);
								$('#' + ID + '_Combobox_Pagging_' + i).css
								({
									'width':'calc(100% - 12px)',
									'height':'32px',
									'font-size':'14pt',
									'padding':'4px 6px 4px 6px',
									'line-height':'30px',
									'cursor':'pointer'
								});
								//第一個選項 需空出搜尋方塊的空間
								if(i == 0)
								{
									$('#' + ID + '_Combobox_Pagging_' + i).css
									({
										"margin-top":"39px"
									});
								}
								$('#' + ID + '_Combobox_Pagging_' + i).mouseenter(function()
								{
									$('#' + this.id).css
									({
										'background-color':'rgb(214,232,246)',
										'border-color':'rgb(214,232,246)'
									});
								});
								$('#' + ID + '_Combobox_Pagging_' + i).mouseleave(function()
								{
									$('#' + this.id).css
									({
										'background-color':'',
										'border-color':''
									});
								});
								$('#' + ID + '_Combobox_Pagging_' + i).click(function()
								{
									//隱藏下拉式選單
									var This_ID = Window.getId();
									//主 Window Css 修改
									$('#' + This_ID).css
									({
										"overflow":"auto"
									});
									//隱藏下拉式選單
									$('#' + ID + '_Combobox_Pagging').css
									({
										"display":"none"
									});
									$('#' + ID).css("border-bottom","rgb(152,152,152) 1px solid");
									$('#' + ID).prev().css("color","rgb(60,60,60)");
									//設定選擇值到 Input 內
									$('#' + ID).val($('#' + this.id).html());
									//下拉式選單數量
									var pageSize = Window[_Pagging.ID].ComboboxPagging_getPagesize();
									//設定選擇的 displayField valueField
									$('#' + ID + '_displayField').html($('#' + this.id).html());
									$('#' + ID + '_valueField').html($('#' + this.id + '_valueField').html());
								});
								//下拉式選單實值內容
								$('#' + ID + '_Combobox_Pagging').append("<div id='" + ID + "_Combobox_Pagging_" + i + "_valueField'></div>");
								$('#' + ID + '_Combobox_Pagging_' + i + '_valueField').html(data[i][Pagging_Parameter.valueField]);
								$('#' + ID + '_Combobox_Pagging_' + i + '_valueField').css
								({
									'width':'calc(100% - 12px)',
									'height':'32px',
									'font-size':'14pt',
									'padding':'4px 6px 4px 6px',
									'line-height':'30px',
									'cursor':'pointer',
									'display':'none'
								});
								//callback
								if(i == data.length - 1)
								{
									//如果有 callback
									if(Window[_Pagging.ID].ComboboxPagging_callBack != null)
									{
										Window[_Pagging.ID].ComboboxPagging_callBack();
									}
								}
							};
							//如果沒有資料
							if(data.length == 0)
							{
								//設定從第幾筆開始
								$('#' + ID + '_Combobox_Pagging_Bottom_Record_1').html(0);
								//設定單頁總共幾筆
								$('#' + ID + '_Combobox_Pagging_Bottom_Record_3').html(0);
								//設定總筆數
								$('#' + ID + '_Combobox_Pagging_Bottom_Record_5').html(0);
							}
							else
							{
								//設定總頁數
								var totalPage = (Math.ceil(parseInt(result.maxCount) / parseInt(Window[_Pagging.ID].ComboboxPagging_getPagesize()))?Math.ceil(parseInt(result.maxCount) / parseInt(Window[_Pagging.ID].ComboboxPagging_getPagesize())):1);
								Window[_Pagging.ID].ComboboxPagging_setTotalpage(totalPage);
								//設定從第幾筆開始
								var currentPage = Window[_Pagging.ID].ComboboxPagging_getPage() - 1;
								var pageSize = Window[_Pagging.ID].ComboboxPagging_getPagesize();
								var startCount = 1 + (currentPage * pageSize);
								$('#' + ID + '_Combobox_Pagging_Bottom_Record_1').html(startCount);
								//設定單頁總共幾筆
								var endCount = data.length + (Window[_Pagging.ID].ComboboxPagging_getPage() - 1) * (Window[_Pagging.ID].ComboboxPagging_getPagesize());
								$('#' + ID + '_Combobox_Pagging_Bottom_Record_3').html(endCount);
								//設定總筆數
								var totalCount = (result.maxCount)?result.maxCount:result.count;
								$('#' + ID + '_Combobox_Pagging_Bottom_Record_5').html(totalCount);
							}
							//恢復
							for(var i = 0; i < Window[_Pagging.ID].ComboboxPagging_getPagesize(); i++)
							{
								$("#" + ID + "_Combobox_Pagging_" + i).css("display","block");
							};
							//如果資料筆數小於 pageSize 則需要刪減列
							if(data.length != Window[_Pagging.ID].ComboboxPagging_getPagesize())
							{
								//刪除多餘筆數
								for(var k = Window[_Pagging.ID].ComboboxPagging_getPagesize() - 1; k >= data.length; k--)
								{
									$("#" + ID + "_Combobox_Pagging_" + k).css("display","none");
								};
							}
							//重設高度
							$('#' + ID + '_Combobox_Pagging').css("height",((parseInt(data.length) + 2) * 40 - 1) + "px");
						},function()
						{
							loadingMask.close();
							var needRemove_Count = Window[_Pagging.ID].ComboboxPagging_getPagesize();
							//刪除多餘筆數
							for(var k = needRemove_Count; k >= 0; k--)
							{
								$("#" + ID + "_Combobox_Pagging_" + k).css("display","none");
							};
							//重設高度
							$('#' + ID + '_Combobox_Pagging').css("height",(40 * 2 - 1) + "px");
							//設定從第幾筆開始
							$('#' + ID + '_Combobox_Pagging_Bottom_Record_1').html(0);
							//設定單頁總共幾筆
							$('#' + ID + '_Combobox_Pagging_Bottom_Record_3').html(0);
							//設定總筆數
							$('#' + ID + '_Combobox_Pagging_Bottom_Record_5').html(0);
						},function()
						{
							loadingMask.close();
							var needRemove_Count = Window[_Pagging.ID].ComboboxPagging_getPagesize();
							//刪除多餘筆數
							for(var k = needRemove_Count; k >= 0; k--)
							{
								$("#" + ID + "_Combobox_Pagging_" + k).css("display","none");
							};
							//重設高度
							$('#' + ID + '_Combobox_Pagging').css("height",(40 * 2 - 1) + "px");
							//設定從第幾筆開始
							$('#' + ID + '_Combobox_Pagging_Bottom_Record_1').html(0);
							//設定單頁總共幾筆
							$('#' + ID + '_Combobox_Pagging_Bottom_Record_3').html(0);
							//設定總筆數
							$('#' + ID + '_Combobox_Pagging_Bottom_Record_5').html(0);
						});
					}
					//回傳物件
					Window[_Pagging.ID] = _Pagging_Object;
				};
				//設定下拉式選單數量
				Window[_Pagging.ID].ComboboxPagging_setPagesize(Pagging_Parameter.pageSize);
				//產生下拉式選單
				new function()
				{
					var This_ID = Window.getId();
					//建立 Window Textfield 群組 Div
					$('#' + This_ID + "_Body").append("<div id='" + ID + "_Group'></div>");
					//建立 Window Textfield label
					$('#' + ID + "_Group").append("<div class='Font translateHtml' id='" + ID + "_Label'>" + Label + "</div>");
					//建立 Window Textfield text
					$('#' + ID + "_Group").append("<input class='Font Window_Textfield' id='" + ID + "' type='text'></input>");
					//Group Css
					$('#' + ID + "_Group").css
					({
						"margin-top":"15px"
					});
					//label Css
					$('#' + ID + "_Label").css
					({
						"float":"left",
						"width":"95px"
					});
					//Textfield Css
					$('#' + ID).css
					({
						"width":"calc(100% - 100px)",
						"border":"0px",
						"border-bottom":"rgb(152,152,152) 1px solid"
					});
					//建立 Textfield Focus
					$('#' + ID).focus(function()
					{
						$('#' + this.id).css("border-bottom","rgb(69,200,200) 1px solid");
						$('#' + this.id).prev().css("color","rgb(69,200,200)");
						//展開下拉式選單
						var This_ID = Window.getId();
						//主 Window Css 修改 改這個會讓主window破相
						// $('#' + This_ID).css
						// ({
						// 	"overflow":""
						// });
						//顯示下拉式選單
						$('#' + ID + '_Combobox_Pagging').css
						({
							"display":"block"
						});
					});
					//建立 Textfield Blur
					$('#' + ID).blur(function()
					{
						//如果滑鼠不在分頁功能按鈕的地方
						if((!$('#' + ID + '_Combobox_Pagging_Bottom').is(':hover')) && (!$('#' + ID + '_Combobox_Pagging').is(':hover')))
						{
							//隱藏下拉式選單
							var This_ID = Window.getId();
							//主 Window Css 修改
							$('#' + This_ID).css
							({
								"overflow":"auto"
							});
							//隱藏下拉式選單
							$('#' + ID + '_Combobox_Pagging').css
							({
								"display":"none"
							});
							$('#' + this.id).css("border-bottom","rgb(152,152,152) 1px solid");
							$('#' + this.id).prev().css("color","rgb(60,60,60)");
						}
						else
						{
							$('#' + this.id).css("border-bottom","rgb(69,200,200) 1px solid");
							$('#' + this.id).prev().css("color","rgb(69,200,200)");
						}
					});
					//下拉式選單分頁
					$('#' + ID + "_Group").append("<div id='" + ID + "_Combobox_Pagging'></div>");
					//套用對應 domID 位置及長寬
					$('#' + ID + '_Combobox_Pagging').css
					({
						'left':($('#' + ID).size() != 0)?$('#' + ID).position().left:$('.' + ID).position().left,
						'top':(($('#' + ID).size() != 0)?$('#' + ID).position().top:$('.' + ID).position().top) + (($('#' + ID).size() != 0)?$('#' + ID).height():$('.' + ID).height()) + 3,
						'position':'absolute',
						'height':((parseInt(Pagging_Parameter.pageSize) + 2) * 40 - 1) + "px",
						'width':($('#' + ID).size() != 0)?$('#' + ID).width():$('.' + ID).width(),
						'z-index':'99',
						'opacity':'1',
						"background-color":"rgb(255,255,255)",
					    "box-shadow":"rgb(136, 136, 136) 0px 0px 10px",
					    "margin":($('#' + ID).size() != 0)?$('#' + ID).css('margin'):$('.' + ID).css('margin'),
					    "border":($('#' + ID).size() != 0)?$('#' + ID).css('border'):$('.' + ID).css('border'),
					    "padding":($('#' + ID).size() != 0)?$('#' + ID).css('padding'):$('.' + ID).css('padding'),
					    "border-radius":($('#' + ID).size() != 0)?$('#' + ID).css('border-radius'):$('.' + ID).css('border-radius'),
					    "display":"none",
					    "border-radius":"4px"
					});
					// if($("body").height() < ((($('#' + ID).size() != 0)?$('#' + ID).position().top:$('.' + ID).position().top) + (($('#' + ID).size() != 0)?$('#' + ID).height():$('.' + ID).height()) + 3) + $('#' + ID + '_Combobox_Pagging').height() + $('#' + ID + '_Combobox_Pagging').parent().parent().parent().position().top)
					// {
					// 	var topDiff =  ((($('#' + ID).size() != 0)?$('#' + ID).position().top:$('.' + ID).position().top) + (($('#' + ID).size() != 0)?$('#' + ID).height():$('.' + ID).height()) + 3) + $('#' + ID + '_Combobox_Pagging').height() + $('#' + ID + '_Combobox_Pagging').parent().parent().parent().position().top - $("body").height();
					// 	$('#' + ID + '_Combobox_Pagging').css('top',topDiff);
					// }
					//新增隱藏式 displayField valueField
					$('#' + ID + "_Group").append("<div class='Font Window_Textfield' id='" + ID + "_displayField' type='text' style='display:none;'></div>");
					$('#' + ID + "_Group").append("<div class='Font Window_Textfield' id='" + ID + "_valueField' type='text' style='display:none;'></div>");
				};
				//下拉式選單內容
				new function()
				{
					//如果有網址才載入
					if(Pagging_Parameter.Url)
					{
						//讀取下拉式選單資料
						jqueryAjax_Get(Pagging_Parameter.Url + "&start=" + Window[_Pagging.ID].ComboboxPagging_getStart() + "&limit=" + Window[_Pagging.ID].ComboboxPagging_getPagesize(),function(result)
						{
							var data = result[Pagging_Parameter.rootProperty];
							Window[_Pagging.ID].ComboboxPagging_setData(data);
							for(var i = 0; i < data.length; i++)
							{
								//下拉式選單顯示內容
								$('#' + ID + '_Combobox_Pagging').append("<div id='" + ID + "_Combobox_Pagging_" + i + "'></div>");
								$('#' + ID + '_Combobox_Pagging_' + i).html(data[i][Pagging_Parameter.displayField]);
								$('#' + ID + '_Combobox_Pagging_' + i).css
								({
									'width':'calc(100% - 12px)',
									'height':'32px',
									'font-size':'14pt',
									'padding':'4px 6px 4px 6px',
									'line-height':'30px',
									'cursor':'pointer'
								});
								//第一個選項 需空出搜尋方塊的空間
								if(i == 0)
								{
									$('#' + ID + '_Combobox_Pagging_' + i).css
									({
										"margin-top":"39px"
									});
								}
								$('#' + ID + '_Combobox_Pagging_' + i).mouseenter(function()
								{
									$('#' + this.id).css
									({
										'background-color':'rgb(214,232,246)',
										'border-color':'rgb(214,232,246)'
									});
								});
								$('#' + ID + '_Combobox_Pagging_' + i).mouseleave(function()
								{
									$('#' + this.id).css
									({
										'background-color':'',
										'border-color':''
									});
								});
								$('#' + ID + '_Combobox_Pagging_' + i).click(function()
								{
									//隱藏下拉式選單
									var This_ID = Window.getId();
									//主 Window Css 修改
									$('#' + This_ID).css
									({
										"overflow":"auto"
									});
									//隱藏下拉式選單
									$('#' + ID + '_Combobox_Pagging').css
									({
										"display":"none"
									});
									$('#' + ID).css("border-bottom","rgb(152,152,152) 1px solid");
									$('#' + ID).prev().css("color","rgb(60,60,60)");
									//設定選擇值到 Input 內
									$('#' + ID).val($('#' + this.id).html());
									//下拉式選單數量
									var pageSize = Window[_Pagging.ID].ComboboxPagging_getPagesize();
									//設定選擇的 displayField valueField
									$('#' + ID + '_displayField').html($('#' + this.id).html());
									$('#' + ID + '_valueField').html($('#' + this.id + '_valueField').html());
								});
								//下拉式選單實值內容
								$('#' + ID + '_Combobox_Pagging').append("<div id='" + ID + "_Combobox_Pagging_" + i + "_valueField'></div>");
								$('#' + ID + '_Combobox_Pagging_' + i + '_valueField').html(data[i][Pagging_Parameter.valueField]);
								$('#' + ID + '_Combobox_Pagging_' + i + '_valueField').css
								({
									'width':'calc(100% - 12px)',
									'height':'32px',
									'font-size':'14pt',
									'padding':'4px 6px 4px 6px',
									'line-height':'30px',
									'cursor':'pointer',
									'display':'none'
								});
							};
							//如果沒有資料
							if(data.length == 0)
							{
								//設定從第幾筆開始
								$('#' + ID + '_Combobox_Pagging_Bottom_Record_1').html(0);
								//設定單頁總共幾筆
								$('#' + ID + '_Combobox_Pagging_Bottom_Record_3').html(0);
								//設定總筆數
								$('#' + ID + '_Combobox_Pagging_Bottom_Record_5').html(0);
							}
							else
							{
								//設定總頁數
								var totalPage = Math.ceil(parseInt(result.maxCount) / parseInt(Window[_Pagging.ID].ComboboxPagging_getPagesize()));
								Window[_Pagging.ID].ComboboxPagging_setTotalpage(totalPage);
								//設定從第幾筆開始
								var currentPage = Window[_Pagging.ID].ComboboxPagging_getPage() - 1;
								var pageSize = Window[_Pagging.ID].ComboboxPagging_getPagesize();
								var startCount = 1 + (currentPage * pageSize);
								$('#' + ID + '_Combobox_Pagging_Bottom_Record_1').html(startCount);
								//設定單頁總共幾筆
								var endCount = data.length + (Window[_Pagging.ID].ComboboxPagging_getPage() - 1) * (Window[_Pagging.ID].ComboboxPagging_getPagesize());
								$('#' + ID + '_Combobox_Pagging_Bottom_Record_3').html(endCount);
								//設定總筆數
								var totalCount = result.maxCount;
								$('#' + ID + '_Combobox_Pagging_Bottom_Record_5').html(totalCount);
							}
						},function()
						{
							loadingMask.close();
						},function()
						{
							loadingMask.close();
						});
					}
					//預設無資料高度
					else
					{
						//重設高度
						$('#' + ID + '_Combobox_Pagging').css("height",(2 * 40 - 1) + "px");
					}
				};
				//建立 Pagging
				createPagging();
				function createPagging()
				{
					//建立 Pagging
					var Pagging = ID + '_Combobox_Pagging_Bottom';
					//建立 Pagging 內容
					$('#' + ID + '_Combobox_Pagging').append("<div id='" + Pagging + "' class='Mainpage_Main_Pagging'></div>");
					$('#' + Pagging).click(function()
					{
						$('#' + ID).focus();
					});
					$('#' + Pagging).css
					({
						"border-radius":"4px",
						"position":"absolute"
					});
					$('#' + Pagging).append("<div id='" + Pagging + "_First_Page' class='First_Page'></div>");
					$('#' + Pagging).append("<div id='" + Pagging + "_Previous_Page' class='Previous_Page'></div>");
					$('#' + Pagging).append("<div class='Separator'></div>");
					$('#' + Pagging).append("<div id='" + Pagging + "_Record_0' style='height:16px;width:53px;margin:15px 0 0 9px;float:left;' class='translateHtml'>紀錄 : 從</div>");
					$('#' + Pagging).append("<div id='" + Pagging + "_Record_1' style='height:16px;width:20px;margin:15px 0 0 0;text-align:center;float:left;'>0</div>");
					$('#' + Pagging).append("<div id='" + Pagging + "_Record_2' style='height:16px;width:7px;margin:15px 0 0 0;text-align:center;float:left;'> - </div>");
					$('#' + Pagging).append("<div id='" + Pagging + "_Record_3' style='height:16px;width:20px;float:left;margin:15px 0 0 0;text-align:center;'>0</div>");
					$('#' + Pagging).append("<div id='" + Pagging + "_Record_4' style='height:16px;width:20px;margin:15px 0 0 0;text-align:center;float:left;' class='translateHtml'>共</div>");
					$('#' + Pagging).append("<div id='" + Pagging + "_Record_5' style='height:16px;width:20px;margin:15px 0 0 0;text-align:center;float:left;'>0</div>");
					$('#' + Pagging).append("<div id='" + Pagging + "_Record_6' style='height:16px;width:20px;margin:15px 0 0 0;text-align:center;float:left;' class='translateHtml'>筆</div>");
					$('#' + Pagging).append("<div class='Separator'></div>");
					$('#' + Pagging).append("<div id='" + Pagging + "_Next_Page' class='Next_Page'></div>");
					$('#' + Pagging).append("<div id='" + Pagging + "_Last_Page' class='Last_Page'></div>");
					$('#' + Pagging).append("<div class='Separator'></div>");
					$('#' + Pagging).append("<div id='" + Pagging + "_Refresh_Page' class='Refresh_Page'></div>");
					//第一頁
					$('#' + Pagging + '_First_Page').click(function()
					{
						Window[_Pagging.ID].ComboboxPagging_firstPage();
					});
					//上一頁
					$('#' + Pagging + '_Previous_Page').click(function()
					{
						Window[_Pagging.ID].ComboboxPagging_prevPage();
					});
					//下一頁
					$('#' + Pagging + '_Next_Page').click(function()
					{
						Window[_Pagging.ID].ComboboxPagging_nextPage();
					});
					//最後一頁
					$('#' + Pagging + '_Last_Page').click(function()
					{
						Window[_Pagging.ID].ComboboxPagging_lastPage();
					});
					//重整按鈕
					$('#' + Pagging + '_Refresh_Page').click(function()
					{
						Window[_Pagging.ID].ComboboxPagging_load();
					});
				};
				//建立 Search bar
				createSearchbar();
				function createSearchbar()
				{
					//建立 Pagging
					var Pagging = ID + '_Combobox_Pagging_Top';
					//建立 Pagging 內容
					$('#' + ID + '_Combobox_Pagging').append("<div id='" + Pagging + "'></div>");
					//Css
					$('#' + Pagging).css
					({
						"top":"0px",
						"width":"100%",
						"height":"40px",
						//"background-color":"rgb(236,236,236)",
						"border-radius":"4px",
						"position":"absolute"
					});
					//建立 Window Textfield 群組 Div
					$('#' + Pagging).append("<div id='" + Pagging + "_Group'></div>");
					//建立 Window Textfield label
					$('#' + Pagging + "_Group").append("<div class='Font' id='" + Pagging + "_Label'>" + Label + "</div>");
					//建立 Window Textfield text
					$('#' + Pagging + "_Group").append("<input name='reload' class='Font Window_Textfield translatePlaceholder' id='" + Pagging + "_Input' type='text' placeholder='" + Pagging_Parameter.searchPlaceholder + "'></input>");
					//Group Css
					$('#' + Pagging + "_Group").css
					({
						"margin-top":"11px",
					    "text-align":"center"
					});
					//label Css
					$('#' + Pagging + "_Label").css
					({
						"float":"left",
						"width":"95px",
						"display":"none"
					});
					//Textfield Css
					$('#' + Pagging + "_Input").css
					({
						"width":"calc(100% - 100px)",
						"border":"0px",
						"border-bottom":"rgb(152,152,152) 1px solid",
						"margin":"0 auto",
					    "text-align":"center"
					});
					//建立 Textfield Focus
					$('#' + Pagging + "_Input").focus(function()
					{
						$('#' + this.id).css("border-bottom","rgb(69,200,200) 1px solid");
						$('#' + this.id).prev().css("color","rgb(69,200,200)");
					});
					//建立 Textfield Blur
					$('#' + Pagging + "_Input").blur(function()
					{
						//如果滑鼠不在分頁功能按鈕的地方
						if((!$('#' + ID + '_Combobox_Pagging_Bottom').is(':hover')) && (!$('#' + ID + '_Combobox_Pagging').is(':hover')))
						{
							//隱藏下拉式選單
							var This_ID = Window.getId();
							//主 Window Css 修改
							$('#' + This_ID).css
							({
								"overflow":"auto"
							});
							//隱藏下拉式選單
							$('#' + ID + '_Combobox_Pagging').css
							({
								"display":"none"
							});
							$('#' + ID).css("border-bottom","rgb(152,152,152) 1px solid");
							$('#' + ID).prev().css("color","rgb(60,60,60)");
						}
						$('#' + this.id).css("border-bottom","rgb(152,152,152) 1px solid");
						$('#' + this.id).prev().css("color","rgb(60,60,60)");
					});
					//建立 Textfield keyup
					$('#' + Pagging + "_Input").keyup(function(e)
					{
						//Enter 且 文字方塊有文字
						if(e.keyCode == 13 && $('#' + this.id).val().length != 0)
						{
							$('#' + this.id).removeAttr('name');
							Window[_Pagging.ID].ComboboxPagging_setPage(1);
							Window[_Pagging.ID].ComboboxPagging_load();
						}
						else if((e.keyCode == 8 || e.keyCode == 46) && $('#' + this.id).val().length == 0 && $('#' + this.id).attr('name') != 'reload')
						{
							$('#' + this.id).attr('name','reload');
							Window[_Pagging.ID].ComboboxPagging_setPage(1);
							Window[_Pagging.ID].ComboboxPagging_load();
						}
					});
				};
			}
			//新增 Window Textarea
			Window.addTextarea = function(ID,Label)
			{
				var This_ID = this.getId();
				//建立 Window Combobox 群組 Div
				$('#' + This_ID + "_Body").append("<div id='" + ID + "_Group'></div>");
				//建立 Window Combobox label
				$('#' + ID + "_Group").append("<div class='Font translateHtml' id='" + ID + "_Label'>" + Label + "</div>");
				//建立 Window Combobox text
				$('#' + ID + "_Group").append("<textarea class='Font Window_Textfield' id='" + ID + "'></textarea>");
				//Group Css
				$('#' + ID + "_Group").css
				({
					"margin-top":"15px"
				});
				//label Css
				$('#' + ID + "_Label").css
				({
					"float":"left",
					"width":"95px"
				});
				//Textarea Css
				$('#' + ID).css
				({
					"width":"calc(100% - 100px)",
					"border":"0px",
					"border-bottom":"rgb(152,152,152) 1px solid",
					"margin-top":"-1px",
			        "-webkit-appearance":"none",
    				"border-radius":"0px",
    				"background-color":"white",
				    "font-family":"Arial",
    				"resize":"none",
    				"height":"50px"
				});
				//建立 Combobox Focus
				$('#' + ID).focus(function()
				{
					$('#' + this.id).css("border-bottom","rgb(69,200,200) 1px solid");
					$('#' + this.id).prev().css("color","rgb(69,200,200)");
					//Textare 不適用 Enter
					//Window.endSmartdetect();
				});
				//建立 Combobox Blur
				$('#' + ID).blur(function()
				{
					$('#' + this.id).css("border-bottom","rgb(152,152,152) 1px solid");
					$('#' + this.id).prev().css("color","rgb(60,60,60)");
					//Textare 不適用 Enter
					//Window.startSmartdetect();
				});
			}
			//新增 Window DatetimeField
			Window.addDatetimeField = function(ID,Label)
			{
				var This_ID = this.getId();
				//建立 Window DatetimeField 群組 Div
				$('#' + This_ID + "_Body").append("<div id='" + ID + "_Group'></div>");
				//建立 Window DatetimeField label
				$('#' + ID + "_Group").append("<div class='Font translateHtml' id='" + ID + "_Label'>" + Label + "</div>");
				//建立 Window DatetimeField text
				$('#' + ID + "_Group").append("<input class='Font Window_Textfield' id='" + ID + "' type='text'></input>");
				//設定語言選項
				$.datetimepicker.setLocale('zh');
				//產生日期選擇
				$('#' + ID).datetimepicker();
				//Group Css
				$('#' + ID + "_Group").css
				({
					"margin-top":"15px"
				});
				//label Css
				$('#' + ID + "_Label").css
				({
					"float":"left",
					"width":"95px"
				});
				//DatetimeField Css
				$('#' + ID).css
				({
					"width":"calc(100% - 100px)",
					"border":"0px",
					"border-bottom":"rgb(152,152,152) 1px solid",
					"margin-top":"0px",
					"padding":"0px"
				});
				//建立 Focus Focus
				$('#' + ID).focus(function()
				{
					$('#' + this.id).css("border-bottom","rgb(69,200,200) 1px solid");
					$('#' + this.id).prev().css("color","rgb(69,200,200)");
				});
				//建立 Focus Blur
				$('#' + ID).blur(function()
				{
					$('#' + this.id).css("border-bottom","rgb(152,152,152) 1px solid");
					$('#' + this.id).prev().css("color","rgb(60,60,60)");
				});
			}
			//新增 Window YesNo Button
			Window.addYesNO_Button = function(No_Text,Yes_Text,No_Func,Yes_Func)
			{
				var This_ID = this.getId();
				//建立 Window YesNo Button
				$('#' + This_ID + "_Body").append
				(
					"<div style='margin-top:18px;height:40px;width:100%;padding-bottom:18px;'>" +
						"<div class='Window_Cancel translateHtml' id='" + This_ID + "_No'>" + No_Text + "</div>" +
						"<div class='Window_Yes translateHtml' id='" + This_ID + "_Yes'>" + Yes_Text + "</div>" +
					"</div>"
				);
				//No
				$('#' + This_ID + '_No').click(function()
				{
					(No_Func)?No_Func():'';
				});
				//Yes
				$('#' + This_ID + '_Yes').click(function()
				{
					(Yes_Func)?Yes_Func():'';
				});
			}
			//顯示 Window
			Window.show = function()
			{
				//建立 Window
				this.create();
				//設定物件模糊效果
				addBlur_Css("Mainpage");
			}
			//關閉 Window
			Window.close = function()
			{
				var ID = this.getId();
				//設定物件模糊效果
				removeBlur_Css("Mainpage");
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
				//移除可能出現的 loading Mask
				if($("#" + this.getId() + "_loadingMask").size() != 0)
				{
					$("#" + this.getId() + "_loadingMask").remove();
				}
			}
			//Window 大小改變方法
			Window.getResizer = function()
			{
				//確認要新增的監聽是否已經新增過 而且作業系統是 Windows 才需要因為捲軸改變大小  如果都沒有才能新增監聽
				if(jQuery.inArray(Window.getId(),Resizer_Array) == -1 && getClintOS() == 'Windows')
				{
					
				}
				//顯示的 Window ID
				var ID = Window.getId();
				var Height = (Window.getHeight())?Window.getHeight():($('#' + Window.getId()).height());
				var Width = (Window.getWidth())?Window.getWidth():($('#' + Window.getId()).width());
				//如果物建存在
				if($('#' + ID).length == 1)
				{
					if($('body').height() <= Height + 90)
					{
						$('#'+ID).css
						({
							'height':$('body').height() - 90,
							//'overflow':'auto'
						});
						$('#' + Window.getId()).center();
					}
					else
					{
						$('#'+ID).css
						({
							'height':Height,
							//'overflow':'hidden'
						});
						//重設標題寬度
						$('#'+ID+"_Title").width(Width);
						$('#' + ID).center();
					}
				}
			}
			//開始 Window 大小改變監聽
			Window.startResize = function()
			{
				$(window).resize(Window.getResizer);
				Window.getResizer();
			}
			//結束 Window 大小改變監聽
			Window.endResize = function()
			{
				$(window).off("resize", Window.getResizer);
			}
			//定義是否智慧偵測
			Window.getSmartdetect = function()
			{
				return Window.Smartdetect;
			}
			Window.setSmartdetect = function(Smartdetect)
			{
				//定義視窗寬度
				Window.Smartdetect = Smartdetect;
			}
			//Body 智慧偵測方法
			Window.getSmartdetect_Func = function(e)
			{
				var keyCode = e.keyCode;
				var This_ID = Window.getId();
				//Esc
				if(keyCode == 27)
				{
					$('#' + This_ID + '_No').click();
				}
				//Enter
				else if(keyCode == 13)
				{
					$('#' + This_ID + '_Yes').click();
				}
			}
			//新增 Window 偵測 Ese->No Enter->Yes
			Window.startSmartdetect = function()
			{
				$('body').keyup(Window.getSmartdetect_Func);
			}
			//新增 Window 偵測 Ese->No Enter->Yes
			Window.endSmartdetect = function()
			{
				$('body').off("keyup",Window.getSmartdetect_Func);
			}
			//回傳物件
			return Window;
		}
		catch(err)
		{
			if(App_Debug)
			{
				console.log(err);
			}
		}
	}
}
//定義 Loading_Mask
var Loading_Mask = 
{
	//初始化定義
	Initialize : function()
	{
		try
		{
			//主物件
			var Loading_Mask = {};
			//建立物件
			Loading_Mask.show = function()
			{
				//新增物件
				$('#' + this.getTarget()).parent().append("<div id='" + this.getTarget() + "_loadingMask'></div>");
				//套用對應 domID 位置及長寬
				$('#' + this.getTarget() + '_loadingMask').css
				({
					'left':($('#' + this.getTarget()).size() != 0)?$('#' + this.getTarget()).position().left:$('.' + this.getTarget()).position().left,
					'top':($('#' + this.getTarget()).size() != 0)?$('#' + this.getTarget()).position().top:$('.' + this.getTarget()).position().top,
					'position':'absolute',
					'height':($('#' + this.getTarget()).size() != 0)?$('#' + this.getTarget()).height():$('.' + this.getTarget()).height(),
					'width':($('#' + this.getTarget()).size() != 0)?$('#' + this.getTarget()).width():$('.' + this.getTarget()).width(),
					'z-index':'99',
					'opacity':'0.7',
					"background-color":"rgb(255,255,255)",
				    "box-shadow":"rgb(136, 136, 136) 0px 0px 10px",
				    "margin":($('#' + this.getTarget()).size() != 0)?$('#' + this.getTarget()).css('margin'):$('.' + this.getTarget()).css('margin'),
				    "border":($('#' + this.getTarget()).size() != 0)?$('#' + this.getTarget()).css('border'):$('.' + this.getTarget()).css('border'),
				    "padding":($('#' + this.getTarget()).size() != 0)?$('#' + this.getTarget()).css('padding'):$('.' + this.getTarget()).css('padding'),
				    "border-radius":($('#' + this.getTarget()).size() != 0)?$('#' + this.getTarget()).css('border-radius'):$('.' + this.getTarget()).css('border-radius')
				});
				//Loading Img
				$('#' + this.getTarget() + '_loadingMask').append("<div id='" + this.getTarget() + "_loadingMask_Img'></div>")
				$('#' + this.getTarget() + '_loadingMask_Img').css
				({
					"background":"url('image/loading.gif') no-repeat",
					"height":"48px",
					"width":"48px",
					"margin":"auto",
					"background-size":"100% 100%",
					"position":"absolute",
					"left":"0px",
					"right":"0px",
					"top":"0px",
					"bottom":"20px",
					"background-size":'100% 100%'
				});
				//Loading Text
				$('#' + this.getTarget() + '_loadingMask').append("<div id='" + this.getTarget() + "_loadingMask_Text'></div>")
				$('#' + this.getTarget() + '_loadingMask_Text').css
				({
					"width":"100px",
					"height":"0px",
					"float":"left",
					"position":"absolute",
					"left":"0px",
					"right":"0px",
					"top":"0px",
					"bottom":"20px",
					"margin":"auto",
					"padding-top":"48px",
					"padding-left":"4px",
					"text-align":"center",
					"font-size":"12pt"
				});
				$('#' + this.getTarget() + '_loadingMask_Text').html('Loading...');
				//偵測畫面大小
				this.startResize();
			}
			Loading_Mask.close = function()
			{
				$('#' + this.getTarget() + '_loadingMask').remove();
				//停止偵測畫面大小
				this.endResize();
			}
			//定義 Mask 依附物件
			Loading_Mask.getTarget = function()
			{
				return Loading_Mask.ID;
			}
			Loading_Mask.setTarget = function(ID)
			{
				//定義視窗高度
				Loading_Mask.ID = ID;
				//避免重複 清空物件
				$('#'+ID + '_loadingMask').empty();
			}
			//Loading_Mask 大小改變方法
			Loading_Mask.getResizer = function()
			{
				//套用對應 domID 位置及長寬
				$('#' + Loading_Mask.getTarget() + '_loadingMask').css
				({
					'left':($('#' + Loading_Mask.getTarget()).size() != 0)?$('#' + Loading_Mask.getTarget()).position().left:$('.' + Loading_Mask.getTarget()).position().left,
					'top':($('#' + Loading_Mask.getTarget()).size() != 0)?$('#' + Loading_Mask.getTarget()).position().top:$('.' + Loading_Mask.getTarget()).position().top,
					'position':'absolute',
					'height':($('#' + Loading_Mask.getTarget()).size() != 0)?$('#' + Loading_Mask.getTarget()).height():$('.' + Loading_Mask.getTarget()).height(),
					'width':($('#' + Loading_Mask.getTarget()).size() != 0)?$('#' + Loading_Mask.getTarget()).width():$('.' + Loading_Mask.getTarget()).width(),
					'z-index':'99',
					'opacity':'0.7',
					"background-color":"rgb(255,255,255)",
				    "box-shadow":"rgb(136, 136, 136) 0px 0px 10px",
				    "margin":($('#' + Loading_Mask.getTarget()).size() != 0)?$('#' + Loading_Mask.getTarget()).css('margin'):$('.' + Loading_Mask.getTarget()).css('margin'),
				    "border":($('#' + Loading_Mask.getTarget()).size() != 0)?$('#' + Loading_Mask.getTarget()).css('border'):$('.' + Loading_Mask.getTarget()).css('border'),
				    "padding":($('#' + Loading_Mask.getTarget()).size() != 0)?$('#' + Loading_Mask.getTarget()).css('padding'):$('.' + Loading_Mask.getTarget()).css('padding'),
				    "border-radius":($('#' + Loading_Mask.getTarget()).size() != 0)?$('#' + Loading_Mask.getTarget()).css('border-radius'):$('.' + Loading_Mask.getTarget()).css('border-radius')
				});
			}
			//開始 Loading_Mask 大小改變監聽
			Loading_Mask.startResize = function()
			{
				$(window).resize(Loading_Mask.getResizer);
				Loading_Mask.getResizer();
			}
			//結束 Loading_Mask 大小改變監聽
			Loading_Mask.endResize = function()
			{
				$(window).off("resize",Loading_Mask.getResizer);
			}
			//回傳物件
			return Loading_Mask;
		}
		catch(err)
		{
			if(App_Debug)
			{
				console.log(err);
			}
		}
	}
}
//定義 YesNo_Msg 繼承 Window
var YesNo_Msg_Define = 
{
	//初始化定義
	Initialize : function()
	{
		try
		{
			//主物件 繼承 Window
			var YesNo_Msg = Window_Define.Initialize();
			//新增 YesNo_Msg MsgContent
			YesNo_Msg.addMsgContent = function(Content)
			{
				var This_ID = this.getId();
				//建立 YesNo_Msg Textfield 群組 Div
				$('#' + This_ID + "_Body").append("<div id='" + This_ID + "_Group'></div>");
				//建立 YesNo_Msg Textfield label
				$('#' + This_ID + "_Group").append("<div class='Font translateHtml' id='" + This_ID + "_Label'>" + Content + "</div>");
				//label Css
				$('#' + This_ID + "_Label").css
				({
					"width":"100%",
				    "text-align":"center",
				    "padding-top":"15px"
				});
			}
			//回傳物件
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
}
//定義 Div Contextmenu (右鍵選單)
var Contextmenu_Define = 
{
	//初始化定義
	Initialize : function()
	{
		try
		{
			//主物件 繼承 Window
			var Contextmenu_Define = {};
			Contextmenu_Define.Menu = [];
			Contextmenu_Define.getClickedID = function()
			{
				return Contextmenu_Define.ClickedID;
			}
			Contextmenu_Define.setClickedID = function(ClickedID)
			{
				//定義視窗高度
				Contextmenu_Define.ClickedID = ClickedID;
			}
			//存取 Menu顯示文字及對應ID
			Contextmenu_Define.getMenu = function()
			{
				return Contextmenu_Define.Menu;
			}
			Contextmenu_Define.setMenu = function(Content,ID,clickFunc)
			{
				var Temp_Array = [];
				Temp_Array.Content = Content;
				Temp_Array.ID = ID;
				Temp_Array.clickFunc = clickFunc;
				Contextmenu_Define.Menu.push(Temp_Array);
			}
			//建立 Menu
			Contextmenu_Define.addMenu = function()
			{
				var This_ID = this.getId();
				for(var i=0;i<this.getMenu().length;i++)
				{
					//建立 Contextmenu_Define 
					$('#' + This_ID + "_Contextmenu").append("<div class='Contextmenu translateHtml' id='" + this.getMenu()[i].ID + "'>" + this.getMenu()[i].Content + "</div>");
					//label Css
					$('#' + this.getMenu()[i].ID).css
					({
						"width":"101%",
						"border-radius":"4px",
						"height":'25px',
						"line-height":'25px',
						"color":"rgb(60,60,60)",
						"font-family":"Verdana,Arial,sans-serif",
						"font-size":"1.1em"
					});
					//點擊事件
					$('#' + this.getMenu()[i].ID).click(this.getMenu()[i].clickFunc);
					$('#' + this.getMenu()[i].ID).css
					({
						'cursor':'pointer'
					});
				}
			}
			//建立物件
			Contextmenu_Define.show = function()
			{
				$('#' + this.getId()).bind("contextmenu",function(e)
				{
					e.preventDefault();
					//存取點選哪一列
					Contextmenu_Define.setClickedID(this.id);
					//建立右鍵選單物件
					$('#' + Contextmenu_Define.getId()).append('<div id="' + Contextmenu_Define.getId() + '_Contextmenu" tabindex="3"></div>');
					//設定 Css
					$('#' + Contextmenu_Define.getId() + '_Contextmenu').css
					({
						'left':e.pageX,
						'top':e.pageY,
						'position':'fixed',
						'height':Contextmenu_Define.getHeight(),
						'width':Contextmenu_Define.getWidth(),
						'box-shadow':'0px 0px 10px #888888',
						'background-color':'rgb(235,235,235)',
						'border-radius':'4px',
						'outline':'none',
						'z-index':10
					});
					//清空 Contextmenu_Define
					$('#' + Contextmenu_Define.getId() + "_Contextmenu").empty();
					//新增 Menu 
					Contextmenu_Define.addMenu();
					$('#' + Contextmenu_Define.getId() + '_Contextmenu').focus();
					//失去焦點則關閉
					$('#' + Contextmenu_Define.getId() + '_Contextmenu').blur(function()
					{
						Contextmenu_Define.close();
					});
					if($("body").height() - e.pageY < $("#" + Contextmenu_Define.getId() + "_Contextmenu").height())
					{
						$('#' + Contextmenu_Define.getId() + '_Contextmenu').css('top',(e.pageY - $("#" + Contextmenu_Define.getId() + "_Contextmenu").height()));
					}
					else
					{
						$('#' + Contextmenu_Define.getId() + '_Contextmenu').css('top',(e.pageY));
					}
				});
			}
			Contextmenu_Define.close = function()
			{
				$('#' + this.getId() + '_Contextmenu').remove();
			}
			//定義 Mask 依附物件
			Contextmenu_Define.getId = function()
			{
				return Contextmenu_Define.ID;
			}
			Contextmenu_Define.setId = function(ID)
			{
				//定義視窗高度
				Contextmenu_Define.ID = ID;
				//避免重複 清空物件
				$('#' + ID + '_Contextmenu').empty();
			}
			//定義 Mask 依附物件
			Contextmenu_Define.getWidth = function()
			{
				return Contextmenu_Define.Width;
			}
			Contextmenu_Define.setWidth = function(Width)
			{
				//定義視窗高度
				Contextmenu_Define.Width = Width;
			}
			//定義 Mask 依附物件
			Contextmenu_Define.getHeight = function()
			{
				return Contextmenu_Define.Height;
			}
			Contextmenu_Define.setHeight = function(Height)
			{
				//定義視窗高度
				Contextmenu_Define.Height = Height;
			}
			//回傳物件
			return Contextmenu_Define;
		}
		catch(err)
		{
			if(App_Debug)
			{
				console.log(err);
			}
		}
	}
}