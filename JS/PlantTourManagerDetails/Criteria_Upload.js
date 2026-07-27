//Attachement Upload Function
var UpdateObservationId=0;
var ObservationData= new Array();
var DeletedItemId='';

var NewObservationFormID='';
function initObservationAttachment() {
    //var control = document.getElementById("exampleFormControlFile1");
    var countrol = document.getElementById("exampleFormControlFile1");
    countrol.addEventListener("change", ObservationAttachmentClickFunction, false);
    
}

var file;
var contents;
var fileID;
var files;
var ObservationData=[];
function ObservationAttachmentClickFunction(event) {
		ShowLoader();
		var isvalidated=true;
	    var i = 0;
	    files = event.files;
	    var len = files.length;
	    fileID=event.id;
	   	ObservId = fileID.replace("AttachID","ObserId");
	 //  var AreaId=ObservId .split("_")[1];
	   var DepartmentId=ObservId.split("_")[3]
	 //  var CategoryId=ObservId.split("_")[3];
	   var CategoryId=ObservId.split("_")[5];
	   var CriteriaId=ObservId.split("_")[7];
	    for(i=0;i<ObservationData.length;i++)
			{
					if(DepartmentId==ObservationData[i].DepartmentId && CategoryId== ObservationData[i].CategoryId && CriteriaId==ObservationData[i].CriteriaId)
					{
					UpdateObservationId=ObservationData[i].Id;
					
					}
					else
					{
					UpdateObservationId=0;
					}
					
			}
	   		if($('#'+ObservId).val()==0)
	   		{
	   		$('#'+ObservId).val(UpdateObservationId); 
	   		}
	  
	   // $('#'+ObservId).val(ObservationId);   	 
	    if(len >0)
	    {
	
		    for (; i < len; i++) {
				var FileSize = files[i].size / 1024 / 1024;
				if(!(FileSize <=11))
				{
					isvalidated=false;
		        	//$("#BCRFileattach").val(null);
		        	HideLoader();
		        	//alert('Please upload file upto 2 MB');
					isvalidated.msg='Please upload file upto 10 MB';
					//ShowErrorValidations(isvalidated.msg,'error','Validation Failed');
					ShowErrorValidations('Please upload file upto 10 MB','error','Validation Failed');

					fileID='';
					break;
				}
 
		        
		    }
			if(isvalidated)
			{
			//Item Id
				if($('#'+ObservId).val().trim()== 0)
				{
					//....................................................if(ObservationId)
					SaveObservationFormAttachment(SaveObservationFormAttachmentSuccess, SaveObservationFormAttachmentFailure)
					//HideLoader();
				}
				else
				{
					if (files.length > 0) 
					{
				        file = files[0];
				        fileName = file.name;
				
				        var reader = new window.FileReader();
				        reader.onload = fonload;
				
				        reader.onerror = function(event) {
				            console.error("File reading error " + event.target.error.code);
				        };
				        reader.readAsArrayBuffer(file);
				    }       
				    return false;
				}
				
		    }
		    else
		    {
		    	fileID='';
		    	HideLoader();
		    }
		}
		else
	    {
	    	fileID='';
	    	HideLoader();
	    }
}

function CheckUpdateObservationId(data)
{


ObservationData=data;


}
function SaveObservationFormAttachmentSuccess(data)
{
	
	$('#'+ObservId).val(data.d.Id)
	//$('#hdnObservationAttachmentsID').val(data.d.Id);
	if (files.length > 0) 
	{
        file = files[0];
        fileName = file.name;

        var reader = new window.FileReader();
        reader.onload = fonload;

        reader.onerror = function(event) {
            console.error("File reading error " + event.target.error.code);
        };
        reader.readAsArrayBuffer(file);
    }       
     
}

function SaveObservationFormAttachmentFailure()
{
	alert('Something went wrong !');
	HideLoader();
}




function _arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new window.Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return binary;
}

function fonload(event) {
    contents = event.target.result;
    $.getScript("/_layouts/15/SP.RequestExecutor.js", fonload2);
}

function fonload2() {
    var contents2 = _arrayBufferToBase64(contents);
    var createitem = new SP.RequestExecutor("/");
    var Newfilename=file.name;
    var ItemID = $('#'+ObservId).val();
     

    if(Newfilename!='')
    {
    	createitem.executeAsync({
	        url: WebAbsoluteUrl+"/_api/web/lists/GetByTitle('"+ObservationsListName+"')/items("+ItemID+")/AttachmentFiles/add(FileName='" + Newfilename + "')",
	        method: "POST",
	        headers: {
	        "Accept": 'application/json;odata=verbose',
	        "X-RequestDigest": $('#__REQUESTDIGEST').val()
	    	},
	        binaryStringRequestBody: true,
	        body: contents2,
	        success: fsucc,
	        error: ferr,
	        state: "Update"
    	});
    }
    else
    {
    	HideLoader();
    }

	
    

    function fsucc(data) {
		$('input[type="file"]').val(null);
		GetObservationAttachments($('#'+ObservId).val(),GetObservationAttachmentsSuccess,GetObservationAttachmentsFailure);
    }

    function ferr(data) {
        var jsondata=JSON.parse(data.body);
	    fileID='';
	    HideLoader();
    	$('input[type="file"]').val(null);
    	ShowErrorToast(jsondata.error.message.value.split('.')[0],'error','Error')
    }
}

