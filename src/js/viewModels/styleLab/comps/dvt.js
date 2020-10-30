/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore', 'knockout', 'jquery',
        'text!../../../../resources/usa_states.json',
        'promise',
        'ojs/ojknockout',
        'ojs/ojchart',
        'ojs/ojgauge',
        'ojs/ojlegend',
        'ojs/ojtimeline',
        'ojs/ojtreemap',
        'ojs/ojsunburst',
        'ojs/ojthematicmap',
        'ojs/ojdiagram',
        'ojs/ojjsondiagramdatasource',
        'ojs/ojgantt'],

function(oj, ko, $, geo)
{
    var viewModel = function()
    {
        var self = this;

        this.LegendModel = function () {
          var colorHandler = new oj.ColorAttributeGroupHandler();
          this.sections =[
              {title: 'Brand',
              items: [{text: 'Coke', color: colorHandler.getValue('Coke'), id: 'Coke'},{text: 'Pepsi', color: colorHandler.getValue('Pepsi'), id: 'Pepsi'},
                      {text: 'Snapple', color: colorHandler.getValue('Snapple'), id: 'Snapple'},{text: 'Nestle', color: colorHandler.getValue('Nestle'), id: 'Nestle'}]},
              {title: 'Year',
              items: [{text: '2011', markerShape: 'circle'},{text: '2012', markerShape: 'diamond'},{text: '2013', markerShape: 'plus'},{text: '2014', markerShape: 'star'}]}
          ];
        }

        this.legendModel = new this.LegendModel();

        this.ChartModel = function () {
            /* chart data */
            var pieSeries = [
                {name: "Series 1", items: [12]},
                {name: "Series 2", items: [8]},
                {name: "Series 3", items: [8]},
                {name: "Series 4", items: [8]},
                {name: "Series 5", items: [8]},
                {name: "Series 6", items: [8]},
                {name: "Series 7", items: [8]},
                {name: "Series 8", items: [8]},
                {name: "Series 9", items: [8]},
                {name: "Series 10", items: [8]},
                {name: "Series 11", items: [8]},
                {name: "Series 12", items: [8]}];
            var pieGroups = ["Group A"];

            var barSeries = [{name: "Series 1", items: [42, 34]},
                {name: "Series 2", items: [55, 30]},
                {name: "Series 3", items: [36, 50]},
                {name: "Series 4", items: [22, 46]},
                {name: "Series 5", items: [22, 46]}];

            var barGroups = ["Group A", "Group B"];

            this.pieSeriesValue = ko.observableArray(pieSeries);
            this.pieGroupsValue = ko.observableArray(pieGroups);
            this.barSeriesValue = ko.observableArray(barSeries);
            this.barGroupsValue = ko.observableArray(barGroups);
        };

        this.chartModel = new this.ChartModel();


        this.TreeModel = function () {
            var self = this;
            var i = 0;

            var colorHandler = new oj.ColorAttributeGroupHandler();

            var MA = createNode("Massachusetts", "0", getValue(), getColor());
            var CT = createNode("Connecticut", "1", getValue(), getColor());
            var ME = createNode("Maine", "2", getValue(), getColor());
            var VT = createNode("Vermont", "3", getValue(), getColor());
            var RI = createNode("Rhode Island", "4", getValue(), getColor());

            addChildNodes(MA, [
                createNode("Boston", "00", getValue(), getColor()),
                createNode("Springfield", "01", getValue(), getColor()),
                createNode("Worcester", "02", getValue(), getColor())
            ]);
            addChildNodes(CT, [
                createNode("Hartford", "10", getValue(), getColor()),
                createNode("New Haven", "11", getValue(), getColor())
            ]);
            addChildNodes(ME, [
                createNode("Portland", "20", getValue(), getColor()),
                createNode("Augusta", "21", getValue(), getColor())
            ]);
            addChildNodes(VT, [
                createNode("Burlington", "30", getValue(), getColor())
            ]);
            addChildNodes(RI, [
                createNode("Providence", "40", getValue(), getColor()),
                createNode("Newport", "41", getValue(), getColor())
            ]);
            var nodes = [MA, CT, ME, VT, RI];

            function createNode(label, id, value, color) {
                return {label: label,
                    id: id,
                    value: value,
                    color: color,
                    shortDesc: label + ": " + value};
            }

            function addChildNodes(parent, childNodes) {
                parent.nodes = [];
                for (var i = 0; i < childNodes.length; i++) {
                    parent.nodes.push(childNodes[i]);
                }
            }
            function getValue() {
                return Math.round(50 + 50 * Math.random());
            }

            function getColor() {
                i++;
                return colorHandler.getValue(i);
            }

            self.nodeValues = ko.observableArray(nodes);

            self.getTooltip = function () {
                return null;
            };
        };

        this.treeModel = new this.TreeModel();

        this.GaugeModel = function () {
          this.thresholdValues = [{max: 33}, {max: 67}, {}];
          this.thresholdValues1 = [{max: 2, color: '#ed6647'}, {max: 4, color:'#fad55c'}, {color:'#68c182'}];
        }

        this.gaugeModel = new this.GaugeModel();

        this.DiagramModel = function () {
          var self = this;
          var colorHandler = new oj.ColorAttributeGroupHandler();
          function createNode(nodeId, color, x, y) {
            return {id: nodeId,
                    shortDesc: "Node " + nodeId,
                    label: nodeId,
                    color: color,
                    x: x, y:y};
          }
          function createLink(linkId, startId, endId, color) {
            return {id: linkId,
            startNode: startId,
            endNode: endId,
            shortDesc: "Link " + linkId + ", connects " + startId + " to " + endId,
            color: color};
          }
          function linkPathFunc(layoutContext, link) {
            var node1 = layoutContext.getNodeById(link.getStartId());
            var node2 = layoutContext.getNodeById(link.getEndId());
            var n1Pos = node1.getPosition(), n2Pos = node2.getPosition();
            var n1Bounds = node1.getBounds(), n2Bounds = node2.getBounds();
            var path, //svg path for the link
             offset = 5; //draw a link from and to the middle of the post
            if (n1Pos.x + n1Bounds.w < n2Pos.x) {
              path = ["M", n1Pos.x + n1Bounds.w, n1Pos.y + .5*n1Bounds.h, "L", n2Pos.x, n2Pos.y + .5*n2Bounds.h];
            }
            else{
              var dist = .5 * (n2Pos.y - n1Pos.y - n1Bounds.h);
              path = ["M", n1Pos.x + n1Bounds.w, n1Pos.y + .5*n1Bounds.h,
                "L", n1Pos.x + n1Bounds.w + 25, n1Pos.y + .5*n1Bounds.h,
                "L", n1Pos.x + n1Bounds.w + 25, n2Pos.y - dist,
                "L", n2Pos.x - 25, n2Pos.y - dist,
                "L", n2Pos.x - 25, n2Pos.y + .5*n2Bounds.h,
                "L", n2Pos.x, n2Pos.y + .5*n2Bounds.h
              ];
            }
            return path;
          };
          function labelLayoutFunc (layoutContext, node) {
            var nodeBounds = node.getContentBounds();
            var nodePos = node.getPosition();
            var labelLayout = {
              'x':nodeBounds.x + nodePos.x + .5 * (nodeBounds.w),
              'y':nodeBounds.y + nodePos.y + .5 * (nodeBounds.h),
              'halign':'center',
              'valign':'middle'
            };
            return labelLayout;
          };
          var nodes = [], links = [], i = 0;
          nodes.push(createNode("N0", colorHandler.getValue(++i), 0, 0));
          nodes.push(createNode("N1", colorHandler.getValue(++i), 150, 0));
          nodes.push(createNode("N2", colorHandler.getValue(++i), 0, 75));
          nodes.push(createNode("N3", colorHandler.getValue(++i), 150, 75));
          nodes.push(createNode("N4", colorHandler.getValue(++i), 0, 150));
          nodes.push(createNode("N5", colorHandler.getValue(++i), 150, 150));
          i=0;
          links.push(createLink("L0", "N0", "N1", colorHandler.getValue(++i)));
          links.push(createLink("L1", "N1", "N2", colorHandler.getValue(++i)));
          links.push(createLink("L2", "N2", "N3", colorHandler.getValue(++i)));
          links.push(createLink("L3", "N3", "N4", colorHandler.getValue(++i)));
          links.push(createLink("L4", "N4", "N5", colorHandler.getValue(++i)));
          self.data = new oj.JsonDiagramDataSource({'nodes':nodes, 'links':links});
          self.styleDefaults = {
            nodeDefaults : {icon : {width : 50, height : 50, shape : "square" }},
            linkDefaults : {width: 2}
          };
          self.simpleLayout = oj.DiagramUtils.getLayout({
            'nodes': nodes,
            'links': links,
            'linkDefaults':{'path': linkPathFunc},
            'nodeDefaults':{'labelLayout':labelLayoutFunc},
            'viewport': function (layoutContext) {
              var compSize = layoutContext.getComponentSize();
              return {'x': -50, 'y': 0, 'w': compSize.w, 'h': compSize.h};
            }
          });
        }
        this.diagramModel = new this.DiagramModel();

        // Thematic Map Data
        function createArea(location, color) {
            return {location: location,
                id: location,
                color: color,
                shortDesc: location};
        }
        var colorHandler = new oj.ColorAttributeGroupHandler();
        this.areaData = [
            createArea("AL", colorHandler.getValue(1)),
            createArea("FL", colorHandler.getValue(2)),
            createArea("TX", colorHandler.getValue(3)),
            createArea("MS", colorHandler.getValue(4)),
            createArea("RI", colorHandler.getValue(5)),
            createArea("MA", colorHandler.getValue(6)),
            createArea("OH", colorHandler.getValue(7)),
            createArea("AR", colorHandler.getValue(8)),
            createArea("OR", colorHandler.getValue(9)),
            createArea("WA", colorHandler.getValue(10)),
            createArea("UT", colorHandler.getValue(11)),
            createArea("CO", colorHandler.getValue(12)),
            createArea("SD", colorHandler.getValue(13)),
            createArea("IA", colorHandler.getValue(14)),
            createArea("MO", colorHandler.getValue(15)),
            createArea("NH", colorHandler.getValue(16)),
            createArea("PA", colorHandler.getValue(17)),
            createArea("WV", colorHandler.getValue(18)),
            createArea("NY", colorHandler.getValue(19)),
            createArea("ME", colorHandler.getValue(20))
        ];

        this.mapProvider = {
          geo: JSON.parse(geo),
          propertiesKeys: {
            id: 'sLabel',
            shortLabel: 'sLabel',
            longLabel: 'lLabel'
          }
        };


        /* gantt data */
        this.GanttModel = function () {
        this.projectStartDate = new Date("Jan 1, 2016").toISOString();
        this.projectEndDate = new Date("Dec 31, 2016").toISOString();

        this.rowsData = [
          {
            "id": "r1",
            "label": "Amy Bartlet",
            "tasks": [
              {
                "id":"task1-1",
                "start": "2016-01-04T00:00:00.000Z",
                "end": "2016-01-10T00:00:00.000Z",
                "label":"Label 1-1",
                "progress": {
                  "value": 0.25
                },
                "baseline": {
                  "start": "2016-01-06T00:00:00.000Z",
                  "end": "2016-01-12T00:00:00.000Z"
                }
              },
              {
                "id":"task1-2",
                "start": "2016-02-04T00:00:00.000Z",
                "end": "2016-02-10T00:00:00.000Z",
                "label":"Label 1-2",
                "progress": {
                  "value": 0.5
                },
                "baseline": {
                  "start": "2016-02-06T00:00:00.000Z",
                  "end": "2016-02-12T00:00:00.000Z"
                }
              },
              {
                "id":"task1-3",
                "start": "2016-03-04T00:00:00.000Z",
                "end": "2016-03-10T00:00:00.000Z",
                "label":"Label 1-3",
                "progress": {
                  "value": 0.75
                },
                "baseline": {
                  "start": "2016-03-06T00:00:00.000Z",
                  "end": "2016-03-12T00:00:00.000Z"
                }
              }
            ]
          },
          {
            "id": "r2",
            "label": "Andy Jones",
            "tasks": [
              {
                "id":"task2-1",
                "start": "2016-01-10T00:00:00.000Z",
                "end": "2016-01-24T00:00:00.000Z",
                "label":"Label 2-1",
                "progress": {
                  "value": 0.75
                },
                "baseline": {
                  "start": "2016-01-08T00:00:00.000Z",
                  "end": "2016-01-22T00:00:00.000Z"
                }
              },
              {
                "id":"task2-2",
                "start": "2016-02-10T00:00:00.000Z",
                "end": "2016-02-27T10:13:20.000Z",
                "label":"Label 2-2",
                "progress": {
                  "value": 0.5
                },
                "baseline": {
                  "start": "2016-02-08T00:00:00.000Z",
                  "end": "2016-02-25T00:00:00.000Z"
                }
              },
              {
                "id":"task2",
                "start": "2016-03-10T00:00:00.000Z",
                "end": "2016-04-24T00:00:00.000Z",
                "label":"Label 2-3",
                "progress": {
                  "value": 0.25
                },
                "baseline": {
                  "start": "2016-03-08T00:00:00.000Z",
                  "end": "2016-03-22T00:00:00.000Z"
                }
              }
            ]
          },
          {
            "id": "r3",
            "label": "Andrew Bugsy",
            "tasks": [
              {
                "id":"task3-1",
                "start": "2016-01-25T00:00:00.000Z",
                "end": "2016-02-05T00:00:00.000Z",
                "label":"Label 3-1",
                "progress": {
                  "value": 0.25
                },
                "baseline": {
                  "start": "2016-01-27T00:00:00.000Z",
                  "end": "2016-02-07T00:00:00.000Z"
                }
              },
              {
                "id":"task3-2",
                "start": "2016-02-25T00:00:00.000Z",
                "end": "2016-03-05T00:00:00.000Z",
                "label":"Label 3-2",
                "progress": {
                  "value": 0.75
                },
                "baseline": {
                  "start": "2016-02-27T00:00:00.000Z",
                  "end": "2016-03-07T00:00:00.000Z"
                }
              }
            ]
          },
          {
            "id": "r4",
            "label": "Annett Barnes",
            "tasks": [
              {
                "id":"task4",
                "start": "2016-02-14T00:00:00.000Z",
                "end": "2016-02-14T00:00:00.000Z",
                "label":"Label 4",
                "baseline": {
                  "start": "2016-02-14T00:00:00.000Z",
                  "end": "2016-02-14T00:00:00.000Z"
                }
              }
            ]
          },
          {
            "id": "r5",
            "label": "Bob Jones",
            "tasks": [
              {
                "id":"task5-1",
                "start": "2016-02-14T00:00:00.000Z",
                "end": "2016-02-19T00:00:00.000Z",
                "label":"Label 5-1",
                "progress": {
                  "value": 0.33
                },
                "baseline": {
                  "start": "2016-02-12T00:00:00.000Z",
                  "end": "2016-02-17T00:00:00.000Z"
                }
              },
              {
                "id":"task5-2",
                "start": "2016-03-14T00:00:00.000Z",
                "end": "2016-03-19T00:00:00.000Z",
                "label":"Label 5-2",
                "progress": {
                  "value": 0.75
                },
                "baseline": {
                  "start": "2016-03-16T00:00:00.000Z",
                  "end": "2016-03-21T00:00:00.000Z"
                }
              },
              {
                "id":"task5-3",
                "start": "2016-03-30T13:46:40.000Z",
                "end": "2016-04-19T00:00:00.000Z",
                "label":"Label 5-3",
                "progress": {
                  "value": 0.5
                },
                "baseline": {
                  "start": "2016-03-28T00:00:00.000Z",
                  "end": "2016-04-17T00:00:00.000Z"
                }
              }
            ]
          },
          {
            "id": "r6",
            "label": "Bart Bucklet",
            "tasks": [
              {
                "id":"task6-1",
                "start": "2016-02-19T00:00:00.000Z",
                "end": "2016-02-22T00:00:00.000Z",
                "label":"Label 6-1",
                "progress": {
                  "value": 0.6
                },
                "baseline": {
                  "start": "2016-02-19T00:00:00.000Z",
                  "end": "2016-02-22T00:00:00.000Z"
                }
              },
              {
                "id":"task6-2",
                "start": "2016-03-19T00:00:00.000Z",
                "end": "2016-03-22T00:00:00.000Z",
                "label":"Label 6-2",
                "progress": {
                  "value": 0.9
                },
                "baseline": {
                  "start": "2016-03-22T00:00:00.000Z",
                  "end": "2016-03-25T00:00:00.000Z"
                }
              },
              {
                "id":"task6-3",
                "start": "2016-04-19T00:00:00.000Z",
                "end": "2016-04-22T00:00:00.000Z",
                "label":"Label 6-3",
                "progress": {
                  "value": 0.1
                },
                "baseline": {
                  "start": "2016-04-16T00:00:00.000Z",
                  "end": "2016-04-21T00:00:00.000Z"
                }
              },
              {
                "id":"task6-4",
                "start": "2016-05-19T00:00:00.000Z",
                "end": "2016-05-19T00:00:00.000Z",
                "label":"Label 6-4",
                "baseline": {
                  "start": "2016-05-10T00:00:00.000Z",
                  "end": "2016-05-10T00:00:00.000Z"
                }
              }
            ]
          },
          {
            "id": "r7",
            "label": "Bobby Fisher",
            "tasks": [
              {
                "id":"task7",
                "start": "2016-02-22T00:00:00.000Z",
                "end": "2016-03-04T00:00:00.000Z",
                "label":"Label 7",
                "progress": {
                  "value": 0.75
                },
                "baseline": {
                  "start": "2016-02-20T00:00:00.000Z",
                  "end": "2016-03-06T00:00:00.000Z"
                }
              }
            ]
          },
          {
            "id": "r8",
            "label": "Cathy Jones",
            "tasks": [
              {
                "id":"task8-1",
                "start": "2016-02-19T07:06:40.000Z",
                "end": "2016-02-25T07:06:40.000Z",
                "label":"Label 8-1",
                "progress": {
                  "value": 0.5
                },
                "baseline": {
                  "start": "2016-02-23T00:00:00.000Z",
                  "end": "2016-02-28T00:00:00.000Z"
                }
              },
              {
                "id":"task8-2",
                "start": "2016-03-21T07:06:40.000Z",
                "end": "2016-03-27T07:06:40.000Z",
                "label":"Label 8-2",
                "progress": {
                  "value": 0.75
                },
                "baseline": {
                  "start": "2016-03-21T00:00:00.000Z",
                  "end": "2016-03-27T00:00:00.000Z"
                }
              },
              {
                "id":"task8-3",
                "start": "2016-04-19T07:06:40.000Z",
                "end": "2016-06-22T19:06:40.000Z",
                "label":"Label 8-3",
                "progress": {
                  "value": 0.7
                },
                "baseline": {
                  "start": "2016-04-15T00:00:00.000Z",
                  "end": "2016-06-20T00:00:00.000Z"
                }
              }
            ]
          },
          {
            "id": "r9",
            "label": "Caroll Smith",
            "tasks": [
              {
                "id":"task9-1",
                "start": "2016-02-28T17:20:00.000Z",
                "end": "2016-03-10T17:20:00.000Z",
                "label":"Label 9-1",
                "progress": {
                  "value": 0.75
                },
                "baseline": {
                  "start": "2016-02-25T00:00:00.000Z",
                  "end": "2016-03-08T00:00:00.000Z"
                }
              },
              {
                "id":"task9-2",
                "start": "2016-03-30T17:20:00.000Z",
                "end": "2016-04-08T17:20:00.000Z",
                "label":"Label 9-2",
                "progress": {
                  "value": 0.5
                },
                "baseline": {
                  "start": "2016-03-25T00:00:00.000Z",
                  "end": "2016-04-05T00:00:00.000Z"
                }
              },
              {
                "id":"task9-3",
                "start": "2016-04-04T05:20:00.000Z",
                "end": "2016-08-02T11:06:40.000Z",
                "label":"Label 9-2",
                "progress": {
                  "value": 0.25
                },
                "baseline": {
                  "start": "2016-04-02T00:00:00.000Z",
                  "end": "2016-08-01T00:00:00.000Z"
                }
              }
            ]
          },
          {
            "id": "r10",
            "label": "Curtis Davies",
            "tasks": [
              {
                "id":"task10-1",
                "start": "2016-03-11T07:06:40.000Z",
                "end": "2016-03-30T02:13:20.000Z",
                "label":"Label 10-1",
                "progress": {
                  "value": 0.25
                },
                "baseline": {
                  "start": "2016-03-16T00:00:00.000Z",
                  "end": "2016-04-03T00:00:00.000Z"
                }
              },
              {
                "id":"task10-2",
                "start": "2016-04-11T07:06:40.000Z",
                "end": "2016-06-05T14:13:20.000Z",
                "label":"Label 10-2",
                "progress": {
                  "value": 0.75
                },
                "baseline": {
                  "start": "2016-04-15T00:00:00.000Z",
                  "end": "2016-06-15T00:00:00.000Z"
                }
              }
            ]
          }
        ];
    };

    this.ganttModel = new this.GanttModel();

    }

    return viewModel;
});

