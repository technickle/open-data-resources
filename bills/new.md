---
layout: default
---

<div class="btn-group pull-right">
  <button type="button" class="btn btn-default dropdown-toggle glyphicon glyphicon-cog" data-toggle="dropdown"> <span class="caret"></span></button>
  <ul class="dropdown-menu" role="menu">
    <li><a id="changeAPIKey-button">API Key</a></li>
    <li><a id="clearAll-button">Clear all data</a></li>
  </ul>
</div>

<div class="page-header">
  <h3>Legislative Bill Monitor <small>(See also <a href="{{site.baseUrl}}/laws">laws</a>)</small></h3>
  <ul class="nav nav-pills">
    <li role="presentation"><a>Favorites</a></li>
    <li role="presentation" class="active"><a>Recent Actions</a></li>
  </ul>
</div>

<div class="panel panel-default">
  <div class="panel-heading">
    <div class="form-group" id="bill-lookup-formgroup">
      <label class="control-label" for="bill-lookup-input">Search keywords:</label>
      <div class="input-group">
        <input type="text" class="form-control" id="bill-lookup-input" placeholder="enter a keyword" value="cyber">
        <span class="input-group-btn">
          <button type="submit" id="bill-lookup-button" class="btn btn-primary pull-right">Go</button>
        </span>
      </div>
      <h3>Search results <small>(sorted by most recent activity)</small>
      <span class="label label-primary pull-right" id="bills-count">0</span></h3>
    </div>
  </div>
  <div class="panel-body">
    <div class="list-group" id="bills-list">
    </div>
  </div>
</div>

<div class="modal fade" id="apikey-modal">
  <div class="modal-dialog">
    <div class="modal-content">
      <form id="apikey-form">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">Configure API Key</h4>
        </div>
        <div class="modal-body">
          <p>This application uses the Sunlight Foundation's <a href="http://openstates.org/" target="_new">OpenStates</a> and/or <a href="http://opencivicdata.org/" target="_new">OpenCivicData</a> platform. To access this information, an API key is required. <a href="https://sunlightfoundation.com/api/accounts/register/" target="_new">Get an API key</a>.</p>
          <center></center>
          <br />
          <div class="form-group" id="apikey-formgroup">
            <label class="control-label" for="apikey-input">Sunlight Foundation API Key:</label>
            <input type="text" class="form-control" id="apikey-input" placeholder="Type or paste your API key here">
            <span id="apikey-errortext"></span>
          </div>
          <p class="text-muted"><small>Note: your API key is stored on your computer, and never shared. However, it may be observed by network administrators and others who have access to network traffic.</small></p>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-primary">Done</button>
        </div>
      </form>
    </div>
  </div>
</div>

<div class="modal container fade" id="bill-preview">
  <!--<div class="modal-dialog modal-lg">
    <div class="modal-content">-->
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="bill-id">S4037-2015</h4>
      </div>
      <div class="modal-body" id="bill-content">
        <pre id="bill-text">Loading...</pre>
      </div>
      <div class="modal-footer">
        <span class="pull-left">Some content in this view is loaded via <a href="https://developer.yahoo.com/yql">YQL</a> <a href="https://www.yahoo.com/?ilc=401" target="_blank"> <img src="https://poweredby.yahoo.com/purple.png" width="134" height="29"/></a></span>
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    <!-- </div>
  </div> -->
</div>

<script type="text/javascript" src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/bootstrap-modal/2.2.5/css/bootstrap-modal-bs3patch.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-modal/2.2.5/css/bootstrap-modal.css">

<script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/bootstrap-modal/2.2.5/js/bootstrap-modal.min.js"></script>
<script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/bootstrap-modal/2.2.5/js/bootstrap-modalmanager.min.js"></script>

<script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/bootstrap-tokenfield/0.12.0/bootstrap-tokenfield.min.js"></script>
<link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/bootstrap-tokenfield/0.12.0/css/bootstrap-tokenfield.min.css">

<script>
// bootstrap.js is loaded from _layouts/index.html


// **********************************************************view event handlers

// populate page content from source APIs
//    (also prompts for API key, etc, if no configuration/data saved locally)
$( document ).ready( function() {
  $("#bill-lookup-input").tokenfield();
  if (localStorage.openStatesAPIKey === undefined) {
    showAPIKeyModal();
  } else {
    // getBillActivity({q: "data OR technology OR cyber", updated_since: "2015-01-01"});
  }
});

