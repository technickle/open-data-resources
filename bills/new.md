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
  <div class="panel-heading">Bills <span class="label label-primary pull-right" id="bills-count">0</span></div>
  <div class="panel-body">
    <div class="form-group" id="bill-lookup-formgroup">
      <label class="control-label" for="bill-lookup-input">Bill ID Lookup</label>
      <input type="text" class="form-control" id="bill-lookup-input" placeholder="Example: 'S 3407' or 'A 2118'">
      <button type="submit" id="bill-lookup-button" class="btn btn-default">Go</button>
    </div>
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
          <p>This application uses the Sunlight Foundation's <a href="http://openstates.org/" target="_new">OpenStates</a> and/or <a href="http://opencivicdata.org/" target="_new">OpenCivicData</a> platform to monitor legislative bills. To access this information, an API key is required. If you do not have one, use the link below to get one, then return here and supply it below.</p>
          <center></center>
          <br />
          <div class="form-group" id="apikey-formgroup">
            <label class="control-label" for="apikey-input">Sunlight Foundation API Key:</label> (<a href="https://sunlightfoundation.com/api/accounts/register/" target="_new">obtain an API key</a>)
            <input type="text" class="form-control" id="apikey-input" placeholder="Type or paste your API key here">
            <span id="apikey-errortext"></span>
          </div>
          <br />
          <p class="text-muted">Note: your API key is stored on your computer, and never shared. However, it may be observed by network administrators and others who have access to network traffic.</p>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-primary">Done</button>
        </div>
      </form>
    </div>
  </div>
</div>

<div class="modal fade" id="bill-preview">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
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
    </div>
  </div>
</div>

<script type="text/javascript" src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script>
// bootstrap.js is loaded from _layouts/index.html


// **********************************************************view event handlers

// populate page content from source APIs
//    (also prompts for API key, etc, if no configuration/data saved locally)
$( document ).ready( function() {
  if (localStorage.openStatesAPIKey === undefined) {
    showAPIKeyModal();
  } else {
    d3.json("http://openstates.org/api/v1/bills/?q=cyber&state=ny&updated_since=2015-01-01&type=bill&apikey=" + localStorage.openStatesAPIKey, function(error, billData){
      if (error) return console.warn(error);
      if (billData == undefined) { alert("Unable to load data"); return; }
      d3.select("#bills-count").text(billData.length);
      d3.select("#bills-list").selectAll("a").data(billData)
        .enter().append("a")
          // .attr("href", function(d) { return d.link })
          .classed("list-group-item", true)
          .html(function(d) {
            return "<button class='btn btn-default glyphicon glyphicon-heart pull-right'></button><h4>"+ d.title + " (" + d.bill_id + ")</h4><p class='text-muted'>Updated: " + d.updated_at + "</p>"
          });
      d3.select(".list-group").selectAll("a").sort(function(a,b) {
        return d3.descending(a.updated_at, b.updated_at);
      });

    })
  // showBillModal({bill_id: "S 4072"})
  }
});

// handler to perform bill lookup based upon text input
$("#bill-lookup-button").click(function() {
  showBillModal({bill_id: $("#bill-lookup-input").val()})
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
  $.getJSON("http://openstates.org/api/v1/metadata/ny/?apikey=" + key)
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
  getBillHtml(openStatesData.bill_id.replace(/ /g,''), function(billHtml){
    $("#bill-id").text(openStatesData.bill_id);
    $("#bill-text").html(billHtml);
    $("#bill-preview").modal();
  })  
}

// retrieve bill text HTML fragment using YQL to drop the rest of the page
function getBillHtml(id, success, error) {
  $.get("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fassembly.state.ny.us%2Fleg%2F%3Fsh%3Dprintbill%26bn%3D" + id + "%22%20and%20xpath%3D%22%2F%2Fbody%2Fpre%22&format=json")
    .success(function(data){success(data.query.results.pre)})
    .error(error);
}


function loadBillActivity(keywords,updated_since,callback){
  //
}

// clear all locally stored information - makes the app reset to first-time use
function clearAllData() {
  localStorage.removeItem("openStatesAPIKey");
  localStorage.removeItem("openStatesSearchTerms");
  localStorage.removeItem("lastUpdated");
}

</script>
