//Attachement Upload Function


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
var ObservId;
function ObservationAttachmentClickFunction(event) {
		ShowLoader();
		var isvalidated=true;
	    var i = 0;
	    files = event.files;
	    var len = files.length;
	    fileID=event.id;
	   	ObservId = fileID.replace("AttachID","ObserId"); 
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

	var AttachID = fileID.replace("AttachID","AttachDisId");
	var Id = fileID.replace("AttachID","");

	if(data.length>0)
	{
		$("#"+AttachID).empty();
		var attachmentshtml='';
		var CETSTeamFileCount=0;

		for(var i=0;i<data.length;i++)
		{				$('#'+AttachID).append('<br/>'+parseInt(i+1)+'. <a href="'+data[i].Fileurl+'" target="_blank" style="text-decoration:underline;font-weight: bold;">'+data[i].Filename+'</a><a onclick="DeleteObservationFormAttachment(this)" data-filename="'+data[i].Filename+'" Id="'+Id+'_'+parseInt(i+1)+'"><img border="0" alt="Delete Attachment" src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/Delete_Icon.png" width="20" height="20" style="margin-left: 10px;cursor: pointer;"></a>');

					}
	}
	else
	{
		$("#"+AttachID).empty();
	}
	
	fileID='';
	HideLoader();

}

function GetObservationAttachmentsFailure()
{
	fileID='';
	HideLoader();

}


function DeleteObservationFormAttachment(obj)
{
	ShowLoader();
	var filename=$(obj).attr('data-filename');
	var observId = $(obj).attr("Id");
	observId = observId.substring(0, observId.lastIndexOf('_'))
	ObservId = observId+"ObserId";
	DeleteRequestAttachment(filename,DeleteObservationFormAttachmentSuccess,DeleteObservationFormAttachmentFailure);
}


function DeleteObservationFormAttachmentSuccess(data)
{
	//TotalFuctionLoader++;
 GetObservationAttachments($('#'+ObservId).val(),GetObservationAttachmentsSuccess,GetObservationAttachmentsFailure);


}

function DeleteObservationFormAttachmentFailure(data)
{
	HideLoader();
}
