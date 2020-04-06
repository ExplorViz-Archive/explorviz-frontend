// Wait for the initial message event.
self.addEventListener('message', function (e) {
    var _a = e.data, reducedLandscape = _a.reducedLandscape, openEntitiesIds = _a.openEntitiesIds;
    var port = e.ports[0];
    // Do your stuff here.
    if (port) {
        // Message sent through a worker created with 'open' method.
        port.postMessage({ foo: 'foo' });
    }
    else {
        // Message sent through a worker created with 'send' or 'on' method.
        var kielerGraph = layout1(reducedLandscape, openEntitiesIds);
        postMessage(kielerGraph);
    }
}, false);
// Ping the Ember service to say that everything is ok.
postMessage(true);
var CONVERT_TO_KIELER_FACTOR = 180.0;
function layout1(landscape, openEntitiesIds) {
    var topLevelKielerGraph = {};
    // Maps for internal computations
    var modelIdToGraph = new Map();
    var modelIdToSourcePort = new Map();
    var modelIdToTargetPort = new Map();
    var modeldToKielerEdgeReference = new Map();
    // Maps for output
    var modelIdToPoints = new Map();
    var graph = createEmptyGraph("root");
    topLevelKielerGraph = graph;
    addNodes(landscape);
    addEdges(landscape);
    graph.commId = "asdasd";
    return {
        graph: graph,
        modelIdToPoints: modelIdToPoints
    };
    function createEmptyGraph(id) {
        var layoutOptions = {
            "edgeRouting": "POLYLINE",
            "spacing": 0.2 * CONVERT_TO_KIELER_FACTOR,
            "borderSpacing": 0.2 * CONVERT_TO_KIELER_FACTOR,
            "direction": "RIGHT",
            "interactive": true,
            "nodePlace": "LINEAR_SEGMENTS",
            "unnecessaryBendpoints": true,
            "edgeSpacingFactor": 1.0
        };
        var graph = {
            "id": id,
            "properties": layoutOptions,
            "children": [],
            "edges": []
        };
        return graph;
    }
    function addNodes(landscape) {
        var systems = landscape.systems;
        if (systems) {
            systems.forEach(function (system) {
                var DEFAULT_WIDTH = 1.5;
                var DEFAULT_HEIGHT = 0.75;
                var PADDING = 0.1;
                var SYSTEM_LABEL_HEIGHT = 0.4;
                if (isOpen(system)) {
                    var minWidth = Math.max(2.5 * DEFAULT_WIDTH *
                        CONVERT_TO_KIELER_FACTOR, (calculateRequiredLabelLength(system.name, SYSTEM_LABEL_HEIGHT) +
                        PADDING * 6.0) * CONVERT_TO_KIELER_FACTOR);
                    var minHeight = 2.5 * DEFAULT_HEIGHT * CONVERT_TO_KIELER_FACTOR;
                    var systemKielerGraph_1 = createEmptyGraph(system.id);
                    modelIdToGraph.set(system.id, systemKielerGraph_1);
                    if (!systemKielerGraph_1.properties)
                        return;
                    systemKielerGraph_1.properties["de.cau.cs.kieler.sizeConstraint"] = "MINIMUM_SIZE";
                    systemKielerGraph_1.properties["de.cau.cs.kieler.minWidth"] = minWidth;
                    systemKielerGraph_1.properties["de.cau.cs.kieler.minHeight"] = minHeight;
                    systemKielerGraph_1.properties["de.cau.cs.kieler.klay.layered.contentAlignment"] = "V_CENTER, H_CENTER";
                    systemKielerGraph_1.padding = {
                        left: PADDING * CONVERT_TO_KIELER_FACTOR,
                        right: PADDING * CONVERT_TO_KIELER_FACTOR,
                        // Leave space for system label
                        top: 8 * PADDING * CONVERT_TO_KIELER_FACTOR,
                        bottom: PADDING * CONVERT_TO_KIELER_FACTOR
                    };
                    if (!topLevelKielerGraph.children)
                        return;
                    topLevelKielerGraph.children.push(systemKielerGraph_1);
                    var nodegroups = system.nodeGroups;
                    nodegroups.forEach(function (nodeGroup) {
                        if (isVisible(nodeGroup)) {
                            createNodeGroup(systemKielerGraph_1, nodeGroup);
                        }
                    });
                }
                else {
                    var width = Math.max(2.5 * DEFAULT_WIDTH *
                        CONVERT_TO_KIELER_FACTOR, (calculateRequiredLabelLength(system.name, SYSTEM_LABEL_HEIGHT) +
                        PADDING * 6.0) * CONVERT_TO_KIELER_FACTOR);
                    var height = 2.5 * DEFAULT_HEIGHT * CONVERT_TO_KIELER_FACTOR;
                    var systemKielerNode = {
                        "id": system.id,
                        "width": width,
                        "height": height,
                        "edges": [],
                        "ports": []
                    };
                    systemKielerNode.padding = {
                        left: PADDING * CONVERT_TO_KIELER_FACTOR,
                        right: PADDING * CONVERT_TO_KIELER_FACTOR,
                        top: PADDING * CONVERT_TO_KIELER_FACTOR,
                        bottom: PADDING * CONVERT_TO_KIELER_FACTOR
                    };
                    modelIdToGraph.set(system.id, systemKielerNode);
                    if (!topLevelKielerGraph.children)
                        return;
                    topLevelKielerGraph.children.push(systemKielerNode);
                }
            });
        }
    } // END addNodes
    function addEdges(landscape) {
        var totalApplicationCommunications = landscape.applicationCommunications;
        totalApplicationCommunications.forEach(function (applicationcommunication) {
            modeldToKielerEdgeReference.set(applicationcommunication.id, []);
            modelIdToPoints.set(applicationcommunication.id, []);
            var appSource = applicationcommunication.sourceApplication;
            var appTarget = applicationcommunication.targetApplication;
            var sourceNode = appSource.parent;
            var sourceNodeGroup = sourceNode.parent;
            var sourceSystem = sourceNodeGroup.parent;
            if (!isVisible(sourceNode)) {
                var maybeSource = isOpen(sourceSystem) ? seekRepresentativeApplication(appSource) : sourceSystem;
                if (maybeSource)
                    appSource = maybeSource;
            }
            var targetNode = appTarget.parent;
            var targetNodeGroup = targetNode.parent;
            var targetSystem = targetNodeGroup.parent;
            if (!isVisible(targetNode)) {
                var maybeTarget = isOpen(targetSystem) ? seekRepresentativeApplication(appTarget) : targetSystem;
                if (maybeTarget)
                    appTarget = maybeTarget;
            }
            if (appSource.id !== appTarget.id) {
                var edge = createEdgeBetweenSourceTarget(appSource, appTarget, applicationcommunication.id);
                var edgeReference = modeldToKielerEdgeReference.get(applicationcommunication.id);
                edgeReference.push(edge);
            }
        });
    } // END addEdges
    function createNodeGroup(systemKielerGraph, nodegroup) {
        var nodes = nodegroup.nodes;
        var PADDING = 0.1;
        if (nodes.length > 1) {
            var nodeGroupKielerGraph_1 = createEmptyGraph(nodegroup.id);
            modelIdToGraph.set(nodegroup.id, nodeGroupKielerGraph_1);
            if (!nodeGroupKielerGraph_1.properties || !systemKielerGraph.children)
                return;
            nodeGroupKielerGraph_1.properties["de.cau.cs.kieler.klay.layered.crossMin"] = "LAYER_SWEEP";
            nodeGroupKielerGraph_1.padding = {
                left: PADDING * CONVERT_TO_KIELER_FACTOR,
                right: PADDING * CONVERT_TO_KIELER_FACTOR,
                top: PADDING * CONVERT_TO_KIELER_FACTOR,
                bottom: PADDING * CONVERT_TO_KIELER_FACTOR
            };
            systemKielerGraph.children.push(nodeGroupKielerGraph_1);
            var yCoord_1 = 0.0;
            nodes.forEach(function (node) {
                if (isVisible(node)) {
                    createNodeAndItsApplications(nodeGroupKielerGraph_1, node);
                    var kielerGraphReference = modelIdToGraph.get(node.id);
                    if (kielerGraphReference) {
                        kielerGraphReference.x = 0;
                        kielerGraphReference.y = yCoord_1;
                        yCoord_1 += CONVERT_TO_KIELER_FACTOR;
                    }
                }
            });
        }
        else {
            nodes.forEach(function (node) {
                if (isVisible(node)) {
                    createNodeAndItsApplications(systemKielerGraph, node);
                }
            });
        }
    } // END createNodeGroup
    /**
     * Searches for an application with the same name as the
     * given application within the same nodegroup. This can be
     * be done because a nodegroup only contains nodes which run
     * the same applications.
     * @param application
     */
    function seekRepresentativeApplication(application) {
        var parentNode = application.parent;
        var parentNodeGroup = parentNode.parent;
        var nodes = parentNodeGroup.nodes;
        var returnValue = null;
        nodes.forEach(function (node) {
            if (isVisible(node)) {
                var applications = node.applications;
                applications.forEach(function (representiveApplication) {
                    if (representiveApplication.name === application.name) {
                        returnValue = representiveApplication;
                    }
                });
            }
        });
        return returnValue;
    }
    function createNodeAndItsApplications(kielerParentGraph, node) {
        var PADDING = 0.1;
        var NODE_LABEL_HEIGHT = 0.2;
        var DEFAULT_WIDTH = 1.5;
        var DEFAULT_HEIGHT = 0.75;
        var nodeKielerGraph = createEmptyGraph(node.id);
        modelIdToGraph.set(node.id, nodeKielerGraph);
        nodeKielerGraph.padding = {
            left: PADDING * CONVERT_TO_KIELER_FACTOR,
            right: PADDING * CONVERT_TO_KIELER_FACTOR,
            top: PADDING * CONVERT_TO_KIELER_FACTOR,
            bottom: 6 * PADDING * CONVERT_TO_KIELER_FACTOR
        };
        var parent = node.parent;
        var minWidth = Math.max(DEFAULT_WIDTH *
            CONVERT_TO_KIELER_FACTOR, (calculateRequiredLabelLength(getDisplayName(parent, node), NODE_LABEL_HEIGHT) +
            PADDING * 2.0) * CONVERT_TO_KIELER_FACTOR);
        var minHeight = DEFAULT_HEIGHT * CONVERT_TO_KIELER_FACTOR;
        if (!nodeKielerGraph.properties || !kielerParentGraph.children)
            return;
        nodeKielerGraph.properties["de.cau.cs.kieler.sizeConstraint"] = "MINIMUM_SIZE";
        nodeKielerGraph.properties["de.cau.cs.kieler.minWidth"] = minWidth;
        nodeKielerGraph.properties["de.cau.cs.kieler.minHeight"] = minHeight;
        nodeKielerGraph.properties["de.cau.cs.kieler.klay.layered.contentAlignment"] = "V_CENTER,H_CENTER";
        kielerParentGraph.children.push(nodeKielerGraph);
        var applications = node.applications;
        applications.forEach(function (application) {
            var DEFAULT_WIDTH = 1.5;
            var DEFAULT_HEIGHT = 0.75;
            var APPLICATION_PIC_SIZE = 0.16;
            var APPLICATION_PIC_PADDING_SIZE = 0.15;
            var APPLICATION_LABEL_HEIGHT = 0.21;
            var width = Math.max(DEFAULT_WIDTH * CONVERT_TO_KIELER_FACTOR, (calculateRequiredLabelLength(application.name, APPLICATION_LABEL_HEIGHT) +
                APPLICATION_PIC_PADDING_SIZE + APPLICATION_PIC_SIZE +
                PADDING * 3.0) * CONVERT_TO_KIELER_FACTOR);
            var height = DEFAULT_HEIGHT * CONVERT_TO_KIELER_FACTOR;
            var applicationKielerNode = {
                "id": application.id,
                "width": width,
                "height": height,
                "children": [],
                "edges": [],
                "ports": []
            };
            modelIdToGraph.set(application.id, applicationKielerNode);
            if (nodeKielerGraph.children)
                nodeKielerGraph.children.push(applicationKielerNode);
        });
    } // END createNodeAndItsApplications
    function createEdgeBetweenSourceTarget(sourceApplication, targetApplication, commId) {
        var port1 = createSourcePortIfNotExisting(sourceApplication);
        var port2 = createTargetPortIfNotExisting(targetApplication);
        var edge = createEdgeHelper(sourceApplication, port1, targetApplication, port2, commId);
        return edge;
        //---------------------------inner functions
        function createSourcePortIfNotExisting(sourceDrawnode) {
            var _a, _b;
            // Do not create duplicate port
            var maybePort = modelIdToSourcePort.get(sourceDrawnode.id);
            if (maybePort && modelIdToSourcePort.has(sourceDrawnode.id)) {
                return maybePort;
            }
            else {
                var DEFAULT_PORT_WIDTH = 0.000001;
                var DEFAULT_PORT_HEIGHT = 0.000001;
                var CONVERT_TO_KIELER_FACTOR_1 = 180;
                var portId = sourceDrawnode.id + "_sp1";
                var port = {
                    id: portId,
                    width: DEFAULT_PORT_WIDTH * CONVERT_TO_KIELER_FACTOR_1,
                    height: DEFAULT_PORT_HEIGHT * CONVERT_TO_KIELER_FACTOR_1,
                    properties: {
                        "de.cau.cs.kieler.portSide": "EAST"
                    },
                    x: 0,
                    y: 0
                };
                var sourceGraph = modelIdToGraph.get(sourceDrawnode.id);
                port.node = sourceGraph;
                modelIdToSourcePort.set(sourceDrawnode.id, port);
                (_b = (_a = sourceGraph) === null || _a === void 0 ? void 0 : _a.ports) === null || _b === void 0 ? void 0 : _b.push(port);
                return port;
            }
        }
        function createTargetPortIfNotExisting(targetDrawnode) {
            var _a, _b;
            // Do not create duplicate port
            var maybePort = modelIdToTargetPort.get(targetDrawnode.id);
            if (maybePort && modelIdToTargetPort.has(targetDrawnode.id)) {
                return maybePort;
            }
            else {
                var DEFAULT_PORT_WIDTH = 0.000001;
                var DEFAULT_PORT_HEIGHT = 0.000001;
                var CONVERT_TO_KIELER_FACTOR_2 = 180;
                var portId = targetDrawnode.id + "_tp1";
                var port = {
                    id: portId,
                    width: DEFAULT_PORT_WIDTH * CONVERT_TO_KIELER_FACTOR_2,
                    height: DEFAULT_PORT_HEIGHT * CONVERT_TO_KIELER_FACTOR_2,
                    properties: {
                        "de.cau.cs.kieler.portSide": "WEST"
                    },
                    x: 0,
                    y: 0
                };
                var targetGraph = modelIdToGraph.get(targetDrawnode.id);
                port.node = targetGraph;
                modelIdToTargetPort.set(targetDrawnode.id, port);
                (_b = (_a = targetGraph) === null || _a === void 0 ? void 0 : _a.ports) === null || _b === void 0 ? void 0 : _b.push(port);
                return port;
            }
        }
        //---------------------------- end inner functions
    } // END createEdgeBetweenSourceTarget
    function createEdgeHelper(sourceDrawnode, port1, targetDrawnode, port2, commId) {
        var _a, _b;
        var id = sourceDrawnode.id + "_to_" + targetDrawnode.id;
        var edge = lookForExistingEdge(sourceDrawnode, id);
        if (edge) {
            return edge;
        }
        edge = createNewEdge(id);
        setEdgeLayoutProperties(edge);
        edge.source = sourceDrawnode.id;
        edge.target = targetDrawnode.id;
        edge.sourcePort = port1.id;
        edge.targetPort = port2.id;
        if (port1.x && port1.y)
            edge.sourcePoint = { x: port1.x, y: port1.y };
        if (port2.x && port2.y)
            edge.targetPoint = { x: port2.x, y: port2.y };
        edge.sPort = port1;
        edge.tPort = port2;
        edge.sourceNode = sourceDrawnode;
        edge.targetNode = targetDrawnode;
        edge.communicationId = commId;
        var graph = modelIdToGraph.get(sourceDrawnode.id);
        (_b = (_a = graph) === null || _a === void 0 ? void 0 : _a.edges) === null || _b === void 0 ? void 0 : _b.push(edge);
        return edge;
        //inner function
        // looks for already existing edges
        function lookForExistingEdge(sourceDrawnode, id) {
            var _a;
            var edges = (_a = modelIdToGraph.get(sourceDrawnode.id)) === null || _a === void 0 ? void 0 : _a.edges;
            if (edges) {
                var length_1 = edges.length;
                for (var i = 0; i < length_1; i++) {
                    if (edges[i].id === id) {
                        return edges[i];
                    }
                }
            }
            return undefined;
        }
    } // END createEdgeHelper
    function createNewEdge(id) {
        var kielerEdge = {
            id: id
        };
        return kielerEdge;
    }
    function setEdgeLayoutProperties(edge) {
        var lineThickness = 0.06 * 4.0 + 0.01;
        var oldThickness = edge.thickness ? edge.thickness : 0.0;
        edge.thickness = Math.max(lineThickness * CONVERT_TO_KIELER_FACTOR, oldThickness);
    }
    function getDisplayName(nodeGroup, node) {
        if (isOpen(nodeGroup)) {
            if (node.name && node.name.length !== 0 && !node.name.startsWith("<")) {
                return node.name;
            }
            else {
                return node.ipAddress;
            }
        }
        else {
            return nodeGroup.name;
        }
    }
    function calculateRequiredLabelLength(text, quadSize) {
        if (text === null || text === "") {
            return 0;
        }
        return text.length * quadSize;
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
