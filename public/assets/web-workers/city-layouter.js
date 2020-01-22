var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
// Wait for the initial message event.
self.addEventListener('message', function (e) {
    var data = e.data;
    var port = e.ports[0];
    // Do your stuff here.
    if (port) {
        // Message sent through a worker created with 'open' method.
        port.postMessage({ foo: 'foo' });
    }
    else {
        // Message sent through a worker created with 'send' or 'on' method.
        var application = applyBoxLayout(data);
        postMessage(application);
    }
}, false);
// Ping the Ember service to say that everything is ok.
postMessage(true);
function applyBoxLayout(application) {
    function getAllClazzesInApplication(application) {
        var allComponents = getAllComponentsInApplication(application);
        var allClazzes = [];
        allComponents.forEach(function (component) {
            allClazzes.push.apply(allClazzes, component.clazzes);
        });
        return allClazzes;
    }
    function getAllComponentsInApplication(application) {
        var children = application.components;
        var components = [];
        children.forEach(function (component) {
            components.push.apply(components, __spreadArrays(getAllComponents(component), [component]));
        });
        return components;
    }
    function getAllComponents(component) {
        var components = [];
        component.children.forEach(function (component) {
            components.push.apply(components, __spreadArrays(getAllComponents(component), [component]));
        });
        return components;
    }
    var INSET_SPACE = 4.0;
    var OPENED_COMPONENT_HEIGHT = 1.5;
    var layoutMap = new Map();
    layoutMap.set(application.id, {
        height: 1,
        width: 1,
        depth: 1,
        positionX: 0,
        positionY: 0,
        positionZ: 0
    });
    getAllClazzesInApplication(application).forEach(function (clazz) {
        layoutMap.set(clazz.id, {
            height: 1,
            width: 1,
            depth: 1,
            positionX: 0,
            positionY: 0,
            positionZ: 0
        });
    });
    getAllComponentsInApplication(application).forEach(function (component) {
        layoutMap.set(component.id, {
            height: 1,
            width: 1,
            depth: 1,
            positionX: 0,
            positionY: 0,
            positionZ: 0
        });
    });
    calcClazzHeight(application);
    initApplication(application);
    doApplicationLayout(application);
    setAbsoluteLayoutPositionOfApplication(application);
    // Scale dimensions for needs of application rendering
    layoutMap.forEach(function (box) {
        box.positionX *= 0.5;
        box.positionZ *= 0.5;
        box.width *= 0.5;
        box.depth *= 0.5;
    });
    return layoutMap;
    // Helper functions
    function setAbsoluteLayoutPositionOfApplication(application) {
        var components = application.components;
        var componentLayout = layoutMap.get(application.id);
        components.forEach(function (childComponent) {
            var childCompLayout = layoutMap.get(childComponent.id);
            childCompLayout.positionX += componentLayout.positionX;
            childCompLayout.positionY += componentLayout.positionY + OPENED_COMPONENT_HEIGHT;
            childCompLayout.positionZ += componentLayout.positionZ;
            setAbsoluteLayoutPosition(childComponent);
        });
    }
    function setAbsoluteLayoutPosition(component) {
        var childComponents = component.children;
        var clazzes = component.clazzes;
        var componentLayout = layoutMap.get(component.id);
        childComponents.forEach(function (childComponent) {
            var childCompLayout = layoutMap.get(childComponent.id);
            childCompLayout.positionX += componentLayout.positionX;
            childCompLayout.positionY += componentLayout.positionY + OPENED_COMPONENT_HEIGHT;
            childCompLayout.positionZ += componentLayout.positionZ;
            setAbsoluteLayoutPosition(childComponent);
        });
        clazzes.forEach(function (clazz) {
            var clazzLayout = layoutMap.get(clazz.id);
            clazzLayout.positionX += componentLayout.positionX;
            clazzLayout.positionY += componentLayout.positionY + OPENED_COMPONENT_HEIGHT;
            clazzLayout.positionZ += componentLayout.positionZ;
        });
    }
    function calcClazzHeight(application) {
        var CLAZZ_SIZE_DEFAULT = 0.05;
        var CLAZZ_SIZE_EACH_STEP = 1.1;
        var clazzes = [];
        application.components.forEach(function (component) {
            getClazzList(component, clazzes);
        });
        var instanceCountList = [];
        clazzes.forEach(function (clazz) {
            instanceCountList.push(clazz.instanceCount);
        });
        var categories = getCategories(instanceCountList, false);
        clazzes.forEach(function (clazz) {
            var clazzData = layoutMap.get(clazz.id);
            clazzData.height = (CLAZZ_SIZE_EACH_STEP * categories[clazz.instanceCount] + CLAZZ_SIZE_DEFAULT) * 2.0;
        });
    }
    function getCategories(list, linear) {
        var result = [];
        if (list.length === 0) {
            return result;
        }
        list.sort();
        if (linear) {
            var listWithout0_1 = [];
            list.forEach(function (entry) {
                if (entry !== 0) {
                    listWithout0_1.push(entry);
                }
            });
            if (listWithout0_1.length === 0) {
                result.push(0.0);
                return result;
            }
            useLinear(listWithout0_1, list, result);
        }
        else {
            var listWithout0And1_1 = [];
            list.forEach(function (entry) {
                if (entry !== 0 && entry !== 1) {
                    listWithout0And1_1.push(entry);
                }
            });
            if (listWithout0And1_1.length === 0) {
                result.push(0.0);
                result.push(1.0);
                return result;
            }
            useThreshholds(listWithout0And1_1, list, result);
        }
        return result;
        // inner helper functions
        function useThreshholds(listWithout0And1, list, result) {
            var max = 1;
            listWithout0And1.forEach(function (value) {
                if (value > max) {
                    max = value;
                }
            });
            var oneStep = max / 3.0;
            var t1 = oneStep;
            var t2 = oneStep * 2;
            list.forEach(function (entry) {
                var categoryValue = getCategoryFromValues(entry, t1, t2);
                result[entry] = categoryValue;
            });
        }
        function getCategoryFromValues(value, t1, t2) {
            if (value === 0) {
                return 0.0;
            }
            else if (value === 1) {
                return 1.0;
            }
            if (value <= t1) {
                return 2.0;
            }
            else if (value <= t2) {
                return 3.0;
            }
            else {
                return 4.0;
            }
        }
        function useLinear(listWithout0, list, result) {
            var max = 1;
            var secondMax = 1;
            listWithout0.forEach(function (value) {
                if (value > max) {
                    secondMax = max;
                    max = value;
                }
            });
            var oneStep = secondMax / 4.0;
            var t1 = oneStep;
            var t2 = oneStep * 2;
            var t3 = oneStep * 3;
            list.forEach(function (entry) {
                var categoryValue = getCategoryFromLinearValues(entry, t1, t2, t3);
                result[entry] = categoryValue;
            });
        }
        function getCategoryFromLinearValues(value, t1, t2, t3) {
            if (value <= 0) {
                return 0;
            }
            else if (value <= t1) {
                return 1.5;
            }
            else if (value <= t2) {
                return 2.5;
            }
            else if (value <= t3) {
                return 4.0;
            }
            else {
                return 6.5;
            }
        }
    } // END getCategories
    function getClazzList(component, clazzesArray) {
        var children = component.children;
        var clazzes = component.clazzes;
        children.forEach(function (child) {
            getClazzList(child, clazzesArray);
        });
        clazzes.forEach(function (clazz) {
            clazzesArray.push(clazz);
        });
    }
    function initApplication(application) {
        var components = application.components;
        components.forEach(function (child) {
            initNodes(child);
        });
        var componentData = layoutMap.get(application.id);
        componentData.height = getHeightOfApplication(application);
        componentData.width = -1.0;
        componentData.depth = -1.0;
    }
    function initNodes(component) {
        var children = component.children;
        var clazzes = component.clazzes;
        var clazzWidth = 2.0;
        children.forEach(function (child) {
            initNodes(child);
        });
        clazzes.forEach(function (clazz) {
            var clazzData = layoutMap.get(clazz.id);
            clazzData.depth = clazzWidth;
            clazzData.width = clazzWidth;
        });
        var componentData = layoutMap.get(component.id);
        componentData.height = getHeightOfComponent(component);
        componentData.width = -1.0;
        componentData.depth = -1.0;
    }
    function getHeightOfComponent(component) {
        var floorHeight = 0.75 * 4.0;
        var childrenHeight = floorHeight;
        var children = component.children;
        var clazzes = component.clazzes;
        clazzes.forEach(function (clazz) {
            var clazzData = layoutMap.get(clazz.id);
            var height = clazzData.height;
            if (height > childrenHeight) {
                childrenHeight = height;
            }
        });
        children.forEach(function (child) {
            var childData = layoutMap.get(child.id);
            if (childData.height > childrenHeight) {
                childrenHeight = childData.height;
            }
        });
        return childrenHeight + 0.1;
    }
    function getHeightOfApplication(application) {
        var floorHeight = 0.75 * 4.0;
        var childrenHeight = floorHeight;
        var components = application.components;
        components.forEach(function (child) {
            var childData = layoutMap.get(child.id);
            if (childData.height > childrenHeight) {
                childrenHeight = childData.height;
            }
        });
        return childrenHeight + 0.1;
    }
    function doApplicationLayout(application) {
        var components = application.components;
        components.forEach(function (child) {
            doLayout(child);
        });
        layoutChildrenOfApplication(application);
    }
    function layoutChildrenOfApplication(application) {
        var tempList = [];
        var components = application.components;
        components.forEach(function (child) {
            tempList.push(child);
        });
        var segment = layoutGeneric(tempList);
        var componentData = layoutMap.get(application.id);
        componentData.width = segment.width;
        componentData.depth = segment.height;
    }
    function doLayout(component) {
        var children = component.children;
        children.forEach(function (child) {
            doLayout(child);
        });
        layoutChildren(component);
    }
    function layoutChildren(component) {
        var tempList = [];
        var children = component.children;
        var clazzes = component.clazzes;
        clazzes.forEach(function (clazz) {
            tempList.push(clazz);
        });
        children.forEach(function (child) {
            tempList.push(child);
        });
        var segment = layoutGeneric(tempList);
        var componentData = layoutMap.get(component.id);
        componentData.width = segment.width;
        componentData.depth = segment.height;
    }
    function layoutGeneric(children) {
        var rootSegment = createRootSegment(children);
        var maxX = 0.0;
        var maxZ = 0.0;
        // Sort by width and by name (for entities with same width)
        children.sort(function (e1, e2) {
            var e1Width = layoutMap.get(e1.id).width;
            var e2Width = layoutMap.get(e2.id).width;
            var result = e1Width - e2Width;
            if ((-0.00001 < result) && (result < 0.00001)) {
                return e1.name.localeCompare(e2.name);
            }
            if (result < 0) {
                return 1;
            }
            else {
                return -1;
            }
        });
        children.forEach(function (child) {
            var childData = layoutMap.get(child.id);
            var childWidth = (childData.width + INSET_SPACE * 2);
            var childHeight = (childData.depth + INSET_SPACE * 2);
            childData.positionY = 0.0;
            var foundSegment = insertFittingSegment(rootSegment, childWidth, childHeight);
            if (foundSegment) {
                childData.positionX = foundSegment.startX + INSET_SPACE;
                childData.positionZ = foundSegment.startZ + INSET_SPACE;
                if (foundSegment.startX + childWidth > maxX) {
                    maxX = foundSegment.startX + childWidth;
                }
                if (foundSegment.startZ + childHeight > maxZ) {
                    maxZ = foundSegment.startZ + childHeight;
                }
            }
        });
        rootSegment.width = maxX;
        rootSegment.height = maxZ;
        // Add labelInset space
        children.forEach(function (child) {
            var childData = layoutMap.get(child.id);
            childData.positionX = childData.positionX + INSET_SPACE;
        });
        rootSegment.width += INSET_SPACE;
        return rootSegment;
        function insertFittingSegment(rootSegment, toFitWidth, toFitHeight) {
            if (!rootSegment.used && toFitWidth <= rootSegment.width && toFitHeight <= rootSegment.height) {
                var resultSegment = createLayoutSegment();
                rootSegment.upperRightChild = createLayoutSegment();
                rootSegment.lowerChild = createLayoutSegment();
                resultSegment.startX = rootSegment.startX;
                resultSegment.startZ = rootSegment.startZ;
                resultSegment.width = toFitWidth;
                resultSegment.height = toFitHeight;
                resultSegment.parent = rootSegment;
                rootSegment.upperRightChild.startX = rootSegment.startX + toFitWidth;
                rootSegment.upperRightChild.startZ = rootSegment.startZ;
                rootSegment.upperRightChild.width = rootSegment.width - toFitWidth;
                rootSegment.upperRightChild.height = toFitHeight;
                rootSegment.upperRightChild.parent = rootSegment;
                if (rootSegment.upperRightChild.width <= 0.0) {
                    rootSegment.upperRightChild = null;
                }
                rootSegment.lowerChild.startX = rootSegment.startX;
                rootSegment.lowerChild.startZ = rootSegment.startZ + toFitHeight;
                rootSegment.lowerChild.width = rootSegment.width;
                rootSegment.lowerChild.height = rootSegment.height - toFitHeight;
                rootSegment.lowerChild.parent = rootSegment;
                if (rootSegment.lowerChild.height <= 0.0) {
                    rootSegment.lowerChild = null;
                }
                rootSegment.used = true;
                return resultSegment;
            }
            else {
                var resultFromUpper = null;
                var resultFromLower = null;
                if (rootSegment.upperRightChild != null) {
                    resultFromUpper = insertFittingSegment(rootSegment.upperRightChild, toFitWidth, toFitHeight);
                }
                if (rootSegment.lowerChild != null) {
                    resultFromLower = insertFittingSegment(rootSegment.lowerChild, toFitWidth, toFitHeight);
                }
                if (resultFromUpper == null) {
                    return resultFromLower;
                }
                else if (resultFromLower == null) {
                    return resultFromUpper;
                }
                else {
                    // choose best fitting square
                    var upperBoundX = resultFromUpper.startX + resultFromUpper.width;
                    var lowerBoundZ = resultFromLower.startZ + resultFromLower.height;
                    if (upperBoundX <= lowerBoundZ && resultFromLower.parent) {
                        resultFromLower.parent.used = false;
                        return resultFromUpper;
                    }
                    else if (resultFromUpper.parent) {
                        resultFromUpper.parent.used = false;
                        return resultFromLower;
                    }
                    else {
                        return null;
                    }
                }
            }
        }
    } // END layoutGeneric
    function createRootSegment(children) {
        var worstCaseWidth = 0.0;
        var worstCaseHeight = 0.0;
        children.forEach(function (child) {
            var childData = layoutMap.get(child.id);
            worstCaseWidth += childData.width + INSET_SPACE * 2;
            worstCaseHeight += childData.depth + INSET_SPACE * 2;
        });
        var rootSegment = createLayoutSegment();
        rootSegment.startX = 0.0;
        rootSegment.startZ = 0.0;
        rootSegment.width = worstCaseWidth;
        rootSegment.height = worstCaseHeight;
        return rootSegment;
    }
    function createLayoutSegment() {
        var layoutSegment = {
            parent: null,
            lowerChild: null,
            upperRightChild: null,
            startX: 0,
            startZ: 0,
            width: 1,
            height: 1,
            used: false
        };
        return layoutSegment;
    } // END createLayoutSegment
}
