---
layout: default
---

#NYS Law

There are numerous statutes that confer confidentiality by exempting particular records from disclosure.
Below are brief references to some of the records and the statutes, provided for informational purposes only. Please note that this list is neither complete and authoritative, nor may it be completely up-to-date.

<div id="laws-div"></div>
<script type="text/javascript" src="//code.jquery.com/jquery-2.1.3.min.js"></script>
<script type="text/javascript" src="//cdn.datatables.net/1.10.4/js/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="js/jquery-csv.0.71.js"></script>
<link rel="stylesheet" type="text/css" href="//cdn.datatables.net/1.10.4/css/jquery.dataTables.min.css">

<script type="text/javascript">

  $( document ).ready(function() {
    $.ajax("nys-data-laws.csv", {
      success: function(returnedData, textStatus, jqXHR) {
        csvData = $.csv.toObjects(returnedData);
        console.log(csvData);
        $("#laws-div").html('<span id="laws_count"></span><table id="laws-table_table" cellpadding="0" cellspacing="0" border="0" class="display" width="100%"></table>');
        $("#dc_table").DataTable({
          // "ajax": webUrl,   // loading data this way doesn't work. Maybe a jquery version compatability issue?
          "data": returnedData,
          "paging": false,
          "processing": true,  // only useful if DataTable's ajax handler is used
          "order": [[1, "asc"]],
          "columns": [
            {"title": "Source", "data": "Source"},
            {"title": "Law/Act", "data": "Law or Act"},
            {"title": "Section, Subsection(s)", "data": "Section, Subsection(s)"},
            {"title": "Description", "data":"Description"},
            {"title": "Notes", "data": "Notes"}

            //{"title":"Title", "data": "title", "render": function(data, type, full, meta){
            //  if (full.landingPage) { return '<a href="' + full.landingPage + '" target="_new">' + data + '</a>'}
            //    else {return data}
            //  }},
          ]
        });
        $("#laws_count").text('Total items: ' + $("#laws_table").DataTable().rows()[0].length);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert("unable to load CSV data file: " + errorThrown);
      }
    });
  });
  
</script>
