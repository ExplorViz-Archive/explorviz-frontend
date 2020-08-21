import THREE from 'three';
import ApplicationMesh from 'explorviz-frontend/view-objects/3d/landscape/application-mesh';
import PlaneLabelMesh from 'explorviz-frontend/view-objects/3d/landscape/plane-label-mesh';
import NodeMesh from 'explorviz-frontend/view-objects/3d/landscape/node-mesh';
import SystemMesh from 'explorviz-frontend/view-objects/3d/landscape/system-mesh';
import NodeGroupMesh from 'explorviz-frontend/view-objects/3d/landscape/nodegroup-mesh';

export default class Labeler {
  systemLabelCache: Map<string, PlaneLabelMesh> = new Map();

  nodeGroupLabelCache: Map<string, PlaneLabelMesh> = new Map();

  nodeLabelCache: Map<string, PlaneLabelMesh> = new Map();

  appLabelCache: Map<string, PlaneLabelMesh> = new Map();

  collapseLabelCache: Map<string, PlaneLabelMesh> = new Map();

  /**
 * Creates a label and adds it at a calculated position to the given system mesh
 *
 * @param systemMesh The mesh which shall be labeled
 * @param text Desired text
 * @param font Desired font of the text
 * @param color Desired color of the text
 */
  addSystemTextLabel(systemMesh: SystemMesh, text: string, font: THREE.Font,
    color: THREE.Color, fontSize = 0.4, yOffset = 0.6) {
    const labelMesh = Labeler.getLabel(this.systemLabelCache, font, text, fontSize, color);

    systemMesh.geometry.computeBoundingBox();
    const bboxParent = systemMesh.geometry.boundingBox;

    labelMesh.geometry.computeBoundingBox();
    const labelBoundingBox = labelMesh.geometry.boundingBox;

    const labelMeshLength = Math.abs(labelBoundingBox.max.x)
    - Math.abs(labelBoundingBox.min.x);

    // Position label centered at top of system mesh
    labelMesh.position.x = -(labelMeshLength / 2.0);
    labelMesh.position.y = bboxParent.max.y - yOffset;
    labelMesh.position.z = bboxParent.max.z + 0.001; // Just in front of parent mesh

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
    color: THREE.Color, fontSize = 0.35, xOffset = 0.35, yOffset = 0.35) {
    const collapseSymbol = entityMesh.opened ? '-' : '+';

    const collapseSymbolMesh = Labeler.getLabel(this.collapseLabelCache, font,
      collapseSymbol, fontSize, color);

    entityMesh.geometry.computeBoundingBox();
    const bboxSystem = entityMesh.geometry.boundingBox;

    // Position on the top right corner of parent mesh
    collapseSymbolMesh.position.x = bboxSystem.max.x - xOffset;
    collapseSymbolMesh.position.y = bboxSystem.max.y - yOffset;
    collapseSymbolMesh.position.z = bboxSystem.max.z + 0.001;

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
    color: THREE.Color, fontSize = 0.22, yOffset = 0.2) {
    const labelMesh = Labeler.getLabel(this.nodeLabelCache, font, text, fontSize, color);

    nodeMesh.geometry.computeBoundingBox();
    const bboxParent = nodeMesh.geometry.boundingBox;

    labelMesh.geometry.computeBoundingBox();
    const labelBoundingBox = labelMesh.geometry.boundingBox;

    const labelMeshLength = Math.abs(labelBoundingBox.max.x)
    - Math.abs(labelBoundingBox.min.x);

    // Add label centered at top of node mesh label
    labelMesh.position.x = -(labelMeshLength / 2.0);
    labelMesh.position.y = bboxParent.min.y + yOffset;
    labelMesh.position.z = bboxParent.max.z + 0.001;

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
    font: THREE.Font, color: THREE.Color, fontSize = 0.25, xOffset = 0.1) {
    const labelMesh = Labeler.getLabel(this.appLabelCache, font, text, fontSize, color);

    applicationMesh.geometry.computeBoundingBox();
    const bboxParent = applicationMesh.geometry.boundingBox;

    labelMesh.geometry.computeBoundingBox();
    const labelBoundingBox = labelMesh.geometry.boundingBox;

    const labelHeight = Math.abs(labelBoundingBox.max.y) - Math.abs(labelBoundingBox.min.y);

    // Position label at left side of parent mesh: Leave space for app logo
    labelMesh.position.x = bboxParent.min.x + xOffset;
    labelMesh.position.y = -(labelHeight / 2.0);
    labelMesh.position.z = bboxParent.max.z + 0.001;

    applicationMesh.add(labelMesh);
  }

  /**
   * Dispose all meshes and remove references
   */
  clearCache() {
    this.systemLabelCache.forEach((label) => {
      label.disposeRecursively();
    });
    this.systemLabelCache.clear();

    this.nodeGroupLabelCache.forEach((label) => {
      label.disposeRecursively();
    });
    this.nodeGroupLabelCache.clear();

    this.nodeLabelCache.forEach((label) => {
      label.disposeRecursively();
    });
    this.nodeLabelCache.clear();

    this.appLabelCache.forEach((label) => {
      label.disposeRecursively();
    });
    this.appLabelCache.clear();

    this.collapseLabelCache.forEach((label) => {
      label.disposeRecursively();
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
  static addApplicationLogo(applicationMesh: ApplicationMesh, imageLoader: any,
    width = 0.4, height = 0.4) {
    const application = applicationMesh.dataModel;

    applicationMesh.geometry.computeBoundingBox();

    const appBBox = applicationMesh.geometry.boundingBox;

    const logoPos = new THREE.Vector3();

    const RIGHT_PADDING = width * 0.7;

    // Position at the very right of application mesh
    logoPos.x = appBBox.max.x - RIGHT_PADDING;
    logoPos.z = appBBox.max.z + 0.001;

    const texturePartialPath = application.get('programmingLanguage').toLowerCase();

    // Create and add image to application mesh
    imageLoader.createPicture(logoPos, width, height,
      texturePartialPath, applicationMesh);
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

    // Label with matching text and text size exists
    if (maybeLabel && maybeLabel.fontSize === size) {
      // Color also matches and label mesh is not in use => Use cached label
      if (maybeLabel.defaultColor.getHexString() === color.getHexString() && !maybeLabel.parent) {
        labelMesh = maybeLabel;
      // Only text and text size fit => Re-use text geometry
      } else {
        labelMesh = new PlaneLabelMesh(font, text, size, color, maybeLabel.geometry);
      }
    // No matching label mesh is cached => Create new label and cache it
    } else {
      labelMesh = new PlaneLabelMesh(font, text, size, color);
      labelCache.set(text, labelMesh);
    }

    return labelMesh;
  }
}
