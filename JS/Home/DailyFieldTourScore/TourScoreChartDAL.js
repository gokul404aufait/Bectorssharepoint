
function rawGraphTourEntity()
{

	this.Department
	,this.TourStartDate
	,this.PlantScore
	,this.DepartmentScore
}



/*
 * Department Tour
 */
var DepartmentTourList = 'DepartmentTour';

function DepartmentTourListEntity()
{
	 this.ID
	,this.Department
	,this.DepartmentID
	,this.TourStartDate
	,this.TourScore
	,this.RoleId
	,this.RoleSequence
}
 
function GetDepartmentTour(today,startDate,DepartmentId,Success,Failure){
		
	SelectQuery ="?$select=ID,DepartmentId/Title,DepartmentId/Id,TourStartDate,TourScore,Status,RoleId/Id,RoleId/field_4"
	,expandQuery = "&$expand=DepartmentId,RoleId";
	var filterQuery = '';
	
	if($('#hdnGivenMonth').val()=='' && $('#hdnGivenYear').val()=='')
	{

				if(DepartmentId != ''){
				filterQuery = "&$filter=DepartmentId/Id eq "+parseInt(DepartmentId)+" and Status eq 'Completed' and TourStartDate ge '"+startDate+"' and TourStartDate lt '"+today+"'";
				}
				else{
				filterQuery = "&$filter=Status eq 'Completed' and TourStartDate ge '"+startDate+"' and TourStartDate lt '"+today+"'";
				}
	}
	else
	{
				var month=$('#hdnGivenMonth').val();
				month=parseInt(month);
				var year = $('#hdnGivenYear').val();
				if(month==12)
				{
				var nextmonth=parseInt(month);
				today= +nextmonth+"-31-"+year;

				}
				else
				{
				var nextmonth=parseInt(month)+1;
				today= +nextmonth+"-1-"+year;
				
				}
				startDate = +month+"-1-"+year;
				startDate = (new Date(startDate )).format('yyyy-M-dd');

				
				today= (new Date(today)).format('yyyy-M-dd');
				if(DepartmentId != '')
				{
				filterQuery = "&$filter=DepartmentId/Id eq "+parseInt(DepartmentId)+" and Status eq 'Completed' and TourStartDate ge '"+startDate+"' and TourStartDate lt '"+today+"'";
				}
				else
				{
				filterQuery = "&$filter=Status eq 'Completed' and TourStartDate ge '"+startDate+"' and TourStartDate lt '"+today+"'";
				}
		}			
	var orderQuery = "&$orderBy=ID asc";
    var topQuery="&$top=4999"
	var tempQuery = SelectQuery+expandQuery+filterQuery+orderQuery+topQuery;
	
    var requestQuery = requestURL.format(WebAbsoluteUrl, DepartmentTourList,tempQuery);
    
    getListItemByQuery(requestQuery, onFillDepartmentTourData, Success, Failure);
}
function onFillDepartmentTourData(data,Success,Failure)
{
	if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collDepartmentTour = new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collDepartmentTour[i] = FillDepartmentTour(jsonObject.d.results[i]);
		}
		Success(collDepartmentTour);
	}

}
function FillDepartmentTour(result)
{
	var objDepartmentTourListEntity = new DepartmentTourListEntity();
	
	if(result.ID != null)
	{
		objDepartmentTourListEntity.ID = result.ID;
	}
	else
	{
		objDepartmentTourListEntity.ID = '';
	}
		
	if(result.DepartmentId != null)
	{
		objDepartmentTourListEntity.Department = result.DepartmentId.Title;
		objDepartmentTourListEntity.DepartmentID = result.DepartmentId.Id;
	}
	else
	{
		objDepartmentTourListEntity.Department = '';
		objDepartmentTourListEntity.DepartmentID = '';
	}
	if(result.RoleId.Id != null)
	{
		//objDepartmentTourListEntity.Department = result.DepartmentId.Title;
		objDepartmentTourListEntity.RoleID = result.RoleId.Id;
		if(result.RoleId.field_4!='')
		{
		objDepartmentTourListEntity.RoleSequence=result.RoleId.field_4;
		}
		else
		{
		objDepartmentTourListEntity.RoleSequence='';
		}
	}
	else
	{
		//objDepartmentTourListEntity.Department = '';
		objDepartmentTourListEntity.RoleID= '';
        objDepartmentTourListEntity.RoleSequence='';	
      }



    if(result.TourStartDate !=null)
	{
		objDepartmentTourListEntity.TourStartDate = result.TourStartDate;
	}
	else
	{
		objDepartmentTourListEntity.TourStartDate = '';
	}

	
	if(result.TourScore != null)
	{
		objDepartmentTourListEntity.TourScore = result.TourScore;
	}
	else
	{
		objDepartmentTourListEntity.TourScore = '';
	}
		
	return objDepartmentTourListEntity;
}
/*
 * Plant Tour
 */
var PlantTourList = 'DepartmentTour';

