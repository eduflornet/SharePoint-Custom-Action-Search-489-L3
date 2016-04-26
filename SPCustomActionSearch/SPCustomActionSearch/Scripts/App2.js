'use strict';

var results;
var context = SP.ClientContext.get_current();
var appWebURL = decodeURIComponent(getQueryStringParameter('SPAppWebUrl'));
$(function () { $("#cmdSearch").click(onSearch); });
function onSearch() {
    var queryUrl = appWebURL
    + "/_api/search/query?querytext='" + $("#txtSearchText").val() + "'";
    // No tokens or digests required since we are in the app web.
    $.ajax(
    {
        url: queryUrl,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: onQuerySuccess,
        error: onQueryFail
    }
    );
}

function onQuerySuccess(data) {
    $("#results").empty();
    if (data.d.query.PrimaryQueryResult != null)
        $.each(data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results
        , function () {
            $("#results").append('<tr>');
            $("#results").append('<td>' + getValue(this, 'Title') + '</td>');
            $("#results").append('<td>' + getValue(this, 'Author') + '</td>');
            $("#results").append('<td>' + getValue(this, 'Write') + '</td>');
            $("#results").append('<td>' + getValue(this, 'Path') + '</td>');
            $("#results").append('</tr>');
        });
}
function getValue(row, fldName) {
    var ret = null;
    $.each(row.Cells.results, function () {
        if (this.Key == fldName) {
            ret = this.Value;
        }
    });
    return ret;
}

function onQueryFail(sender, args) {
    $("#results").append('Query failed. Error:' + args.get_message());
}
function getQueryStringParameter(urlParameterKey) {
    var params = document.URL.split('?')[1].split('&');
    var strParams = '';
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split('=');
        if (singleParam[0] == urlParameterKey)
            return decodeURIComponent(singleParam[1]);
    }
}