//Attachement Upload Function


var NewClosureFormID='';
function initClosureAttachment() {
    var control = document.getElementById("ClosureFormAttachementId");
    control.addEventListener("change", AttachmentClickFunction, false);
    
}

var file;
var contents;
var fileID;
var files;

function AttachmentClickFunction(event) {
		ShowLoader();
		var isvalidated=true;
	    var i = 0;
	   // files = event.srcElement.files;
	    files = event.files;
	    var len = files.length;
	    //fileID=event.srcElement.id;
	    fileID=event.id;
	    
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
				if($('#hdnClosureAttachmentsID').val().trim()=='')
				{
					SaveObservationFormAttachment(ObservationId,SaveClosureFormAttachmentSuccess, SaveClosureFormAttachmentFailure)
					//HideLoader();
				}
				else
				{
					if (files.length > 0) 
					{
				        file = files[0];
				       // fileName =   file.name.substring(0, file.name.lastIndexOf(".")) + "_Closure" + file.name.substring(file.name.lastIndexOf("."));
						 fileName =   'Closure_'+file.name;
				
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

function SaveClosureFormAttachmentSuccess(data)
{
	$('#hdnClosureAttachmentsID').val(data.d.Id);
	if (files.length > 0) 
	{
        file = files[0];
        //fileName =  file.name.substring(0, file.name.lastIndexOf(".")) + "_Closure" + file.name.substring(file.name.lastIndexOf("."));
			fileName ='Closure_'+file.name;
        var reader = new window.FileReader();
        reader.onload = fonload;

        reader.onerror = function(event) {
            console.error("File reading error " + event.target.error.code);
        };
        reader.readAsArrayBuffer(file);
    }       
     
}

function SaveClosureFormAttachmentFailure()
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
   // var Newfilename=   file.name.substring(0, file.name.lastIndexOf(".")) + "_Closure" + file.name.substring(file.name.lastIndexOf("."));
    var Newfilename = 'Closure_'+file.name;


    if(Newfilename!='')
    {
    	createitem.executeAsync({
	        url: WebAbsoluteUrl+"/_api/web/lists/GetByTitle('"+ObservationClosureListName+"')/items("+$('#hdnClosureAttachmentsID').val()+")/AttachmentFiles/add(FileName='" + Newfilename + "')",
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
		GetObservationAttachments($('#hdnClosureAttachmentsID').val(),GetClosureAttachmentsSuccess,GetClosureAttachmentsFailure);
    }

    function ferr(data) {
        var jsondata=JSON.parse(data.body);
	    fileID='';
	    HideLoader();
    	$('input[type="file"]').val(null);
    	ShowErrorToast(jsondata.error.message.value.split('.')[0],'error','Error')
    }
}

function GetClosureAttachmentsSuccess(data)
{

	if(data.length>0)
	{
//Controller Div Id
		$('#ClosureFormId').empty();
		var attachmentshtml='';
		var CETSTeamFileCount=0;
		var headingHTML= '';
		var attachmentsType='';
		$('#ObservationAttachmentId').empty();
		
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
			//$("#ClosureFormId").append('<br/>'+parseInt(i+1)+'. <a href="'+data[i].Fileurl+'"  target="_blank" style="text-decoration:underline;font-weight: bold;">'+data[i].Filename+'</a><a onclick="DeleteClosureFormAttachment(this)" data-filename="'+data[i].Filename+'" data-ItemId="'+ItemId+'"><img border="0" alt="Delete Attachment" src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/Delete_Icon.png" width="20" height="20" style="margin-left: 10px;cursor: pointer;"></a>');
			$("#ClosureFormId").append('<br/><a href="'+data[i].Fileurl+'"  target="_blank" style="text-decoration:underline;font-weight: bold;">'+sliceFile+'</a><a onclick="DeleteClosureFormAttachment(this)" data-filename="'+data[i].Filename+'" data-ItemId="'+ItemId+'"><img border="0" alt="Delete Attachment" src="/sites/Mrs_Bectors_PTMS/BectorsSourceCode/Images/Delete_Icon.png" width="20" height="20" style="margin-left: 10px;cursor: pointer;"></a>');
			}
			else
			{
			//$('#ObservationAttachmentId').append('<br/>'+parseInt(i+1)+'. <a href="'+data[i].Fileurl+'" target="_blank" style="text-decoration:underline;font-weight: bold;">'+data[i].Filename+'</a>');
			$('#ObservationAttachmentId').append('<br/><a href="'+data[i].Fileurl+'" target="_blank" style="text-decoration:underline;font-weight: bold;">'+data[i].Filename+'</a>');
			}       
		
				

					}
	}
	else
	{
		$('#ClosureFormId').empty();
	}
	
	fileID='';
	HideLoader();

}

function GetClosureAttachmentsFailure()
{
	fileID='';
	HideLoader();

}


function DeleteClosureFormAttachment(obj)
{
	ShowLoader();
	var filename=$(obj).attr('data-filename');
	var ItemId=$(obj).attr('data-ItemId');
	DeleteRequestAttachment(filename,ItemId,DeleteClosureFormAttachmentSuccess,DeleteClosureFormAttachmentFailure);
}


function DeleteClosureFormAttachmentSuccess(data)
{
	//TotalFuctionLoader++;
 GetObservationAttachments($('#hdnClosureAttachmentsID').val(),GetClosureAttachmentsSuccess,GetClosureAttachmentsFailure);


}

function DeleteClosureFormAttachmentFailure(data)
{
	HideLoader();
}
