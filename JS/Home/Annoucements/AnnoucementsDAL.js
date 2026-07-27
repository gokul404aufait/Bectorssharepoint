var AnnouncementsList='Announcements';

function AnnouncementsEntity()
{
	this.Id
	,this.Title
	,this.Sequence
	
}


function GetAnnouncements(Success,Failure)
{
	      
   var SelectQuery = "?$select=Id,Title";
   var filterQuery= "&$filter=IsActive eq 1";
   var orderByQuery= "&$orderby=Sequence asc";
   var TopQuery= "&$top=4999";

   var tempQuery = SelectQuery + filterQuery+orderByQuery+TopQuery;

	var requestQuery = requestURL.format(WebAbsoluteUrl, AnnouncementsList, tempQuery);
	getListItemByQuery(requestQuery, onFillGetAnnouncements, Success, Failure);

}


function onFillGetAnnouncements(data,Success,Failure)
{
	if (!(!data)) {
        var stringData = JSON.stringify(data);
        var jsonObject = JSON.parse(stringData);
        var collAnnouncements= new Array();
		for (var i = 0; i < jsonObject.d.results.length; i++) {
        	collAnnouncements[i] = FillGetAnnouncements(jsonObject.d.results[i]);
		}
		Success(collAnnouncements);
	}

}

function FillGetAnnouncements(result)
{

	var objAnnouncementsEntity = new AnnouncementsEntity();
	objAnnouncementsEntity .Id=result.Id;
	if(result.Title!=null){
		objAnnouncementsEntity .Title = result.Title;
	}
	else{
		objAnnouncementsEntity .Title = '';
	}
		

	
  return objAnnouncementsEntity ;
}
