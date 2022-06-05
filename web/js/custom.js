function sendAjax(sdo_id, month, endPoint, selector) {
    $.ajax({
        url: baseUrl + endPoint,
        type: "Post",
        data: {
            sdo_id: sdo_id,
            month: month,
        },
        beforeSend: function () {

        },
        success: function (data) {
            $(selector).val(data);
        },
        error: function (xhr, exception) {

        },
        complete: function () {

        }
    });
}

$(function () {
    //Initialize Select2 Elements
    $('.select2').select2();

    $('.custom_datepicker').datepicker({
        format: 'M-yyyy',
        orientation: 'auto bottom',
        autoclose: true,
        minViewMode: "months"
    });
    $('#only_year').datepicker({
        autoclose: true,
        format: "yyyy", viewMode: "years", minViewMode: "years"
    });
    $('.only_year').datepicker({
        autoclose: true,
        format: "yyyy", viewMode: "years", minViewMode: "years"
    });


    //get senior engineers of chief
    $("#chiefs").change(function () {
        let chief_id = $(this).val();
        $.ajax({
            url: baseUrl + '/site/get-all-ses',
            type: "Post",
            data: {
                chief_id: chief_id
            },
            beforeSend: function () {
                $("label[for='ses']").append("<span class='fa fa-spinner fa-spin fa-fw'></span>");
            },
            success: function (response) {
                let data = (response);
                let len = data.length;
                $("#ses").empty().append("<option value=''>Select Option</option>");
                for (let i = 0; i < len; i++) {
                    let id = data[i]['user_id'];
                    let name = data[i]['user_name'];
                    let circle = data[i]['circle_name'];
                    let circle_id = data[i]['circle_id'];
                    $("#ses").append("<option value='" + id + '|' + circle_id + "'>" + name + " | " + circle + "</option>");
                }
            },
            error: function (xhr, exception) {

            },
            complete: function () {
                $("label[for='ses']").text("SE");
            }
        });
    });


    //get xens of SE
    $("#ses").change(function () {
        let se_id = $(this).val();
        $.ajax({
            url: baseUrl + '/site/get-all-xens',
            type: "Post",
            data: {
                se_id: se_id
            },
            beforeSend: function () {
                $("label[for='xens']").append("<span class='fa fa-spinner fa-spin fa-fw'></span>");

            },
            success: function (response) {
                let data = (response);
                let len = data.length;
                $("#xens").empty().append("<option value=''>Select Option</option>");
                for (let i = 0; i < len; i++) {
                    let id = data[i]['user_id'];
                    let name = data[i]['user_name'];
                    let division = data[i]['div_name'];
                    let division_id = data[i]['div_id'];
                    $("#xens").append("<option value='" + id + '|' + division_id + "'>" + name + " | " + division + "</option>");
                }
            },
            error: function (xhr, exception) {

            },
            complete: function () {
                $("label[for='xens']").text("XEN");
            }
        });
    });


    //get sdos of XEN
    $("#xens").change(function () {
        let xen_id = $(this).val();
        if (xen_id != "")
            $.ajax({
                url: baseUrl + '/site/get-all-sdos',
                type: "Post",
                data: {
                    xen_id: xen_id
                },
                beforeSend: function () {
                    $("label[for='sdos']").append("<span class='fa fa-spinner fa-spin fa-fw'></span>");

                },
                success: function (response) {
                    let data = (response);
                    let len = data.length;
                    $("#sdos").empty().append("<option value=''>Select Option</option>");
                    for (let i = 0; i < len; i++) {
                        let id = data[i]['id'] + '|' + data[i]['sub_div_id'];
                        let name = data[i]['name'];
                        let sub_division = data[i]['sub_div_name'];
                        $("#sdos").append("<option value='" + id + "'>" + name + " | " + sub_division + "</option>");
                    }
                },
                error: function (xhr, exception) {

                },
                complete: function () {
                    $("label[for='sdos']").text("SDO");

                }
            });
    });

    $(".custom_datepicker,#sdos").change(function () {
        let month = $(".custom_datepicker").val();
        let sdo_id = $("#sdos").val();
        sendAjax(sdo_id, month, '/commercial-return/load-corresponding-losses', "#corresponding_month_losses");
        sendAjax(sdo_id, month, '/commercial-return/load-corresponding-loss-target', "#loss_target");
    });
    $(".custom_datepicker, #sdos,#loss_target").change(function () {


        setTimeout(function () {
            let loss_target = $("#loss_target").val();
            let month = $("#month").val();
            let sdo_id = $("#sdos").val();
            $.ajax({
                url: baseUrl + '/commercial-return/load-revenue-target',
                type: "Post",
                data: {
                    loss_target: loss_target,
                    sdo_id: sdo_id,
                    month: month
                },
                beforeSend: function () {

                },
                success: function (data) {
                    $("#revenue_target").val(data);
                },
                error: function (xhr, exception) {

                },
                complete: function () {

                }
            });
        }, 1000)

    });

    $("#unit_purchased,#unit_sold").keyup(function () {
        let unit_sold = $("#unit_sold").val()
        let unit_purchased = $("#unit_purchased").val()
        let losses = 0;
        if (unit_sold == null || unit_sold === 0 || unit_sold === '' || unit_sold === undefined)
            losses = 0;
        else
            losses = (unit_purchased - unit_sold) / unit_purchased * 100;
        $("#losses").val(losses.toFixed(2))
    });

});

