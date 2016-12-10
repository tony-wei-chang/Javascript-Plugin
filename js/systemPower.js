/*系統權限 Y02*/
try
{
	//載入指定js
	loadJs('js/1000.js',function()
	{
		loadJs('js/2000.js');
	});
}
catch(err)
{
	if(App_Debug)
	{
		console.log(err);
	}
}