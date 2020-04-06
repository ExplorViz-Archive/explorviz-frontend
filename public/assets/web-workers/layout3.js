// Wait for the initial message event.
self.addEventListener('message', function (e) {
    var _a = e.data, reducedLandscape = _a.reducedLandscape, openEntitiesIds = _a.openEntitiesIds, modelIdToPoints = _a.modelIdToPoints, graph = _a.graph;
    var port = e.ports[0];
    // Do your stuff here.
    if (port) {
        // Message sent through a worker created with 'open' method.
        port.postMessage({ foo: 'foo' });
    }
    else {
        // Message sent through a worker created with 'send' or 'on' method.
        var landscape = layout3(reducedLandscape, openEntitiesIds, modelIdToPoints, graph);
        postMessage(landscape);
    }
}, false);
var CONVERT_TO_KIELER_FACTOR = 180.0;
function layout3(landscape, openEntitiesIds, modelIdToPoints, graph) {
    var modelIdToGraph = new Map();
    var modeldToKielerEdgeReference = new Map();
    // Maps for output
    var modelIdToLayout = new Map();
    createModelIdToGraphMap(graph);
    createModelIdToEdgeMap();
    updateGraphWithResults(landscape);
    return { modelIdToLayout: modelIdToLayout, modelIdToPoints: modelIdToPoints, modeldToKielerEdgeReference: modeldToKielerEdgeReference, modelIdToGraph: modelIdToGraph, graph: graph };
    function createModelIdToGraphMap(graf) {
        var _a;
        if (graf.id !== 'root') {
            modelIdToGraph.set(graf.id, graf);
        }
        (_a = graf.children) === null || _a === void 0 ? void 0 : _a.forEach(function (childGraph) {
            createModelIdToGraphMap(childGraph);
        });
    }
    function createModelIdToEdgeMap() {
        var _a;
        (_a = modelIdToGraph) === null || _a === void 0 ? void 0 : _a.forEach(function (kielerGraph) {
            var _a;
            (_a = kielerGraph.edges) === null || _a === void 0 ? void 0 : _a.forEach(function (edge) {
                if (edge.communicationId)
                    modeldToKielerEdgeReference.set(edge.communicationId, [edge]);
            });
        });
    }
    function updateGraphWithResults(landscape) {
        var _a, _b;
        var systems = landscape.systems;
        (_a = systems) === null || _a === void 0 ? void 0 : _a.forEach(function (system) {
            var _a;
            updateNodeValues(system);
            var nodegroups = system.nodeGroups;
            (_a = nodegroups) === null || _a === void 0 ? void 0 : _a.forEach(function (nodegroup) {
                var _a;
                if (isVisible(nodegroup)) {
                    var nodes_1 = nodegroup.nodes;
                    if (nodes_1.length > 1) {
                        updateNodeValues(nodegroup);
                    }
                    setAbsolutePositionForNode(nodegroup, system);
                    (_a = nodes_1) === null || _a === void 0 ? void 0 : _a.forEach(function (node) {
                        if (isVisible(node)) {
                            updateNodeValues(node);
                            if (nodes_1.length > 1) {
                                setAbsolutePositionForNode(node, nodegroup);
                            }
                            else if (nodes_1.length === 1) {
                                setAbsolutePositionForNode(node, system);
                            }
                            var applications = node.applications;
                            applications.forEach(function (application) {
                                updateNodeValues(application);
                                setAbsolutePositionForNode(application, node);
                            });
                        }
                    });
                }
            });
        });
        addBendPointsInAbsoluteCoordinates(landscape);
        (_b = systems) === null || _b === void 0 ? void 0 : _b.forEach(function (system) {
            var _a;
            var nodegroups = system.nodeGroups;
            (_a = nodegroups) === null || _a === void 0 ? void 0 : _a.forEach(function (nodegroup) {
                var _a;
                if (isVisible(nodegroup)) {
                    var nodes = nodegroup.nodes;
                    (_a = nodes) === null || _a === void 0 ? void 0 : _a.forEach(function (node) {
                        var _a;
                        if (isVisible(node)) {
                            var applications = node.applications;
                            (_a = applications) === null || _a === void 0 ? void 0 : _a.forEach(function (application) {
                                convertToExplorVizCoords(application);
                            });
                            convertToExplorVizCoords(node);
                        }
                    });
                    if (nodes.length > 1) {
                        convertToExplorVizCoords(nodegroup);
                    }
                }
            });
            convertToExplorVizCoords(system);
        });
    } // END updateGraphWithResults
    function addBendPointsInAbsoluteCoordinates(landscape) {
        var _a;
        var totalApplicationCommunications = landscape.applicationCommunications;
        // Points for drawing which represent an edge
        var edgeIdToPoints = new Map();
        (_a = totalApplicationCommunications) === null || _a === void 0 ? void 0 : _a.forEach(function (applicationcommunication) {
            var _a;
            var kielerEdgeReferences = modeldToKielerEdgeReference.get(applicationcommunication.id);
            (_a = kielerEdgeReferences) === null || _a === void 0 ? void 0 : _a.forEach(function (edge) {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                if (edge != null) {
                    var maybePoints = edgeIdToPoints.get(edge.id);
                    if (maybePoints) {
                        modelIdToPoints.set(applicationcommunication.id, maybePoints);
                        return;
                    }
                    var sourceApplication = applicationcommunication.sourceApplication;
                    var targetApplication = applicationcommunication.targetApplication;
                    var parentNode = getRightParent(sourceApplication, targetApplication);
                    var points = [];
                    var edgeOffset = { bottom: 0.0, left: 0.0, right: 0.0, top: 0.0 };
                    if (parentNode) {
                        points = edge.bendPoints ? edge.bendPoints : [];
                        edgeOffset = { bottom: 0.0, left: 0.0, right: 0.0, top: 0.0 };
                        // @ts-ignore Since overlapping id property is not detected
                        var parentGraph = modelIdToGraph.get(parentNode.id);
                        if (parentGraph && parentGraph.padding) {
                            edgeOffset = parentGraph.padding;
                        }
                        var sourcePoint = null;
                        if (isDescendant(edge.targetNode, edge.sourceNode)) {
                            // Self edges..
                            var sourcePort = edge.sPort;
                            if (!((_a = sourcePort) === null || _a === void 0 ? void 0 : _a.x) || !sourcePort.y)
                                return;
                            sourcePoint = {
                                x: sourcePort.x,
                                y: sourcePort.y
                            };
                            var sourceGraph = modelIdToGraph.get(edge.sourceNode.id);
                            if (!sourceGraph)
                                return;
                            var sourceInsets = sourceGraph.padding;
                            if (sourcePoint.x && sourcePoint.y && ((_b = sourceInsets) === null || _b === void 0 ? void 0 : _b.left) && sourceInsets.top) {
                                sourcePoint.x -= sourceInsets.left;
                                sourcePoint.y -= sourceInsets.top;
                            }
                            var nestedGraph = sourceGraph;
                            if ((_c = nestedGraph) === null || _c === void 0 ? void 0 : _c.padding) {
                                edgeOffset = nestedGraph.padding;
                            }
                        }
                        else {
                            if (edge.source && ((_d = edge) === null || _d === void 0 ? void 0 : _d.sourcePoint)) {
                                sourcePoint = {
                                    x: edge.sourcePoint.x,
                                    y: edge.sourcePoint.y
                                };
                            }
                            else if (((_e = edge.sPort) === null || _e === void 0 ? void 0 : _e.x) && edge.sPort.y) {
                                sourcePoint = {
                                    x: edge.sPort.x,
                                    y: edge.sPort.y
                                };
                            }
                            else {
                                return;
                            }
                        }
                        points.unshift(sourcePoint);
                        if (!((_f = edge.tPort) === null || _f === void 0 ? void 0 : _f.x) || !edge.tPort.y)
                            return;
                        var targetPoint = edge.targetPoint ? {
                            x: edge.targetPoint.x,
                            y: edge.targetPoint.y
                        } : {
                            x: edge.tPort.x,
                            y: edge.tPort.y
                        };
                        var targetGraph = modelIdToGraph.get(edge.targetNode.id);
                        if (((_g = targetGraph) === null || _g === void 0 ? void 0 : _g.padding) && ((_h = targetPoint) === null || _h === void 0 ? void 0 : _h.x) && targetPoint.y) {
                            targetPoint.x += targetGraph.padding.left;
                            targetPoint.y += targetGraph.padding.top;
                        }
                        points.push(targetPoint);
                        (_j = points) === null || _j === void 0 ? void 0 : _j.forEach(function (point) {
                            point.x += edgeOffset.left;
                            point.y += edgeOffset.top;
                        });
                        var pOffsetX_1 = 0.0;
                        var pOffsetY_1 = 0.0;
                        if (parentNode) {
                            var insetLeft = 0.0;
                            var insetTop = 0.0;
                            // why is parentNode.constructor.modelName undefined?
                            // "alternative": parentNode.content._internalModel.modelName
                            if (isReducedSystem(parentNode)) {
                                pOffsetX_1 = insetLeft;
                                pOffsetY_1 = insetTop * -1;
                            }
                            else {
                                var layout = modelIdToLayout.get(parentNode.id);
                                if (layout) {
                                    pOffsetX_1 = ((_k = layout) === null || _k === void 0 ? void 0 : _k.positionX) + insetLeft;
                                    pOffsetY_1 = ((_l = layout) === null || _l === void 0 ? void 0 : _l.positionY) - insetTop;
                                }
                            }
                        }
                        var updatedPoints_1 = [];
                        (_m = points) === null || _m === void 0 ? void 0 : _m.forEach(function (point) {
                            var resultPoint = {
                                x: 0,
                                y: 0
                            };
                            resultPoint.x = (point.x + pOffsetX_1) / CONVERT_TO_KIELER_FACTOR;
                            resultPoint.y = (point.y * -1 + pOffsetY_1) / CONVERT_TO_KIELER_FACTOR; // KIELER has inverted Y coords
                            var points = modelIdToPoints.get(applicationcommunication.id);
                            if (points) {
                                points.push(resultPoint);
                                modelIdToPoints.set(applicationcommunication.id, points);
                            }
                            updatedPoints_1.push(resultPoint);
                        });
                        edgeIdToPoints.set(edge.id, updatedPoints_1);
                    } // END if (parentNode != null)
                }
            });
        });
    } // END addBendPoints
    function updateNodeValues(entity) {
        var entityGraph = modelIdToGraph.get(entity.id);
        if (entityGraph && entityGraph.x && entityGraph.y && entityGraph.width && entityGraph.height) {
            var layout = {
                positionX: entityGraph.x,
                positionY: entityGraph.y * -1,
                width: entityGraph.width,
                height: entityGraph.height,
                opened: openEntitiesIds.size === 0 ? true : openEntitiesIds.has(entity.id)
            };
            modelIdToLayout.set(entity.id, layout);
        }
    }
    function convertToExplorVizCoords(entity) {
        var layout = modelIdToLayout.get(entity.id);
        if (layout) {
            layout.positionX /= CONVERT_TO_KIELER_FACTOR;
            layout.positionY /= CONVERT_TO_KIELER_FACTOR;
            layout.width /= CONVERT_TO_KIELER_FACTOR;
            layout.height /= CONVERT_TO_KIELER_FACTOR;
        }
    }
    function setAbsolutePositionForNode(child, parent) {
        var childLayout = modelIdToLayout.get(child.id);
        var parentLayout = modelIdToLayout.get(parent.id);
        var parentGraph = modelIdToGraph.get(parent.id);
        if (childLayout && parentLayout && parentGraph && parentGraph.padding) {
            childLayout.positionX += parentLayout.positionX + parentGraph.padding.left;
            childLayout.positionY += parentLayout.positionY - parentGraph.padding.top;
        }
    }
    function getRightParent(sourceApplication, targetApplication) {
        var sourceNode = sourceApplication.parent;
        var result = sourceNode;
        if (!isVisible(sourceNode)) {
            var sourceNodeGroup = sourceNode.parent;
            var sourceSystem = sourceNodeGroup.parent;
            var targetNode = targetApplication.parent;
            var targetNodeGroup = targetNode.parent;
            var targetSystem = targetNodeGroup.parent;
            if (!isOpen(sourceSystem)) {
                if (sourceSystem !== targetSystem) {
                    result = sourceSystem;
                }
                else {
                    result = null; // means don't draw
                }
            }
            else {
                var maybeApp = seekRepresentativeApplication(sourceApplication);
                if (maybeApp) {
                    result = maybeApp.parent;
                }
            }
        }
        return result;
    }
    function isDescendant(child, parent) {
        var current = child;
        var next = child.parent;
        while (next) {
            current = next;
            if (current === parent) {
                return true;
            }
            next = current.parent;
        }
        return false;
    }
    /**
     * Searches for an application with the same name as the
     * given application within the same nodegroup. This can be
     * be done because a nodegroup only contains nodes which run
     * the same applications.
     * @param application
     */
    function seekRepresentativeApplication(application) {
        var _a;
        var parentNode = application.parent;
        var parentNodeGroup = parentNode.parent;
        var nodes = parentNodeGroup.nodes;
        var returnValue = null;
        (_a = nodes) === null || _a === void 0 ? void 0 : _a.forEach(function (node) {
            var _a;
            if (isVisible(node)) {
                var applications = node.applications;
                (_a = applications) === null || _a === void 0 ? void 0 : _a.forEach(function (representiveApplication) {
                    if (representiveApplication.name === application.name) {
                        returnValue = representiveApplication;
                    }
                });
            }
        });
        return returnValue;
    }
    function isOpen(entity) {
        if (openEntitiesIds.size === 0) {
            return true;
        }
        if (isReducedNodeGroup(entity)) {
            return entity.nodes.length < 2 || openEntitiesIds.has(entity.id);
        }
        else {
            return openEntitiesIds.has(entity.id);
        }
    }
    function isVisible(entity) {
        var _a;
        if (isReducedNodeGroup(entity)) {
            var system = entity.parent;
            return isOpen(system);
        }
        else if (isReducedNode(entity)) {
            var nodeGroup = entity.parent;
            if (isOpen(nodeGroup)) {
                return isVisible(nodeGroup);
            }
            else {
                var nodes = nodeGroup.nodes;
                return ((_a = nodes[0]) === null || _a === void 0 ? void 0 : _a.id) === entity.id && isVisible(nodeGroup);
            }
        }
        else if (isReducedApplication(entity)) {
            var node = entity.parent;
            return isVisible(node);
        }
        else {
            return false;
        }
    }
    function isReducedSystem(arg) {
        return arg.nodeGroups !== undefined;
    }
    function isReducedNodeGroup(arg) {
        return arg.nodes !== undefined;
    }
    function isReducedNode(arg) {
        return arg.applications !== undefined;
    }
    function isReducedApplication(arg) {
        return arg.type !== undefined && arg.type === 'application';
    }
}