function getTopOfficer(url, officer_type) {
    $.ajax({
        url: url,
        data: {
            officer_type: officer_type,
        },
        type: "Post",
        beforeSend: function () {

            let loader_html = "<div class='overlay'>" +
                "              <i class='fa fa-refresh fa-spin'></i>" +
                "            </div>";

            $("#" + officer_type + "_chart").html(loader_html);
        },
        success: function (data) {
            top3OfficerChart(data, officer_type)

        },
        error: function (xhr, exception) {

            let err_loader = "Some error occured, Please contact administrator";
            err_loader += "<div class='overlay'>" +
                "              <i class='fa fa-exclamation-triangle fa-fw fa-16x' style='color:red'></i>" +
                "            </div>";

            $("#" + officer_type + "_chart").html(err_loader);
            $("#box_" + officer_type).removeClass("box-success").addClass("box-danger");
        },
        complete: function () {

        }
    });

}

function getMissingSubDivisionsDataNotification() {
    $.ajax({
        url: baseUrl + '/dashboard/get-missing-sub-divisions-data',
        type: "Post",
        beforeSend: function () {

        },
        success: function (data) {
            $("#missing-sub-divisions-data-notification").html(data.message).attr('title', data.message)
            let random_number = Math.floor(Math.random() * 100) + 1
            if (random_number % 5 == 0 && (logged_in_user_role == 'super-admin' || logged_in_user_role == 'admin'))
                new PNotify({
                    title: 'Commercial Data Missing',
                    type: 'danger',
                    text: `This month <strong> ${data.count} </strong> offices has not entered data, <a href="${baseUrl + '/notification'}" class="alert-link">view details</a>.`,
                    icon: 'assets/images/pnotify/warning.png', buttons: {
                        closer: true,
                        sticker: true
                    }
                });
        },
        error: function (xhr, exception) {

        },
        complete: function () {

        }
    });
}

$(function () {
    getMissingSubDivisionsDataNotification()
});

function top3OfficerChart(data, target) {

    // setUpLinearGradient();
    // setUpRadialGradient();
    Highcharts.chart(target + '_chart', {
        chart: {
            styledMode: true,
            type: 'column'
        },
        title: {
            text: 'Overview ' + data.interval.from + ' to ' + data.interval.to
        },
        subtitle: {
            text: target
        },

        xAxis: {
            type: 'category'
        },

        yAxis: [{
            title: {
                text: 'Million. Rs'
            }
        }],

        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true
                }
            }
        },

        series: data.series,
        drilldown: {
            activeAxisLabelStyle: {
                textDecoration: 'none',
            },
            activeDataLabelStyle: {
                textDecoration: 'none',
            },
            allowPointDrilldown: true,
            series: data.drill_down
        },

    });

}

function setUpLinearGradient() {


    // Give the points a 3D feel by adding a radial gradient
    const originalColors = Highcharts.getOptions().colors
    Highcharts.getOptions().colors = $.map(Highcharts.getOptions().colors, function (color) {
        return {
            radialGradient: {
                cx: 0.4,
                cy: 0.3,
                r: 0.5
            },
            stops: [
                [0, color],
                [1, Highcharts.Color(color).brighten(-0.2).get('rgb')]
            ]
        };
    });

}