function PlantTourListEntity()
{
	 this.ID
	,this.Department
	,this.DepartmentID
	,this.TourStartDate
	,this.TourScore
	,this.RoleId
	,this.RoleSequence
}
 
function GetPlantTour(today,startDate,DepartmentId,Success,Failure){

	SelectQuery ="?$select=ID,Title,DepartmentId/Title,DepartmentId/Id,TourStartDate,TourScore,Status,RoleId/Id,RoleId/field_4"
	,expandQuery = "&$expand=DepartmentId,RoleId";
	var filterQuery = '';
	if($('#hdnGivenMonth').val()=='' && $('#hdnGivenYear').val()=='')
	{

				
				if(DepartmentId != ''){
					filterQuery = "&$filter=DepartmentId/Id eq "+parseInt(DepartmentId)+" and Status eq 'Completed' and TourStartDate ge '"+startDate+"' and TourStartDate lt '"+today+"'";
				}
				else{
					filterQuery = "&$filter=Status eq 'Completed' and TourStartDate ge '"+startDate+"' and TourStartDate lt '"+today+"'";
				}
	}
	else
	{
	
				var month=$('#hdnGivenMonth').val();
				month=parseInt(month);
				var year = $('#hdnGivenYear').val();
				if(month==12)
				{
				var nextmonth=parseInt(month);
				today= +nextmonth+"-31-"+year;
			

				}
				else
				{
				var nextmonth=parseInt(month)+1;
				today= +nextmonth+"-1-"+year;
				
				}

				startDate = +month+"-1-"+year;
				startDate = (new Date(startDate )).format('yyyy-M-dd');
				today= (new Date(today)).format('yyyy-M-dd');
			
				
				if(DepartmentId != ''){
					filterQuery = "&$filter=DepartmentId/Id eq "+parseInt(DepartmentId)+" and Status eq 'Completed' and TourStartDate ge '"+startDate+"' and TourStartDate lt '"+today+"'";
				}
				else{
					filterQuery = "&$filter=Status eq 'Completed' and TourStartDate ge '"+startDate+"' and TourStartDate lt '"+today+"'";
				}

	
	}			
	
	
	var orderQuery = "&$orderBy=ID asc";
    var topQuery="&$top=4999"
	var tempQuery = SelectQuery+expandQuery+filterQuery+orderQuery+topQuery;
    var requestQuery = requestURL.format(WebAbsoluteUrl, PlantTourList,tempQuery)	
    getListItemByQuery(requestQuery, onFillPlantTourData, Success, Failure);
}
function onFillPlantTourData(data,Success,Failure)
{
	if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collPlantTour = new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collPlantTour[i] = FillPlantTour(jsonObject.d.results[i]);
		}
		Success(collPlantTour);
	}

}
function FillPlantTour(result)
{
	var objPlantTourListEntity = new PlantTourListEntity();
	
	if(result.ID != null)
	{
		objPlantTourListEntity.ID = result.ID;
	}
	else
	{
		objPlantTourListEntity.ID = '';
	}
		
	if(result.DepartmentId != null)
	{
		objPlantTourListEntity.Department = result.DepartmentId.Title;
		objPlantTourListEntity.DepartmentID = result.DepartmentId.Id;
	}
	else
	{
		objPlantTourListEntity.Department = '';
		objPlantTourListEntity.DepartmentID = '';
	}
	if(result.RoleId.Id != null)
	{
		//objDepartmentTourListEntity.Department = result.DepartmentId.Title;
		objPlantTourListEntity.RoleID = result.RoleId.Id;
		if(result.RoleId.field_4!='')
		{
		objPlantTourListEntity.RoleSequence=result.RoleId.field_4;
		}
		else
		{
		objPlantTourListEntity.RoleSequence='';
		}
	}
	else
	{
		//objDepartmentTourListEntity.Department = '';
		objPlantTourListEntity.RoleID= '';
        objPlantTourListEntity.RoleSequence='';	
      }


    if(result.TourStartDate !=null)
	{
		objPlantTourListEntity.TourStartDate = result.TourStartDate;
	}
	else
	{
		objPlantTourListEntity.TourStartDate = '';
	}

	
	if(result.TourScore != null)
	{
		objPlantTourListEntity.TourScore = result.TourScore;
	}
	else
	{
		objPlantTourListEntity.TourScore = '';
	}
		
	return objPlantTourListEntity;
}

/*
 * Department Master
 */

var DepartmentMasterList = 'DepartmentMaster';

function GraphDepartmentMasterListEntity()
{
	 this.Id
	,this.Title
}
 
