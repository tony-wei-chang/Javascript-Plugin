<?php
	$start = isset($_GET['start'])?$_GET['start']:0;
	$limit = isset($_GET['limit'])?$_GET['limit']:25;
	$string = "";
	for($i=$start; $i < ($start + $limit); $i++)
	{ 
		if($i != ($start + $limit) - 1)
		{
			$string = $string . 
			"{
		    	\"ProductNumber\": \"ProductNumber_$i\",
		    	\"ProductName\": \"ProductName_$i\",
		    	\"SellNumber\": \"SellNumber_$i\",
			    \"SellNumber2\": \"SellNumber2_$i\",
			    \"SellPrice\": \"SellPrice_$i\",
			    \"BeforeTaxPrice\": \"BeforeTaxPrice_$i\",
			    \"BefroeTaxPrice2\": \"BefroeTaxPrice2_$i\"
		  	},";
		}
		else
		{
			$string = $string . 
			"{
		    	\"ProductNumber\": \"ProductNumber_$i\",
		    	\"ProductName\": \"ProductName_$i\",
		    	\"SellNumber\": \"SellNumber_$i\",
			    \"SellNumber2\": \"SellNumber2_$i\",
			    \"SellPrice\": \"SellPrice_$i\",
			    \"BeforeTaxPrice\": \"BeforeTaxPrice_$i\",
			    \"BefroeTaxPrice2\": \"BefroeTaxPrice2_$i\"
		  	}";
		}
	}
	echo "{\"count\":$limit,\"success\":true,\"data\":[$string],\"maxCount\":100}";
?>