function setUpRadialGradient() {
    let i = 0;
    Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function
        (color) {
        if (i === 0) {
            color = '#0F0';
        }
        if (i === 1) {
            color = '#00F';
        }
        if (i === 2) {
            color = '#F00';
        }
        i++;
        return {
            radialGradient: {cx: 0.5, cy: 0.3, r: 0.7},
            stops: [
                [0, color],
                [1, Highcharts.Color(color).brighten(-0.4).get('rgb')] // darken
            ]
        };
    });
}

function targetStatsOfficerWise() {
    // console.log("Logging as  = " + logged_in_user_role)
    if (logged_in_user_role !== 'super-admin' && logged_in_user_role !== 'admin') {
        $.ajax({
            url: baseUrl + '/dashboard/target-stats-officer-wise',
            data: {
                officer_type: 1,
            },
            type: "Post",
            beforeSend: function () {

                var loader_html = "<div class='overlay'>" +
                    "              <i class='fa fa-refresh fa-spin'></i>" +
                    "            </div>";

                $(".targets_chart_loader").html(loader_html);
            },
            success: function (data) {
                renderTargetsGraph(data);
                renderTargetsTable(data);
                $(".targets_chart_loader").remove();


            },
            error: function (xhr, exception) {

                var err_loader = "Some error occurred, Please contact administrator";
                err_loader += "<div class='overlay'>" +
                    "              <i class='fa fa-exclamation-triangle fa-fw fa-16x' style='color:red'></i>" +
                    "            </div>";

                $(".targets_chart_loader").html(err_loader);
            },
            complete: function () {
                $(".targets_chart_loader").remove();
            }
        });
    }

}

function regionStats() {
    $.ajax({
        url: baseUrl + '/dashboard/get-region-stats',
        data: {
            officer_type: 1,
        },
        type: "Post",
        beforeSend: function () {

            var loader_html = "<div class='overlay'>" +
                "              <i class='fa fa-refresh fa-spin'></i>" +
                "            </div>";

            $(".region_chart_loader").html(loader_html);
        },
        success: function (data) {
            renderRegionGraph(data);
            $(".region_chart_loader").remove();


        },
        error: function (xhr, exception) {

            var err_loader = "Some error occurred, Please contact administrator";
            err_loader += "<div class='overlay'>" +
                "              <i class='fa fa-exclamation-triangle fa-fw fa-16x' style='color:red'></i>" +
                "            </div>";

            $(".region_chart_loader").html(err_loader);
        },
        complete: function () {
            $(".region_chart_loader").remove();
        }
    });
}

function renderTargetsGraph(data) {
    setUpRadialGradient();
    Highcharts.chart('targets_chart', {

        chart: {
            type: 'column',

        },
        title: {
            text: ''
        },

        subtitle: {
            text: ''
        },

        yAxis: {
            title: {
                text: 'Millions Rs.'
            }
        },

        xAxis: {
            categories: data.categories
        },
        series: data.series,
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }

    });

}

function renderTargetsTable(data) {

    let thead = '<thead><tr>';
    thead += '<th>Month</th>';
    for (let i = 0; i < data.categories.length; i++) {
        thead += "<th>" + data.categories[i] + "</th>";
    }
    thead += '</tr></thead>';
    $('.targets-table').append(thead);

    for (let i = 0; i < data.series.length; i++) {
        var targets = data.series[i];
        let tbody = '<tbody><tr>';
        tbody += '<th>' + data.series[i].name + '</th>';
        for (var j = 0; j <= targets.data.length - 1; j++) {
            tbody += "<td>" + data.series[i].data[j] + "</td>";
        }
        tbody += "</tr><tbody>";
        $('.targets-table').append(tbody);
    }
}

function renderRegionGraph(data) {
    setUpRadialGradient();
    Highcharts.chart('region_chart', {

        chart: {
            type: 'column',

        },
        title: {
            text: ''
        },

        subtitle: {
            text: ''
        },

        yAxis: {
            title: {
                text: 'Millions Rs.'
            }
        },

        xAxis: {
            categories: data.categories
        },
        series: data.series,
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }

    });

}