function GetGraphDepartmentMasterData(Success,Failure){
		
	var SelectQuery ="?$select=Id,Title"
	var filterQuery = '&$filter=IsActive eq 1';
 	
	var tempQuery = SelectQuery+filterQuery;
	
    var requestQuery = requestURL.format(WebAbsoluteUrl, DepartmentMasterList ,tempQuery);
    
    getListItemByQuery(requestQuery, onFillGraphDepartmentMasterData, Success, Failure);
}
function onFillGraphDepartmentMasterData(data,Success,Failure)
{
	if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collGraphDepartmentMaster = new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collGraphDepartmentMaster[i] = FillGraphDepartmentMaster(jsonObject.d.results[i]);
		}
		Success(collGraphDepartmentMaster);
	}

}
function FillGraphDepartmentMaster(result)
{
	var objGraphDepartmentMasterListEntity = new GraphDepartmentMasterListEntity();
	
	if(result.Id!= null)
	{
		objGraphDepartmentMasterListEntity.Id= result.Id;
	}
	else
	{
		objGraphDepartmentMasterListEntity.Id= '';
	}
	
	if(result.Title != null)
	{
		objGraphDepartmentMasterListEntity.Title = result.Title ;
	}
	else
	{
		objGraphDepartmentMasterListEntity.Title = '';
	}

	return objGraphDepartmentMasterListEntity;
}

/*Get Month*/

var MonthMasterList = 'MonthMaster';

function MonthMasterListEntity()
{
	 this.Id
	,this.Title
	,this.MonthNumber
}
 
function GetMonthMasterData(Success,Failure){
		
	var SelectQuery ="?$select=Id,Title,MonthNumber"
	var filterQuery = '&$filter=IsActive eq 1';
 	
	var tempQuery = SelectQuery+filterQuery;
	
    var requestQuery = requestURL.format(WebAbsoluteUrl, MonthMasterList,tempQuery);
    
    getListItemByQuery(requestQuery, onFillMonthMasterData, Success, Failure);
}
function onFillMonthMasterData(data,Success,Failure)
{
	if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collMaster = new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collMaster[i] = FillMonthMasterData(jsonObject.d.results[i]);
		}
		Success(collMaster);
	}

}
function FillMonthMasterData(result)
{
	var objMonthMasterListEntity= new MonthMasterListEntity();
	
	if(result.Id!= null)
	{
		objMonthMasterListEntity.Id= result.Id;
	}
	else
	{
		objMonthMasterListEntity.Id= '';
	}
	
	if(result.Title != null)
	{
		objMonthMasterListEntity.Title = result.Title;
	}
	else
	{
		objMonthMasterListEntity.Title = '';
	}
	if(result.MonthNumber!= null)
	{
		objMonthMasterListEntity.MonthNumber= result.MonthNumber;
	}
	else
	{
		objMonthMasterListEntity.MonthNumber= '';
	}


	return objMonthMasterListEntity;
}
/*Year Master*/
var YearMasterList = 'YearMaster';

function YearMasterListEntity()
{
	 this.Id
	,this.Title
}
 
function GetYearMasterData(Success,Failure){
		
	var SelectQuery ="?$select=Id,Title"
	var filterQuery = '&$filter=YearMaster eq 1';
 	
	var tempQuery = SelectQuery+filterQuery;
	
    var requestQuery = requestURL.format(WebAbsoluteUrl, YearMasterList ,tempQuery);
    
    getListItemByQuery(requestQuery, onFillYearMasterData, Success, Failure);
}
function onFillYearMasterData(data,Success,Failure)
{
	if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collMaster = new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collMaster[i] = FillYearMasterData(jsonObject.d.results[i]);
		}
		Success(collMaster);
	}

}
function FillYearMasterData(result)
{
	var objYearMasterListEntity= new YearMasterListEntity();
	
	if(result.Id!= null)
	{
		objYearMasterListEntity.Id= result.Id;
	}
	else
	{
		objYearMasterListEntity.Id= '';
	}
	
	if(result.Title != null)
	{
		objYearMasterListEntity.Title = result.Title ;
	}
	else
	{
		objYearMasterListEntity.Title = '';
	}

	return objYearMasterListEntity;
}


/*Get Day*/
var DayMasterList = 'DayMaster';

function DayMasterListEntity()
{
	 this.Id
	,this.Title
}
 
function GetDayMasterData(Success,Failure){
		
	var SelectQuery ="?$select=Id,Title"
	var filterQuery = '&$filter=IsActive eq 1';
 	
	var tempQuery = SelectQuery+filterQuery;
	
    var requestQuery = requestURL.format(WebAbsoluteUrl, DepartmentMasterList ,tempQuery);
    
    getListItemByQuery(requestQuery, onFillGraphDepartmentMasterData, Success, Failure);
}
function onFillDayMasterData(data,Success,Failure)
{
	if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collMaster = new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collMaster[i] = FillDayMasterData(jsonObject.d.results[i]);
		}
		Success(collMaster);
	}

}
function FillDayMasterData(result)
{
	var objDayMasterListEntity= new DayMasterListEntity();
	
	if(result.Id!= null)
	{
		objDayMasterListEntity.Id= result.Id;
	}
	else
	{
		objDayMasterListEntity.Id= '';
	}
	
	if(result.Title != null)
	{
		objDayMasterListEntity.Title = result.Title ;
	}
	else
	{
		objDayMasterListEntity.Title = '';
	}

	return objDayMasterListEntity;
}
