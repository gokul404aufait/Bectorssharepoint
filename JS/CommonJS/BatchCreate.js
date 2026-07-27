function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
};
 
function addBatchRequest(JsonData,Listname,Success,Failure) {
    // generate a batch boundary
    var batchGuid = generateUUID();
    // creating the body
    var batchContents = new Array();
    var changeSetId = batchGuid;  //generateUUID();
    // get current host
    var temp = document.createElement('a');
    temp.href = _spPageContextInfo.webAbsoluteUrl;
    var host = temp.hostname;
    // iterate through each newUserResp
    for (var res = 0; res < JsonData.length; res++) {
 
        var newUserResp = JsonData[res];
 
        // create the request endpoint
        var endpoint = _spPageContextInfo.webAbsoluteUrl
                       + "/_api/web/lists/getbytitle('"+Listname+"')"
                       + "/items";
 
        // create the changeset
        batchContents.push('--changeset_' + changeSetId);
        batchContents.push('Content-Type: application/http');
        batchContents.push('Content-Transfer-Encoding: binary');
        batchContents.push('');
        batchContents.push('POST ' + endpoint + ' HTTP/1.1');
        batchContents.push('Content-Type: application/json;odata=verbose');
        batchContents.push('');
        batchContents.push(JSON.stringify(newUserResp));
        batchContents.push('');
    }
    // END changeset to create data
    batchContents.push('--changeset_' + changeSetId + '--');
 
 
    // batch body
    var batchBody = batchContents.join('\r\n');
 
    batchContents = new Array();
 
    // create batch for creating items
    batchContents.push('--batch_' + batchGuid);
    batchContents.push('Content-Type: multipart/mixed; boundary="changeset_' + changeSetId + '"');
    batchContents.push('Content-Length: ' + batchBody.length);
    batchContents.push('Content-Transfer-Encoding: binary');
    batchContents.push('');
    batchContents.push(batchBody);
    batchContents.push('');
 
  
    batchContents.push('--batch_' + batchGuid + '--');
 
    batchBody = batchContents.join('\r\n');
 
    // create the request endpoint
    return getFormDigest(WebAbsoluteUrl).then(function (data1) {

	    var endpoint = _spPageContextInfo.webAbsoluteUrl + '/_api/$batch';
	 
	       var batchRequestHeader = {
	        'X-RequestDigest': data1.d.GetContextWebInformation.FormDigestValue, //$("#__REQUESTDIGEST").val(),
	        'Content-Type': 'multipart/mixed; boundary="batch_' + batchGuid + '"'
	    };
	 
	    // create request
	    $.ajax({
	        url: endpoint,
	        type: 'POST',
	        headers: batchRequestHeader,
	        data: batchBody,
	        success: function (response) {
	        
				var responseInLines = response.split('\n');
				Success(responseInLines );
				//alert(responseInLines );
	            
	        },
	        fail: function (error) {
	        //alert('error' );
	        Failure(error);
	             
	        }
	    });
    
    });
    
}
