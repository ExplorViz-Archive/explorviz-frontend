import Landscape from "explorviz-frontend/models/landscape";
import System from "explorviz-frontend/models/system";
import NodeGroup from "explorviz-frontend/models/nodegroup";
import Node from "explorviz-frontend/models/node";
import Application from "explorviz-frontend/models/application";

export function reduceLandscape(landscape: Landscape) : ReducedLandscape {
  let applicationIdToApplicationMap = new Map<string, ReducedApplication>();

  let systems = landscape.get('systems').toArray();
  let reducedSystems = systems.map(child => reduceSystem(child));

  let applicationCommunications = landscape.get('totalApplicationCommunications').toArray();

  let reducedApplicationCommunications = applicationCommunications.map(applicationCommunication => {
    let sourceApplication = applicationIdToApplicationMap.get(applicationCommunication.get('sourceApplication').get('id')) as ReducedApplication;
    let targetApplication = applicationIdToApplicationMap.get(applicationCommunication.get('targetApplication').get('id')) as ReducedApplication;

    return {
      id: applicationCommunication.get('id'),
      sourceApplication,
      targetApplication
    }
  });

  let reducedLandscape = {
    id: landscape.get('id'),
    systems: reducedSystems,
    applicationCommunications: reducedApplicationCommunications
  };

  reducedSystems.forEach((system) => {
    system.parent = reducedLandscape;
  });

  return reducedLandscape;

  function reduceSystem(system: System) : ReducedSystem {
    let nodeGroups = system.get('nodegroups').toArray();
    let reducedNodeGroups = nodeGroups.map(nodeGroup => reduceNodeGroup(nodeGroup));
  
    let reducedSystem = {
      id: system.get('id'),
      name: system.get('name'),
      nodeGroups: reducedNodeGroups
    }
  
    reducedNodeGroups.forEach((nodeGroup) => {
      nodeGroup.parent = reducedSystem;
    });
  
    return reducedSystem;
  }
  
  function reduceNodeGroup(nodeGroup: NodeGroup) : ReducedNodeGroup {
    let nodes = nodeGroup.get('nodes').toArray();
    let reducedNodes = nodes.map(node => reduceNode(node)).sort((a, b) => a.ipAddress.localeCompare(b.ipAddress));
  
    let reducedNodeGroup = {
      id: nodeGroup.get('id'),
      name: nodeGroup.get('name'),
      nodes: reducedNodes,
    }
  
    reducedNodes.forEach((node) => {
      node.parent = reducedNodeGroup;
    });
  
    return reducedNodeGroup;
  }
  
  function reduceNode(node: Node) : ReducedNode {
    let applications = node.get('applications').toArray();
    let reducedApplications = applications.map(application => reduceApplication(application));

    reducedApplications.forEach((application) => {
      applicationIdToApplicationMap.set(application.id, application);
    });
  
    let reducedNode = {
      id: node.get('id'),
      name: node.get('name'),
      ipAddress: node.get('ipAddress'),
      applications: reducedApplications
    }
  
    reducedApplications.forEach((application) => {
      application.parent = reducedNode;
    });
  
    return reducedNode;
  }
  
  function reduceApplication(application: Application) : ReducedApplication {
    return {
      id: application.get('id'),
      name: application.get('name'),
      type: 'application'
    }
  }
}

export interface ReducedLandscape {
  id: string;
  systems: ReducedSystem[];
  applicationCommunications: ReducedApplicationCommunication[];
}

export interface ReducedSystem {
  id: string;
  name: string;
  nodeGroups: ReducedNodeGroup[];
  parent?: ReducedLandscape;
}

export interface ReducedNodeGroup {
  id: string;
  name: string;
  nodes: ReducedNode[];
  parent?: ReducedSystem;
}

export interface ReducedNode {
  id: string;
  name: string;
  ipAddress: string;
  applications: ReducedApplication[];
  parent?: ReducedNodeGroup;
}

export interface ReducedApplication {
  id: string;
  name: string;
  parent?: ReducedNode;
  type: 'application';
}

export interface ReducedApplicationCommunication {
  id: string;
  sourceApplication: ReducedApplication;
  targetApplication: ReducedApplication;
}