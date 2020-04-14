import THREE from 'three';
import ApplicationMesh from 'explorviz-frontend/view-objects/3d/landscape/application-mesh';
import PlaneLabelMesh from 'explorviz-frontend/view-objects/3d/landscape/plane-label-mesh';
import NodeMesh from 'explorviz-frontend/view-objects/3d/landscape/node-mesh';
import SystemMesh from 'explorviz-frontend/view-objects/3d/landscape/system-mesh';
import NodeGroupMesh from 'explorviz-frontend/view-objects/3d/landscape/nodegroup-mesh';

export default class Labeler {
  systemLabelCache: Map<string, PlaneLabelMesh>;

  nodeGroupLabelCache: Map<string, PlaneLabelMesh>;

  nodeLabelCache: Map<string, PlaneLabelMesh>;

  appLabelCache: Map<string, PlaneLabelMesh>;

  collapseLabelCache: Map<string, PlaneLabelMesh>;

  constructor() {
    this.systemLabelCache = new Map();
    this.nodeGroupLabelCache = new Map();
    this.nodeLabelCache = new Map();
    this.appLabelCache = new Map();
    this.collapseLabelCache = new Map();
  }

  /**
 * Creates a label and adds it at a calculated position to the given system mesh
 *
 * @param systemMesh The mesh which shall be labeled
 * @param text Desired text
 * @param font Desired font of the text
 * @param color Desired color of the text
 */
  addSystemTextLabel(systemMesh: SystemMesh, text: string, font: THREE.Font,
    color: THREE.Color) {
    const labelMesh = Labeler.getLabel(this.systemLabelCache, font, text, 0.4, color);

    systemMesh.geometry.computeBoundingBox();
    const bboxParent = systemMesh.geometry.boundingBox;

    labelMesh.geometry.computeBoundingBox();
    const labelBoundingBox = labelMesh.geometry.boundingBox;

    const labelMeshLength = Math.abs(labelBoundingBox.max.x)
    - Math.abs(labelBoundingBox.min.x);

    // Position label centered at top of system mesh
    labelMesh.position.x = -(labelMeshLength / 2.0);
    labelMesh.position.y = bboxParent.max.y - 0.6;
    labelMesh.position.z = systemMesh.position.z + 0.01; // Just in front of parent mesh

    systemMesh.add(labelMesh);
  }

  /**
 * Creates a label with a collapse symbol and adds it at a calculated
 * position to the given mesh
 *
 * @param entityMesh Mesh which shall be labeled with a collapse symbol
 * @param font Desired font of the text
 * @param color Desired color of the text
 */
  addCollapseSymbol(entityMesh: SystemMesh | NodeGroupMesh, font: THREE.Font,
    color: THREE.Color) {
    const collapseSymbol = entityMesh.opened ? '-' : '+';

    const collapseSymbolMesh = Labeler.getLabel(this.collapseLabelCache, font,
      collapseSymbol, 0.35, color);

    entityMesh.geometry.computeBoundingBox();
    const bboxSystem = entityMesh.geometry.boundingBox;

    // Position on the top right corner of parent mesh
    collapseSymbolMesh.position.x = bboxSystem.max.x - 0.35;
    collapseSymbolMesh.position.y = bboxSystem.max.y - 0.35;
    collapseSymbolMesh.position.z = entityMesh.position.z + 0.01;

    entityMesh.add(collapseSymbolMesh);
  }


  /**
 * Creates a label and adds it at a calculated position to the given node mesh
 *
 * @param nodeMesh The mesh which shall be labeled
 * @param text Desired text
 * @param font Desired font of the text
 * @param color Desired color of the text
 */
  addNodeTextLabel(nodeMesh: NodeMesh, text: string, font: THREE.Font,
    color: THREE.Color) {
    const labelMesh = Labeler.getLabel(this.nodeLabelCache, font, text, 0.22, color);

    nodeMesh.geometry.computeBoundingBox();
    const bboxParent = nodeMesh.geometry.boundingBox;

    labelMesh.geometry.computeBoundingBox();
    const labelBoundingBox = labelMesh.geometry.boundingBox;

    const labelMeshLength = Math.abs(labelBoundingBox.max.x)
    - Math.abs(labelBoundingBox.min.x);

    // Add label centered at top of node mesh label
    labelMesh.position.x = -(labelMeshLength / 2.0);
    labelMesh.position.y = bboxParent.min.y + 0.2;
    labelMesh.position.z = nodeMesh.position.z + 0.01;

    nodeMesh.add(labelMesh);
  }

