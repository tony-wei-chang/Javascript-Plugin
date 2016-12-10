/*常用功能 Y02*/
//Jquery 準備好
$('#Mainpage_Menu').ready(function()
{
	try
	{
		//部門清單
		var view = {};
		view.Title = "常用功能";
		view.Content_Func = function()
		{
			//常用功能畫面
			T_Task_Usually_Use_GridPanel_Func();
		}
		//確認是否載入過
		if(checkMenu_Title(view.Title))
		{
			T_Task_Usually_Use_GridPanel_Func();
		}
		else
		{
			createMainpage_Menu(view);
		}
	}
	catch(err)
	{
		if(App_Debug)
		{
			console.log(err);
		}
	}
});
//常用功能畫面
function T_Task_Usually_Use_GridPanel_Func()
{
	try
	{
		//新增一個 tab
		addTab('T_Task_Usually_Use_GridPanel','常用功能');
		//如果物件已經創建過則不需要重複
		if($("#T_Task_Usually_Use_GridPanel").children().length != 0)
		{
			return;
		}
		//建立常用功能畫面
		T_Task_Usually_Use_GridPanel = Grid_Panel_Define.Initialize();
		T_Task_Usually_Use_GridPanel.setId('T_Task_Usually_Use_GridPanel');
		T_Task_Usually_Use_GridPanel.setResizer_ID('T_Task_Usually_Use_GridPanel_Resizer');
		T_Task_Usually_Use_GridPanel.setHeader_Title(['序號','產品編號','產品名稱','銷貨數量','銷貨單位','銷貨單價','稅前單價','稅前金額']);
		T_Task_Usually_Use_GridPanel.setModel(['Number','ProductNumber','ProductName','SellNumber','SellNumber2','SellPrice','BeforeTaxPrice','BefroeTaxPrice2']);
		T_Task_Usually_Use_GridPanel.setPagesize(10);
		T_Task_Usually_Use_GridPanel.setfieldShow([true,true,true,true,true,true,true,true]);
		T_Task_Usually_Use_GridPanel.setMulti_Selectable(true);
		T_Task_Usually_Use_GridPanel.setHeader_Width(['7%','12.85%','12.85%','12.85%','12.85%','12.85%','12.85%','12.85%']);
		T_Task_Usually_Use_GridPanel.createToolbar();
		T_Task_Usually_Use_GridPanel.createHeader();
		T_Task_Usually_Use_GridPanel.createTable();
		//改寫欄位
		T_Task_Usually_Use_GridPanel.setLoad_Callback(function()
		{
			//開始號碼
			var startFrom = 0;
			for(var i = 0; i < $('#T_Task_Usually_Use_GridPanel_Table').children().length; i++)
			{
				//編號
				$('#T_Task_Usually_Use_GridPanel_Table_Inner_' + i).children().eq(0).html("T_" + parseInt(i + startFrom + T_Task_Usually_Use_GridPanel.getStart()));
				$("#T_Task_Usually_Use_GridPanel_Number_Sort").hide();
			};
		});
		T_Task_Usually_Use_GridPanel.createPagging();
		//網址取用
		T_Task_Usually_Use_GridPanel.getUrl = function getUrl()
		{
			//組合參數
			var Start = T_Task_Usually_Use_GridPanel.getStart();
			var Limit = T_Task_Usually_Use_GridPanel.getPagesize();
			return "testData.php?_Y02=" + new Date().getTime() + "&start=" + Start + "&limit=" + Limit;
		};
		//載入資料
		T_Task_Usually_Use_GridPanel.load();
	}
	catch(err)
	{
		if(App_Debug)
		{
			console.log(err);
		}
	}
}