function revenueTargetComparison() {
    $.ajax({
        url: baseUrl + '/dashboard/revenue-target-comparison',
        type: "Post",
        beforeSend: function () {

            var loader_html = "<div class='overlay revenue_target_comparison_loader'>" +
                "              <i class='fa fa-refresh fa-spin'></i>" +
                "            </div>";

            $(".revenue_target_comparison").append(loader_html);
        },
        success: function (data) {
            $(".current_revenue_target").html(data.current_fiscal_year_revenue_target);
            $(".current_revenue_target_change").text(data.change_in_revenue + "%").addClass(data.color_class);
            $(".current_revenue_caret").removeClass("fa-caret-up").addClass(data.caret_icon).addClass(data.color_class);
            $(".revenue_target_comparison_label").html("Revenue Target");
            $(".revenue_target_comparison_loader").remove();

        },
        error: function (xhr, exception) {

            var err_loader = "<i title='Something went wrong' class='fa fa-exclamation-triangle fa-fw fa-16x' style='color:red'></i>";
            $(".revenue_target_comparison_loader").html(err_loader);

        },
        complete: function () {
        }
    });
}

function lossTargetComparison() {
    $.ajax({
        url: baseUrl + '/dashboard/loss-target-comparison',
        type: "Post",
        beforeSend: function () {

            var loader_html = "<div class='overlay loss_target_comparison_loader'>" +
                "              <i class='fa fa-refresh fa-spin'></i>" +
                "            </div>";

            $(".loss_target_comparison").append(loader_html);
        },
        success: function (data) {
            $(".current_loss_target").html(data.current_fiscal_year_loss_target);
            $(".current_loss_target_change").text(data.change_in_loss + "%").addClass(data.color_class);
            $(".current_loss_caret").removeClass("fa-caret-up").addClass(data.caret_icon).addClass(data.color_class);
            $(".loss_target_comparison_label").html("Loss Target");
            $(".loss_target_comparison_loader").remove();

        },
        error: function (xhr, exception) {

            var err_loader = "<i title='Something went wrong' class='fa fa-exclamation-triangle fa-fw fa-16x' style='color:red'></i>";

            $(".loss_target_comparison_loader").html(err_loader);
        },
        complete: function () {

        }
    });
}

function revenueRealizedComparison() {
    $.ajax({
        url: baseUrl + '/dashboard/revenue-realized-comparison',
        type: "Post",
        beforeSend: function () {

            var loader_html = "<div class='overlay revenue_realized_comparison_loader'>" +
                "              <i class='fa fa-refresh fa-spin'></i>" +
                "            </div>";

            $(".revenue_realized_comparison").append(loader_html);
        },
        success: function (data) {
            $(".current_revenue_realized").html(data.current_fiscal_year_revenue_realized);
            $(".current_revenue_realized_change").text(data.change_in_revenue_realized + "%").addClass(data.color_class);
            $(".current_revenue_realized_caret").addClass(data.caret_icon).addClass(data.color_class);
            $(".revenue_realized_comparison_label").html("Revenue Realized");
            $(".revenue_realized_comparison_loader").remove();

        },
        error: function (xhr, exception) {

            var err_loader = "<i title='Something went wrong' class='fa fa-exclamation-triangle fa-fw fa-16x' style='color:red'></i>";

            $(".revenue_realized_comparison_loader").html(err_loader);
        },
        complete: function () {

        }
    });
}

function lossesComparison() {
    $.ajax({
        url: baseUrl + '/dashboard/losses-comparison',
        type: "Post",
        beforeSend: function () {

            var loader_html = "<div class='overlay losses_comparison_loader'>" +
                "              <i class='fa fa-refresh fa-spin'></i>" +
                "            </div>";

            $(".losses_comparison").append(loader_html);
        },
        success: function (data) {
            $(".current_losses").html(data.current_fiscal_year_losses);
            $(".current_losses_change").text(data.change_in_losses + "%").addClass(data.color_class);
            $(".current_losses_caret").addClass(data.caret_icon).addClass(data.color_class);
            $(".losses_comparison_label").html("Losses");
            $(".losses_comparison_loader").remove();

        },
        error: function (xhr, exception) {

            var err_loader = "<i title='Something went wrong' class='fa fa-exclamation-triangle fa-fw fa-16x' style='color:red'></i>";

            $(".losses_comparison_loader").html(err_loader);
        },
        complete: function () {

        }
    });
}

