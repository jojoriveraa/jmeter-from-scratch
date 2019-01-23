/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6898106060606061, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6825, 500, 1500, "http://blazedemo.com/purchase.php-0"], "isController": false}, {"data": [0.49916666666666665, 500, 1500, "http://blazedemo.com/-4"], "isController": false}, {"data": [0.9458333333333333, 500, 1500, "http://blazedemo.com/purchase.php-3"], "isController": false}, {"data": [0.6025, 500, 1500, "http://blazedemo.com/-5"], "isController": false}, {"data": [0.9366666666666666, 500, 1500, "http://blazedemo.com/purchase.php-4"], "isController": false}, {"data": [0.9991666666666666, 500, 1500, "http://blazedemo.com/purchase.php-1"], "isController": false}, {"data": [0.925, 500, 1500, "http://blazedemo.com/purchase.php-2"], "isController": false}, {"data": [0.42333333333333334, 500, 1500, "http://blazedemo.com/reserve.php"], "isController": false}, {"data": [0.9325, 500, 1500, "http://blazedemo.com/purchase.php-5"], "isController": false}, {"data": [0.105, 500, 1500, "http://blazedemo.com/"], "isController": false}, {"data": [0.49666666666666665, 500, 1500, "http://blazedemo.com/-0"], "isController": false}, {"data": [0.8558333333333333, 500, 1500, "http://blazedemo.com/-1"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.59, 500, 1500, "http://blazedemo.com/-2"], "isController": false}, {"data": [0.5716666666666667, 500, 1500, "http://blazedemo.com/-3"], "isController": false}, {"data": [0.89, 500, 1500, "http://blazedemo.com/reserve.php-5"], "isController": false}, {"data": [0.885, 500, 1500, "http://blazedemo.com/reserve.php-4"], "isController": false}, {"data": [0.955, 500, 1500, "http://blazedemo.com/reserve.php-1"], "isController": false}, {"data": [0.61, 500, 1500, "http://blazedemo.com/reserve.php-0"], "isController": false}, {"data": [0.885, 500, 1500, "http://blazedemo.com/reserve.php-3"], "isController": false}, {"data": [0.48333333333333334, 500, 1500, "http://blazedemo.com/purchase.php"], "isController": false}, {"data": [0.9016666666666666, 500, 1500, "http://blazedemo.com/reserve.php-2"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 12600, 0, 0.0, 673.1211111111126, 16, 14597, 1073.0, 1560.949999999999, 5381.809999999996, 20.62915652945549, 181.8996342417803, 18.175223196013008], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["http://blazedemo.com/purchase.php-0", 600, 0, 0.0, 611.4716666666662, 453, 14078, 646.0, 744.0, 3300.94, 1.0142485010252362, 4.167423941399257, 0.6140957721051234], "isController": false}, {"data": ["http://blazedemo.com/-4", 600, 0, 0.0, 961.1750000000001, 632, 3773, 1104.9, 1177.8999999999999, 1343.6500000000003, 1.0229812743277735, 27.319647335730522, 0.41159012209281515], "isController": false}, {"data": ["http://blazedemo.com/purchase.php-3", 600, 0, 0.0, 422.95499999999987, 214, 3195, 502.9, 549.8999999999999, 719.9300000000001, 1.0143188003989654, 0.11094111879363684, 0.5794692365560495], "isController": false}, {"data": ["http://blazedemo.com/-5", 600, 0, 0.0, 559.1749999999997, 312, 3370, 657.9, 713.5999999999995, 958.2700000000007, 1.0231853807272802, 1.3948894448196125, 0.4136706519737246], "isController": false}, {"data": ["http://blazedemo.com/purchase.php-4", 600, 0, 0.0, 442.76499999999976, 214, 3410, 513.9, 567.8999999999999, 1190.9100000000037, 1.0142845068041586, 0.11093736793170485, 0.5784591327867468], "isController": false}, {"data": ["http://blazedemo.com/purchase.php-1", 600, 0, 0.0, 168.83499999999998, 17, 996, 277.0, 314.0, 376.99, 1.015125367982946, 0.1387866714039184, 0.5967826870368491], "isController": false}, {"data": ["http://blazedemo.com/purchase.php-2", 600, 0, 0.0, 439.43999999999977, 213, 3436, 517.9, 577.7499999999997, 902.9100000000001, 1.0143445221169372, 0.11094393210654, 0.5775027894474358], "isController": false}, {"data": ["http://blazedemo.com/reserve.php", 600, 0, 0.0, 1726.3783333333317, 884, 7938, 6178.899999999998, 6859.899999999999, 7490.95, 1.0235414534288638, 4.5728047168201975, 3.4434573311156598], "isController": false}, {"data": ["http://blazedemo.com/purchase.php-5", 600, 0, 0.0, 448.6149999999999, 213, 3439, 513.9, 559.9499999999999, 902.9100000000001, 1.0143119414944872, 0.11094036860095954, 0.5804558571443061], "isController": false}, {"data": ["http://blazedemo.com/", 600, 0, 0.0, 1614.773333333334, 1211, 4769, 1794.6999999999998, 1914.85, 2838.4900000000034, 1.021269642419456, 85.20867683720026, 2.4614194116125168], "isController": false}, {"data": ["http://blazedemo.com/-0", 600, 0, 0.0, 629.7766666666661, 532, 3731, 682.9, 789.7999999999997, 1281.2400000000016, 1.0226656803624328, 3.8129550595958426, 0.38749441794982803], "isController": false}, {"data": ["http://blazedemo.com/-1", 600, 0, 0.0, 347.32, 29, 947, 573.8, 600.8499999999998, 796.9000000000001, 1.0242158773945313, 32.84115537312184, 0.43009065164028176], "isController": false}, {"data": ["Test", 600, 0, 0.0, 4476.749999999996, 3124, 17260, 8863.3, 9463.55, 10183.1, 1.0073486080960607, 93.26516101628043, 9.318958363763656], "isController": true}, {"data": ["http://blazedemo.com/-2", 600, 0, 0.0, 655.0233333333339, 429, 3501, 761.8, 797.7999999999997, 961.9100000000001, 1.0230981458051271, 9.377283986680968, 0.4106380253182688], "isController": false}, {"data": ["http://blazedemo.com/-3", 600, 0, 0.0, 678.2466666666661, 437, 3490, 782.9, 833.7499999999997, 1022.7800000000002, 1.0228888426694671, 10.644352111263883, 0.41255184767821285], "isController": false}, {"data": ["http://blazedemo.com/reserve.php-5", 600, 0, 0.0, 472.93333333333413, 214, 1385, 701.3999999999996, 907.5499999999994, 1310.5600000000004, 1.0249489660827305, 0.11210379316529864, 0.5755328666968458], "isController": false}, {"data": ["http://blazedemo.com/reserve.php-4", 600, 0, 0.0, 484.403333333333, 215, 6164, 710.9, 859.8999999999999, 1162.8600000000001, 1.0248789361756643, 0.1120961336442133, 0.573491826590484], "isController": false}, {"data": ["http://blazedemo.com/reserve.php-1", 600, 0, 0.0, 224.94666666666652, 16, 5950, 470.9, 617.9499999999999, 1108.96, 1.0256708314600596, 0.14022843398868, 0.5919643177664993], "isController": false}, {"data": ["http://blazedemo.com/reserve.php-0", 600, 0, 0.0, 1166.214999999999, 452, 6766, 5011.899999999999, 6073.5999999999985, 6534.82, 1.024362760999095, 3.9882657111638466, 0.5601983849213802], "isController": false}, {"data": ["http://blazedemo.com/reserve.php-3", 600, 0, 0.0, 481.71500000000026, 215, 6133, 715.9, 857.8499999999998, 1308.4500000000014, 1.025271226959165, 0.11213904044865869, 0.5747125822993757], "isController": false}, {"data": ["http://blazedemo.com/purchase.php", 600, 0, 0.0, 1135.598333333332, 883, 14597, 1202.8, 1293.7999999999997, 3874.99, 1.0133748591831186, 4.7457330980685075, 3.52306103387881], "isController": false}, {"data": ["http://blazedemo.com/reserve.php-2", 600, 0, 0.0, 463.7816666666668, 213, 6165, 694.3999999999999, 830.8499999999998, 1138.8300000000002, 1.0249121991882697, 0.11209977178621697, 0.5725095487653223], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 12600, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
