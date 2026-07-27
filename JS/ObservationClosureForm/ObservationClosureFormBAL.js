var userRoleID=null;
var RoleName='';
var userRoleSequence='';
var ObservationId='';
$(document).ready(function(){
	ObservationId=GetQueryStringParams('ReqId');
	if(ObservationId!='')
	{
	   $('#hdnClosureID').val(ObservationId);
	   $('#hdnClosureAttachmentsID').val(ObservationId);
		
	   GetEmployeeDetails(GetEmployeeDetailsSuccess,GetEmployeeDetailsFailure);
		
		//initClosureAttachment();
      //$('.form-control')
      
         $('#ClosureCommentId').prop('disabled',true);
		  $('#CloseBtn').hide();
		  $('#CancelBtn').hide();
		  $('#AttachmentdivId').hide();
           $('#CorrectiveActiontxt').prop('disabled',true);
	}

	});

function GetEmployeeDetailsSuccess(collEmployee)
{
	
	if(collEmployee.length>0)
	{
		
		userRoleID= collEmployee[0].RoleId;
		RoleName=collEmployee[0].RoleName;
		userRoleSequence=collEmployee[0].RoleSequence
		$('#DepartmentNameId').text(collEmployee[0].DepartmentTitle)
		UserDepartment=collEmployee[0].DepartmentId;
		//GetObservationClosureData(UserDepartment,ObservationClosurSuccess,ObservationClosurFailure);
        ObservationClosurSuccessData();
    }	
}

function GetEmployeeDetailsFailure()
{

}

 var obervationClosureHTML='';

async function ObservationClosurSuccessData() {
    var AccessToken = await getAccessToken();
  var tableName = "cr3ea_prod_observationses";
  var apiVersion = "9.2";
  var apiUrl = environmentUrl + "/api/data/v" + apiVersion + "/" + tableName + "?$filter=(cr3ea_prod_observationsid eq " + ObservationId + ")";
  if ( AccessToken != '' || AccessToken != undefined || AccessToken != null ) {
    var accessToken = AccessToken; // Use access token
    var header = {
      "Accept": "application/json",
      "Content-Type": "application/json; charset=utf-8",
      "OData-MaxVersion": "4.0",
      "OData-Version": "4.0",
      "Prefer": "return=representation",
      "Authorization": "Bearer " + accessToken
    };
   /*const response = await fetch( apiUrl, {
        method: "GET",
        headers: header,success: function (data) {
        ObservationClosurData(data);
      }
      } );*/
       $.ajax( {
      url: apiUrl,
      type: "GET",
      headers: header,
      success: function ( data ) {
         ObservationClosurData(data);
        
      },
      error: function ( error ) {
        // Handle errors
        console.error( "Error fetching data:", error );
      }
    } );
    }
}

function ObservationClosurData(collObservationClosure)
{	
	var tempCloseHTML = '';
	var ItemId=$('#hdnClosureID').val();
	if(collObservationClosure.value.length>0)
	{
	
			for(var i=0;i<collObservationClosure.value.length;i++)
			{	
				//ItemIdArray.push(collObservationClosure[i].Id)
				var observedDate = moment(collObservationClosure.value[i].cr3ea_observeddate).format('DD-MMM-YY');
				$("#CiteriaId").val(collObservationClosure.value[i].cr3ea_where);
				$("#whatId").val(collObservationClosure.value[i].cr3ea_what);
				$("#ObservationId").val(collObservationClosure.value[i].cr3ea_observation);
				$("#CorrectiveActionId").val(collObservationClosure.value[i].cr3ea_correctiveaction);
				$("#observedById").val(collObservationClosure.value[i].cr3ea_observedperson);
				$('#Categorytxt').val(collObservationClosure.value[i].cr3ea_categorytitle);
				$("#observationDateId").val(observedDate);
				$('#CorrectiveActiontxt').val(collObservationClosure.value[i].cr3ea_correctiveaction);
				$('#ClosedByTxt').val(_spPageContextInfo.userDisplayName);
                $('#Actiontxt').val(collObservationClosure.value[i].cr3ea_action);
				//$('#Severitytxt').val(collObservationClosure.value[i].cr3ea_severityid);
				if(collObservationClosure.value[i].cr3ea_severityid=='3')
				{
					$('#chkSeverity').prop( "checked", true );
				}
				
		
			}
		
	if(collObservationClosure.value[0].cr3ea_observedby==13)
	 {
	   	
	  if((collObservationClosure.value[0].cr3ea_status == "Pending" || collObservationClosure.value[0].cr3ea_status == "Draft") && collObservationClosure.value[0].cr3ea_action == "Rejected" && (userRoleSequence == 30 || userRoleSequence == 20))
	     {
			$('#ClosureCommentId').val(collObservationClosure.value[0].cr3ea_closurecomment).prop('disabled',false);
			$('#CloseBtn').show();
			$('#CancelBtn').show();
			$('#AttachmentdivId').show();
			$('#CorrectiveActiontxt').prop('disabled',false);

		}
     }
     else if(collObservationClosure.value[0].cr3ea_observedby=20)
     {
        if(collObservationClosure.value[0].cr3ea_status=='Pending' & collObservationClosure.value[0].cr3ea_action=='Rejected' & (userRoleSequence==30 || userRoleSequence==20 || userRoleSequence==15))
	     {
			$('#ClosureCommentId').val(collObservationClosure.value[0].cr3ea_closurecomment).prop('disabled',false);
			$('#CloseBtn').show();
			$('#CancelBtn').show();
			$('#AttachmentdivId').show();
			$('#CorrectiveActiontxt').prop('disabled',false);

		}

     }
     //GetObservationAttachments(ItemId,GetObservationsAttachmentsSuccess,GetObservationAttachmentsFailure);     
	}
    else
    {
		alert('No details found ');
		var homeURL ="/sites/Mrs_Bectors_PTMS/Pages/Home.aspx";
		window.location.href=homeURL ;

    }
}