$(function () {
    $(".data_table").DataTable()
    // $('input[name="CommercialReturnFilter[month]"]').DataTable();
    Pace.restart()
})

$(document).ready(function () {
    $("#show_hide_password a").on('click', function (event) {
        event.preventDefault();
        if ($('#show_hide_password input').attr("type") == "text") {
            $('#show_hide_password input').attr('type', 'password');
            $('#show_hide_password i').addClass("fa-eye-slash");
            $('#show_hide_password i').removeClass("fa-eye");
        } else if ($('#show_hide_password input').attr("type") == "password") {
            $('#show_hide_password input').attr('type', 'text');
            $('#show_hide_password i').removeClass("fa-eye-slash");
            $('#show_hide_password i').addClass("fa-eye");
        }
    });
})

$(function () {
    $("#office_dashboard").change(function () {
        let office_label = $('#office_dashboard option:selected').text()
        let office_type = $('#office_dashboard option:selected').parent().attr('label');
        let loader_html = "<div class='overlay'>" +
            "              <i class='fa fa-refresh fa-spin'></i>" +
            "            </div>";
        $.ajax({
            url: baseUrl + '/dashboard/target-stats-office-wise',
            type: "Post",
            data: {
                office: $("#office_dashboard").val(),
                origin: 'dashboard'
            },
            beforeSend: function () {

                var loader_html = "<div class='overlay revenue_realized_comparison_loader'>" +
                    "              <i class='fa fa-refresh fa-spin'></i>" +
                    "            </div>";

                $("#monthly-graph").html(loader_html);
            },
            success: function (data) {
                office_label = ' ' + office_type.slice(0, -1) + ' ' + office_label
                $("#office_label").html(office_label)
                var a, i = data, o = (AmCharts.makeChart("monthly-graph", {
                    type: "serial",
                    theme: "light",
                    dataDateFormat: "YYYY-MM-DD",
                    dataProvider: i,
                    addClassNames: !0,
                    marginLeft: 0,
                    categoryField: "date",
                    categoryAxis: {
                        parseDates: !0,
                        minPeriod: "MM",
                        autoGridCount: !1,
                        gridCount: 2000,
                        gridAlpha: .1,
                        gridColor: "#FFFFFF",
                        axisColor: "#555555",
                        dateFormats: [{period: "DD", format: "DD"}, {period: "WW", format: "MMM DD"}, {
                            period: "MM",
                            format: "MMM"
                        }, {period: "YYYY", format: "YYYY"}]
                    },
                    legend: {
                        "align": "center",
                        "position": "bottom",
                        "markerType": "circle",
                        "labelText": "[[title]]",
                        "valueText": " $[[value]] [[percents]]%",
                        "textClickEnabled": false
                    },
                    valueAxes: [
                        {
                            id: "a2",
                            position: "left",
                            title: "(%)",
                            gridAlpha: 0,
                            axisAlpha: 0,
                            labelsEnabled: 1
                        },
                        {
                            id: "a3",
                            title: "",
                            position: "right",
                            gridAlpha: 0,
                            axisAlpha: 0,
                            lineAlpha: 0,
                            fontSize: 0,
                            inside: !1,
                            labelsEnabled: 1
                        }
                    ],
                    graphs: [
                        {
                            id: "g2",
                            valueField: "losses",
                            title: "Losses",
                            type: "line",
                            valueAxis: "a2",
                            lineColor: "red",
                            lineThickness: 2,
                            dashLength: 3,
                            legendValueText: "[[value]]/[[description]]",
                            descriptionField: "townName",
                            bullet: "circle",
                            bulletSizeField: "townSize",
                            bulletBorderColor: "red",
                            bulletBorderAlpha: 1,
                            bulletBorderThickness: 2,
                            bulletColor: "red",
                            labelText: "[[townName2]]",
                            labelPosition: "right",
                            balloonText: "losses:[[value]] (%)",
                            showBalloon: !0,
                            animationPlayed: !0
                        }, {
                            id: "g3",
                            title: "Loss Target",
                            valueField: "loss_target",
                            type: "smoothedLine",
                            valueAxis: "a2",
                            lineColor: "blue", classNameField: "bulletClass",

                            balloonText: "Loss Target: [[value]] (%)",
                            lineThickness: 2,
                            legendValueText: "[[value]]",
                            bullet: "round",
                            bulletBorderColor: "blue",
                            bulletBorderThickness: 1,
                            bulletBorderAlpha: 1,
                            dashLengthField: "dashLength",
                            animationPlayed: !0
                        }]
                }))
            },
            error: function (xhr, exception) {

                var err_loader = "<div class='text-center' style='padding-top: 10%'> <i title='Something went wrong, while generating the comparison chart' class='fa fa-exclamation-triangle fa-fw' style='color:red; font-size:32px'></i></div>";

                $("#monthly-graph").html(err_loader);
            },
            complete: function () {
            }
        });
    })
    $('#office_dashboard').trigger('change');
})