  /**
 * Creates a label and adds it at a calculated position to the given application mesh
 *
 * @param applicationMesh The mesh which shall be labeled
 * @param text Desired text
 * @param font Desired font of the text
 * @param color Desired color of the text
 */
  addApplicationTextLabel(applicationMesh: ApplicationMesh, text: string,
    font: THREE.Font, color: THREE.Color) {
    const labelMesh = Labeler.getLabel(this.appLabelCache, font, text, 0.25, color);

    applicationMesh.geometry.computeBoundingBox();
    const bboxParent = applicationMesh.geometry.boundingBox;

    labelMesh.geometry.computeBoundingBox();
    const labelBoundingBox = labelMesh.geometry.boundingBox;

    const labelHeight = Math.abs(labelBoundingBox.max.y) - Math.abs(labelBoundingBox.min.y);

    const PADDING_LEFT = 0.1;

    // Position label at left side of parent mesh: Leave space for app logo
    labelMesh.position.x = bboxParent.min.x + PADDING_LEFT;
    labelMesh.position.y = -(labelHeight / 2.0);
    labelMesh.position.z = applicationMesh.position.z + 0.001;

    applicationMesh.add(labelMesh);
  }

  /**
   * Dispose all meshes and remove references
   */
  clearCache() {
    this.systemLabelCache.forEach((label) => {
      label.delete();
    });
    this.systemLabelCache.clear();

    this.nodeGroupLabelCache.forEach((label) => {
      label.delete();
    });
    this.nodeGroupLabelCache.clear();

    this.nodeLabelCache.forEach((label) => {
      label.delete();
    });
    this.nodeLabelCache.clear();

    this.appLabelCache.forEach((label) => {
      label.delete();
    });
    this.appLabelCache.clear();

    this.collapseLabelCache.forEach((label) => {
      label.delete();
    });
    this.collapseLabelCache.clear();
  }

  /**
 * Calculates position of application logo and uses imageloader
 * to add the logo to the application mesh
 *
 * @param applicationMesh Mesh of application which shall be labeled
 * @param imageLoader Creates or returns cached image
 */
  static addApplicationLogo(applicationMesh: ApplicationMesh, imageLoader: any) {
    const application = applicationMesh.dataModel;

    applicationMesh.geometry.computeBoundingBox();

    const logoSize = {
      width: 0.4,
      height: 0.4,
    };

    const appBBox = applicationMesh.geometry.boundingBox;

    const logoPos = new THREE.Vector3();

    const RIGHT_PADDING = logoSize.width * 0.7;

    // Position at the very right of application mesh
    logoPos.x = appBBox.max.x - RIGHT_PADDING;

    const texturePartialPath = application.get('programmingLanguage').toLowerCase();

    // Create and add image to application mesh
    imageLoader.createPicture(logoPos, logoSize.width, logoSize.height,
      texturePartialPath, applicationMesh, 'label');
  }

  /**
   * Either returns a cached label or creates a new label with the given parameters
   *
   * @param labelCache Used to search for existing and matching label meshes
   * @param font Font of the text
   * @param text Text for label
   * @param size Size of text
   * @param color Color of text
   */
  static getLabel(labelCache: Map<string, PlaneLabelMesh>, font: THREE.Font, text: string,
    size: number, color: THREE.Color) {
    let labelMesh: PlaneLabelMesh;

    const maybeLabel = labelCache.get(text);

    // Only use matching cached labels which are not already in use
    if (maybeLabel && maybeLabel.defaultColor.getHexString() === color.getHexString()
    && maybeLabel.fontSize === size && !maybeLabel.parent) {
      labelMesh = maybeLabel;
    } else {
      labelMesh = new PlaneLabelMesh(font, text, size, color);
      labelCache.set(text, labelMesh);
    }

    return labelMesh;
  }
}