function GetObservationAttachmentsSuccess(data)
{
	var OrginalAttachId=fileID;
	//var AttachID = fileID.replace("AttachID","AttachDisId");
	//var Id = fileID.replace("AttachID","");
	var AttachID=''; 
	var Id='';
	 if(DeleteItem)
	 {
	   AttachID=DeleteAttachId.replace("AttachID","AttachDisId");
	   Id=DeleteAttachId.replace("AttachID","");

	 }
	 else{
	       AttachID = fileID.replace("AttachID","AttachDisId");
	       Id = fileID.replace("AttachID","");

	 }

	if(data.length>0)
	{
	  
	   var ItemId=data[0].Id;
		$("#"+AttachID).empty();
		var attachmentshtml='';
		var CETSTeamFileCount=0;

		for(var i=0;i<data.length;i++)
		{	
		//$('#'+AttachID).append('<br/>'+parseInt(i+1)+'. <a href="'+data[i].Fileurl+'" target="_blank" style="text-decoration:underline;font-weight: bold;">'+data[i].Filename+'</a><a onclick="DeleteObservationFormAttachment(this,'+ItemId+')" data-ItemId="'+ItemId+'" data-filename="'+data[i].Filename+'" Id="'+Id+'_'+parseInt(i+1)+'"><img border="0" alt="Delete Attachment" src="/sites/PTMS_UAT/BectorsSourceCode/Images/Delete_Icon.png" width="20" height="20" style="margin-left: 10px;cursor: pointer;"></a>');
		//$('#'+AttachID).append(parseInt(i+1)+'. <a href="'+data[i].Fileurl+'" target="_blank" style="text-decoration:underline;font-weight: bold;">'+data[i].Filename+'</a><a onclick="DeleteObservationFormAttachment(this)" data-ItemId="'+ItemId+'" data-filename="'+data[i].Filename+'" Id="'+Id+'_'+parseInt(i+1)+'"><img border="0" alt="Delete Attachment" src="/sites/PTMS_UAT/BectorsSourceCode/Images/Delete_Icon.png" width="20" height="20" style="margin-left: 10px;cursor: pointer;"></a>');
		$('#'+AttachID).append(parseInt(i+1)+'. <a href="'+data[i].Fileurl+'" target="_blank" style="text-decoration:underline;font-weight: bold;">'+data[i].Filename+'</a><a onclick="DeleteObservationFormAttachment(this)" data-ItemId="'+ItemId+'" data-filename="'+data[i].Filename+'" Id="'+Id+'_'+parseInt(i+1)+'"><img border="0" alt="Delete Attachment" src="/sites/PTMS_UAT/BectorsSourceCode/Images/Delete_Icon.png" width="20" height="20" style="margin-left: 10px;cursor: pointer;"></a><br/>');
		}
	}
	else
	{
		//$("#"+AttachID).empty();
		$('#'+AttachmentId).empty();
	}
	
	fileID='';
	HideLoader();
	DeleteItem=false;

}

function GetObservationAttachmentsFailure()
{
	fileID='';
	HideLoader();

}

var AttachmentId='';
var DeleteItem=false;
var DeleteAttachId='';
function DeleteObservationFormAttachment(obj)
{
   $(".Loader").show();
	var ItemId=$(obj).attr('data-ItemId');
	DeletedItemId=ItemId
	var filename=$(obj).attr('data-filename');
	var observId = $(obj).attr("Id");
	observId = observId.substring(0, observId.lastIndexOf('_'))
	DeleteAttachId=observId+"AttachID"; 
	AttachmentId=observId+"AttachDisId"
	ObservId = observId+"ObserId";
	DeleteRequestAttachment(filename,ItemId,DeleteObservationFormAttachmentSuccess,DeleteObservationFormAttachmentFailure);
}


function DeleteObservationFormAttachmentSuccess(data)
{
  DeleteItem=true;	
 GetObservationAttachments(DeletedItemId,GetObservationAttachmentsSuccess,GetObservationAttachmentsFailure);


}

function DeleteObservationFormAttachmentFailure(data)
{
	HideLoader();
}