$(function () {
    $("#office_dashboard_revenue_target_and_achievement").change(function () {
        let office_label = $('#office_dashboard_revenue_target_and_achievement option:selected').text()
        let office_type = $('#office_dashboard_revenue_target_and_achievement option:selected').parent().attr('label');
        let loader_html = "<div class='overlay'>" +
            "              <i class='fa fa-refresh fa-spin'></i>" +
            "            </div>";
        $.ajax({
            url: baseUrl + '/dashboard/revenue-target-and-achievement-graph',
            type: "Post",
            data: {
                office: $("#office_dashboard_revenue_target_and_achievement").val(),
                origin: 'dashboard'
            },
            beforeSend: function () {

                var loader_html = "<div class='overlay revenue_realized_comparison_loader'>" +
                    "              <i class='fa fa-refresh fa-spin'></i>" +
                    "            </div>";

                $("#office_dashboard_revenue_target_and_achievement_graph").html(loader_html);
            },
            success: function (data) {
                office_label = ' ' + office_type.slice(0, -1) + ' ' + office_label
                $("#office_label_revenue_target_and_achievement").html(office_label)
                var a, i = data, o = (AmCharts.makeChart("office_dashboard_revenue_target_and_achievement_graph", {
                    type: "serial",
                    theme: "light",
                    dataDateFormat: "YYYY-MM-DD",
                    dataProvider: i,

                    addClassNames: !0,
                    marginLeft: 0,
                    categoryField: "date",
                    categoryAxis: {
                        parseDates: !0,
                        minPeriod: "MM",
                        autoGridCount: !1,
                        gridCount: 2000,
                        gridAlpha: .1,
                        gridColor: "#FFFFFF",
                        axisColor: "#555555",
                        dateFormats: [{period: "DD", format: "DD"}, {period: "WW", format: "MMM DD"}, {
                            period: "MM",
                            format: "MMM"
                        }, {period: "YYYY", format: "YYYY"}]
                    },
                    legend: {
                        "align": "center",
                        "position": "bottom",
                        // "marginRight": 21,
                        "markerType": "circle",
                        "labelText": "[[title]]",
                        "valueText": " $[[value]] [[percents]]%",
                        "textClickEnabled": false
                    },
                    valueAxes: [
                        {id: "a11", title: "M.Rs", gridAlpha: 0, axisAlpha: 0},
                        {id: "a12", position: "right", title: "(%)", gridAlpha: 0, axisAlpha: 0, labelsEnabled: 1},
                        {
                            id: "a13",
                            title: "",
                            position: "left",
                            gridAlpha: 0,
                            axisAlpha: 0,
                            lineAlpha: 0,
                            fontSize: 0,
                            inside: !1
                        }
                    ],
                    graphs: [
                        {
                            id: "g11",
                            valueField: "revenue_target",
                            title: "Revenue Target",
                            type: "line",
                            valueAxis: "a1",
                            lineColor: "blue",
                            lineThickness: 2,
                            legendValueText: "[[value]]/[[description]]",
                            descriptionField: "townName",
                            bullet: "circle",
                            bulletBorderColor: "blue",
                            bulletBorderAlpha: 1,
                            bulletBorderThickness: 2,
                            bulletColor: "green",
                            labelText: "[[townName2]]",
                            labelPosition: "right",
                            balloonText: "Revenue Target :[[value]] (M.Rs)",
                            showBalloon: !0,
                            animationPlayed: !0
                        },
                        {
                            id: "g12",
                            valueField: "revenue_achievement",
                            title: "Achievement",
                            type: "line",
                            valueAxis: "a2",
                            lineColor: "green",
                            lineThickness: 2,
                            legendValueText: "[[value]]/[[description]]",
                            descriptionField: "townName",
                            bullet: "circle",
                            bulletSizeField: "townSize",
                            bulletBorderColor: "green",
                            bulletColor: "green",
                            labelText: "[[townName2]]",
                            labelPosition: "right",
                            balloonText: "Revenue Achievement:[[value]] (%)",
                            showBalloon: !0,
                            animationPlayed: !0
                        },
                    ]
                }))


            },
            error: function (xhr, exception) {

                var err_loader = "<div class='text-center' style='padding-top: 10%'> <i title='Something went wrong, while generating the comparison chart' class='fa fa-exclamation-triangle fa-fw' style='color:red; font-size:32px'></i></div>";

                $("#office_dashboard_revenue_target_and_achievement_graph").html(err_loader);
            },
            complete: function () {

            }
        });
    })
    $('#office_dashboard_revenue_target_and_achievement').trigger('change');
})