function ObservationClosurFailure()
{
 alert('Failure in ObservationClosur Form');
}


/*Get Attcahment*/
/*function GetObservationsAttachmentsSuccess(data)
{

	if(data.length>0)
	{
        $('#ObservationAttachmentId').empty();
		var attachmentshtml='';
		var attachmentsType='';
				
		for(var i=0;i<data.length;i++)
		{
			var ItemId=data[0].Id;
		  	attachmentsType = data[i].Filename;
			var closure = attachmentsType.startsWith("Closure_");
			if(closure==true)
			{
			var sliceFilename = data[i].Filename;
			 var sliceFile = sliceFilename.slice(8, 100);

			//$('#ClosureFormId').append('<br/>'+parseInt(i+1)+'. <a href="'+data[i].Fileurl+'" target="_blank" style="text-decoration:underline;font-weight: bold;">'+data[i].Filename+'</a>');
			//$('#ClosureFormId').append('<br/><a href="'+data[i].Fileurl+'" target="_blank" style="text-decoration:underline;font-weight: bold;">'+data[i].Filename+'</a>');
			$("#ClosureFormId").append('<br/><a href="'+data[i].Fileurl+'"  target="_blank" style="text-decoration:underline;font-weight: bold;">'+sliceFile+'</a><a onclick="DeleteClosureFormAttachment(this)" data-filename="'+data[i].Filename+'" data-ItemId="'+ItemId+'"><img border="0" alt="Delete Attachment" src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/Delete_Icon.png" width="20" height="20" style="margin-left: 10px;cursor: pointer;"></a>');
			}
			else
			{
			//$('#ObservationAttachmentId').append('<br/>'+parseInt(i+1)+'. <a href="'+data[i].Fileurl+'" target="_blank" style="text-decoration:underline;font-weight: bold;">'+data[i].Filename+'</a>');
			$('#ObservationAttachmentId').append('<br/> <a href="'+data[i].Fileurl+'" target="_blank" style="text-decoration:underline;font-weight: bold;">'+data[i].Filename+'</a>');
			}       
			 }
	}
	else
	{
		$('#ObservationAttachmentId').empty();
	}
	
	HideLoader();

}

function GetObservationAttachmentsFailure()
{
	HideLoader();
}*/


function GetObservationForBindFailure()
{}


async function UpdateClosureDetails(){
var AccessToken = await getAccessToken();
  var tableName = "cr3ea_prod_observationses";
  var apiVersion = "9.2";
  var recordId = ObservationId;
  var apiUrl = environmentUrl + "/api/data/v" + apiVersion + "/" + tableName + "(" + recordId + ")";
  if ( AccessToken != '' || AccessToken != undefined || AccessToken != null ) {
    var accessToken = AccessToken; // Use access token
    var header = {
      "Accept": "application/json",
      "Content-Type": "application/json; charset=utf-8",
      "OData-MaxVersion": "4.0",
      "OData-Version": "4.0",
      "Prefer": "return=representation",
      "Authorization": "Bearer " + accessToken
    };
    ShowLoader();
    var ClosedByPerson = _spPageContextInfo.userId.toString();
    var ClosedDateByPerson = moment().format('DD-MMM-YYYY HH:mm:ss');
	//var CorrectiveAction=$('#CorrectiveActionId').val();
	var ClosureComment =$('#ClosureCommentId').val();
	var CorrectiveAction = $('#CorrectiveActiontxt').val();

    if(ClosureComment=="" || ClosureComment==null){
		alert('Please enter Closure Comment')
	}
	else {
	const dataToSave = {
        cr3ea_closurecomment: ClosureComment,
        cr3ea_correctiveaction: CorrectiveAction,
        cr3ea_closedby: ClosedByPerson,
        cr3ea_closeddate: ClosedDateByPerson,
        cr3ea_closedbyrole: RoleName,
        cr3ea_status: 'Closed',
		//UpdateObservationitem(objClosureDetails, UpdateClosureDetailsSuccess, UpdateClosureDetailsFailure);
    }
    try{
    const response = await fetch( apiUrl, {
        method: "PATCH",
        headers: header,
        body: JSON.stringify( dataToSave ),
      } );
      console.log(response);
      if ( !response.ok ) {
        throw new Error( `Error: ${ response.statusText }` );
      }
    }
    catch{
        console.log("something went wrong");
    }
    }
	//$('#closeButtonId').prop();
	HideLoader();
	window.location.href = WebAbsoluteUrl
  }
}


function UpdateClosureDetailsSuccess(data)
{
//location.reload(true);
window.location.href = WebAbsoluteUrl;
  HideLoader();
   $('#CorrectiveActiontxt').attr('disabled',true);
}

function UpdateClosureDetailsFailure()
{
	alert('Something went wrong');
}

function GotoHome()
{
window.location.href = WebAbsoluteUrl;
  HideLoader();

}