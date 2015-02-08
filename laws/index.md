---
layout: default
laws-file: laws.csv
redirect_from: enacted-laws/
---

<h3>Laws <small>(See also <a href="{{site.baseUrl}}/bills">bills</a>)</small></h3>
<p>There are numerous statutes that govern how state records and data may or may not be used. Some confer confidentiality by exempting particular records from disclosure. Others mandate fully public online reporting. Below are references to SOME of the records and statutes, provided for informational purposes only.</p>

<div class="alert alert-danger">
  <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
  <span class="sr-only">Note:</span>
  Due to recent changes to the state's <a href="http://public.leginfo.state.ny.us/lawssrch.cgi?NVLWO:">legislative information site</a>, many of the links below are currently not working correctly. 
</div>

<div class="panel panel-default">
  <div class="panel-heading">
    Laws<span id="laws-count"></span>
    <span class="pull-right"><a href="{{site.baseUrl}}/laws/{{page.laws-file}}"><img src="https://raw.githubusercontent.com/BetaNYC/getDataButton/master/png/80x15.png" alt="download raw data"></a></span>
  </div>
  <div class="panel-body"></div>
  <div id="laws-div"></div>
</div>

<script type="text/javascript" src="//cdn.datatables.net/1.10.4/js/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="//cdn.datatables.net/responsive/1.0.3/js/dataTables.responsive.js"></script>
<script type="text/javascript" src="{{ site.baseUrl }}/js/jquery-csv.0.71.js"></script>
<link rel="stylesheet" type="text/css" href="//cdn.datatables.net/1.10.4/css/jquery.dataTables.min.css">
<link rel="stylesheet" type="text/css" href="//cdn.datatables.net/responsive/1.0.3/css/dataTables.responsive.css">

<script type="text/javascript">

  $( document ).ready(function() {
    $.ajax("{{site.baseUrl}}/laws/{{page.laws-file}}", {
      success: function(returnedData, textStatus, jqXHR) {
        $.csv.toObjects(returnedData, {}, function(err, csvData) {
          $("#laws-div").html('<table id="laws-table" cellpadding="0" cellspacing="0" border="0" class="display" width="100%"></table>');
          $("#laws-table").DataTable({
            // "ajax": webUrl,   // loading data this way doesn't work. Maybe a jquery version compatability issue?
            data: csvData,
            responsive: true,
            paging: false,
            processing: true,  // only useful if DataTable's ajax handler is used
            order: [[0,"asc"]],
            columns: [
              // {title: "Source", data: "source"},
              {title: "Law", data: "Law", render: function(data, type, full, meta){
                if (full.link) { return '<a href="' + full.link + '" target="_new">' + full.law + ' ' + full.section + '</a>' }
                  else { return full.law + ' ' + full.section }
              }},
              {title: "Description", data:"description"},
              {title: "Note(s)", data:"notes"},
              {title: "Requirement(s)", data:"requires"},
            ]
          });
          $("#laws-count").text(': ' + $("#laws-table").DataTable().rows()[0].length);
        });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert("unable to load CSV data file: " + errorThrown);
      }
    });
  });
  
</script>
