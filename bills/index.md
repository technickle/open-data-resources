---
layout: default
bills_file: bills.csv
redirect_from: legislative-actions/
---

## Legislative actions related to technology, data, reporting and/or transparency

This is not intended to be an exhaustive list - for example, it does not list STEM education items. See also [enacted laws]({{ site.baseUrl}}/enacted-laws) for laws which are already in effect. ([Download as raw data]({{site.baseUrl}}/bills/{{page.bills_file}}))

<div id="actions-div"></div>
<script type="text/javascript" src="//cdn.datatables.net/1.10.4/js/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="{{ site.baseUrl}}/js/jquery-csv.0.71.js"></script>
<link rel="stylesheet" type="text/css" href="//cdn.datatables.net/1.10.4/css/jquery.dataTables.min.css">

<script type="text/javascript">

  $( document ).ready(function() {
    $.ajax("{{site.baseUrl}}/bills/{{page.bills_file}}", {
      success: function(returnedData, textStatus, jqXHR) {
        $.csv.toObjects(returnedData, {}, function(err, csvData) {
          $("#actions-div").html('<span id="actions-count"></span><table id="actions-table" cellpadding="0" cellspacing="0" border="0" class="display" width="100%"></table>');
          $("#actions-table").DataTable({
            // "ajax": webUrl,   // loading data this way doesn't work. Maybe a jquery version compatability issue?
            data: csvData,
            paging: false,
            processing: true,  // only useful if DataTable's ajax handler is used
            order: [[0, "asc"]],
            columns: [
              {title: "Bill(s)", render: function(data,type,full,meta) {
                identifiers = [];
                if (full.assemblyId !== "") {identifiers.push(full.assemblyId)}
                if (full.senateId !== "") {identifiers.push(full.senateId)}
                if (full.jointId !== "") {identifiers.push(full.jointId)}
                identifierText = identifiers.join(" / ");
                if (full.link) {return  '<a href="' + full.link + '" target="_new">' + identifierText + '</a>'}
                  else { return identifierText }
                return returnHtml;
              }, width:"10%"},
              {title: "Title", data: "title", width: "30%"},
              {title: "Notes", data: "notes", width: "60%"}
            ]
          });
          $("#actions-count").text('Total items: ' + $("#actions-table").DataTable().rows()[0].length);
        });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert("unable to load CSV data file: " + errorThrown);
      }
    });
  });
  
</script>