$(function () {
    let get_logged_in_user_id = localStorage.getItem('logged_in_user_id')
    if (!get_logged_in_user_id) {
        $("#modal-13-slit").trigger('click')
    }
    localStorage.setItem("logged_in_user_id", logged_in_user_id)
})

function openMissingDataNotificationDialog(ro_id, office_id, event) {
    let ro_name = $(event).data('ro-name-' + ro_id)
    let sub_division_name = $(event).data('sub-division-name-' + ro_id)
    let final_message = `Dear ${ro_name}, please enter the missing commercial data for office ${sub_division_name} asap.`
    var notice = new PNotify({
        title: 'Missing Data Notification',
        text: `Notify ${ro_name} via email`,
        data: {'ro_id': ro_id, 'office_id': office_id},
        hide: false,
        confirm: {
            prompt: true,
            prompt_multi_line: true,
            prompt_default: final_message,
            buttons: [
                {
                    text: 'Send Email',
                    addClass: 'btn btn-sm btn-primary'
                },
                {
                    addClass: 'btn btn-sm btn-link'
                }
            ]
        },
        buttons: {
            closer: true,
            sticker: false
        },
        history: {
            history: false
        }
        ,

    });

    // Confirm
    notice.get().on('pnotify.confirm', function (e, notice, val) {
        let data = notice.options.data
        let ro_id = data.ro_id

        $.ajax({
            url: baseUrl + '/notification/missing-data-notification',
            type: "Post",
            data: {
                ro_id: ro_id,
                office_id: office_id,
                body: val
            },
            success: function (data) {
                console.log(data)
                location.reload(true)
            },
        });

        notice.cancelRemove().update({
            title: 'Email is being sent',
            text: $('<div/>').text(val).html(),
            icon: 'icon-checkmark3',
            type: 'success',
            hide: true,
            confirm: {
                prompt: false
            },
            buttons: {
                closer: true,
                sticker: true
            }
        });
    });

    // On cancel
    notice.get().on('pnotify.cancel', function (e, notice) {
        location.reload(true)

    });
}

function calculateFactor() {
    let factor = 0;
    let type = $("#type").val()
    let max_marks = $("#max_marks").val()
    let min_marks = $("#min_marks").val()
    let upper_limit = $("#upper_limit").val()
    let lower_limit = $("#lower_limit").val()
    if (type === 'Loss Target Criteria') {
        factor = (max_marks - min_marks) / (upper_limit - lower_limit);
    } else {
        factor = max_marks / (upper_limit - lower_limit);
    }
    if (factor == Infinity || isNaN(factor))
        factor = 0;
    $("#factor").val(factor.toFixed(2))
}

$(document).ready(function () {
    var $popover = $('[data-toggle="popover"]').popover({
        html: true,
        trigger: 'hover',
        animation: true,
        content: function () {
            return $('#primary-popover-content').html();
        }
    });
    $("#max_marks, #upper_limit, #lower_limit, #min_marks").keyup(function () {
        calculateFactor()
    });
    $("#type").change(function () {
        calculateFactor()
    });
});