// handler to load keyword results
$("#bill-lookup-button").click(function(){
  if (!$("#bill-lookup-input").val().length == 0) {
    $("#bills-list").empty();
    getBillActivity({q: $("#bill-lookup-input").val().replace(","," OR "), updated_since: "2015-01-01"});
  }
});

// handler to manually show API key config dialog
$("#changeAPIKey-button").click(function(){
    showAPIKeyModal();
});

// handler to select input text & set focus when API key config dialog is shown
$("#apikey-modal").on("shown.bs.modal", function(e){
  $("#apikey-input").select();  
  $("#apikey-input").focus();
});

// handler to check API key and then dismiss API key config dialog
$("#apikey-form").submit(function(e){
  e.preventDefault();
  validateAPIKey($("#apikey-input").val(),
    function(data, textStatus, jqXHR){
      localStorage.openStatesAPIKey = $("#apikey-input").val();
      $("#apikey-formgroup").removeClass("has-error");
      $("#apikey-errortext").removeClass("text-danger").text("");
      $("#apikey-modal").modal("hide");
    },
    function(jqXHR, textStatus, errorThrown){
      $("#apikey-formgroup").addClass("has-error");
      $("#apikey-errortext").addClass("text-danger").text("Error: incorrect API key, or error validating.");
      $("#apikey-input").select();  
      $("#apikey-input").focus();
  });
});

// handler to clear all locally-stored data
$("#clearAll-button").click(function(){
    clearAllData();
    location.reload();
});

// ********************************************************controllers/functions
// check the API key to see if it is valid
function validateAPIKey(key, success, error) {
  parameters = {apikey: key};
  $.getJSON("http://openstates.org/api/v1/metadata/ny/?" + encodeQueryData(parameters))
    .success(success)
    .error(error);
}

// display the API key config modal after local-loading stored API key
function showAPIKeyModal() {
  $("#apikey-input").val(localStorage.openStatesAPIKey);
  $("#apikey-modal").modal();
}

// display the Bill modal
//    pro tip: load in the content before displaying it!
function showBillModal(openStatesData) {
  $("body").modalmanager('loading');
  getBillHtml(openStatesData.bill_id.replace(/ /g,''), function(billHtml){
    $("#bill-id").text(openStatesData.bill_id);
    $("#bill-text").html(billHtml);
    $("#bill-preview").modal();
  })  
}

// retrieve bill text HTML fragment using YQL to drop the rest of the page
function getBillHtml(id, success, error) {
  assemblyParameters = {sh: "printbill", bn: id, term: "2015"};
  yqlParameters = {
    q: 'select * from html where url="http://assembly.state.ny.us/leg/?' + encodeQueryData(assemblyParameters) + '" and xpath="//body/pre"',
    format: "json"
  };
  $.get("https://query.yahooapis.com/v1/public/yql?" + encodeQueryData(yqlParameters))
    .success(function(data){success(data.query.results.pre)})
    .error(error);
}

// retrieve bill activity stream (and render it)
function getBillActivity(parameters,callback){
  parameters.state = "ny"
  parameters.type = "bill";
  parameters.apikey = localStorage.openStatesAPIKey;

  d3.json("http://openstates.org/api/v1/bills/?" + encodeQueryData(parameters), function(error, billData){
    if (error) return console.warn(error);
    if (billData == undefined) { alert("Unable to load data"); return; }
    d3.select("#bills-count").text(billData.length);
    billList = d3.select("#bills-list").selectAll("a").data(billData);
    billList
      .enter().append("a")
        .classed("list-group-item bill-event", true)
        .html(function(d) {
          return "<button class='btn btn-default glyphicon glyphicon-heart pull-right'></button><h4>"+ d.title + " (" + d.bill_id + ")</h4><p class='text-muted'>Updated: " + d.updated_at + "</p>"
        })
    billList.exit().remove();
    d3.select(".list-group").selectAll("a").sort(function(a,b) {
      return d3.descending(a.updated_at, b.updated_at);
    });
    $(".bill-event").click(function(obj){
      showBillModal(obj.currentTarget.__data__);
    });
  });
}

// clear all locally stored information - makes the app reset to first-time use
function clearAllData() {
  localStorage.removeItem("openStatesAPIKey");
  localStorage.removeItem("openStatesSearchTerms");
  localStorage.removeItem("lastUpdated");
}

// *************************************************************utility functions

// generate URL parameters string from JS object
function encodeQueryData(data)
{
   var ret = [];
   for (var d in data)
      ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
   return ret.join("&");
}

</script>
